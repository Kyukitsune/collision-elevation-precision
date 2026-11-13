import {stabilizeCollisionElevation} from "./stabilize.mjs";

const KEY = Symbol.for("collision-elevation-precision.runtime");
const METHOD = "constrainMovementPath";

export function installCollisionPrecision() {
  const existing = globalThis[KEY];
  if (existing?.installed) { existing.enabled = true; return true; }
  if (Number(globalThis.game?.release?.generation) !== 14) return false;
  const prototype = globalThis.CONFIG?.Token?.objectClass?.prototype;
  const original = prototype?.[METHOD];
  if (typeof original !== "function") return false;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, METHOD);
  const state = {prototype, original, descriptor, installed: true, enabled: true, wrapped: null};
  state.wrapped = function (...args) {
    const result = Reflect.apply(original, this, args);
    return state.enabled ? stabilizeCollisionElevation(args[0], result, args[1]) : result;
  };
  Object.defineProperty(prototype, METHOD, {value: state.wrapped, configurable: true, writable: true});
  globalThis[KEY] = state;
  return true;
}

export function uninstallCollisionPrecision() {
  const state = globalThis[KEY];
  if (!state?.installed) return true;
  state.enabled = false;
  // Préserver un éventuel autre wrapper installé depuis, sans écraser son travail.
  if (state.prototype[METHOD] !== state.wrapped) return false;
  if (state.descriptor) Object.defineProperty(state.prototype, METHOD, state.descriptor);
  else delete state.prototype[METHOD];
  state.installed = false;
  return true;
}

/** Action volontaire, une seule écriture groupée, pour des pions déjà atteints avant installation. */
export async function repairSelectedAtLevel() {
  const scene = globalThis.canvas?.scene;
  const tokens = globalThis.canvas?.tokens?.controlled ?? [];
  if (!scene) return {repaired: 0, ignored: tokens.length};
  const updates = [];
  for (const token of tokens) {
    const doc = token.document;
    if (!doc?.isOwner || doc.parent?.id !== scene.id) continue;
    const actual = doc._source.elevation;
    const expected = scene.levels.get(doc._source.level)?.elevation.bottom;
    if (!Number.isFinite(actual) || !Number.isFinite(expected) || actual === expected) continue;
    const tolerance = 8 * Number.EPSILON * Math.max(1, Math.abs(actual), Math.abs(expected));
    if (Math.abs(actual - expected) <= tolerance) updates.push({_id: doc.id, elevation: expected});
  }
  if (updates.length) await scene.updateEmbeddedDocuments("Token", updates, {
    teleport: true, collisionElevationPrecisionRepair: true
  });
  return {repaired: updates.length, ignored: tokens.length - updates.length};
}

globalThis.CollisionElevationPrecision = Object.freeze({
  install: installCollisionPrecision,
  uninstall: uninstallCollisionPrecision,
  repairSelectedAtLevel,
  status: () => ({installed: Boolean(globalThis[KEY]?.installed), enabled: Boolean(globalThis[KEY]?.enabled)})
});

if (globalThis.game?.ready) installCollisionPrecision();
else globalThis.Hooks?.once("ready", installCollisionPrecision);
