const DIMENSIONS = ["width", "height", "depth", "shape"];

/** Stabilise seulement un résidu de précision d'un segment horizontal interrompu. */
export function stabilizeCollisionElevation(waypoints, result, options = {}) {
  if (options?.ignoreWalls || !Array.isArray(waypoints) || !Array.isArray(result)
    || result[1] !== true || !Array.isArray(result[0])) return result;
  const path = result[0];
  const index = path.length - 1;
  if (index < 1 || index >= waypoints.length) return result;
  const last = path[index], prior = path[index - 1], target = waypoints[index];
  if (!last || !prior || !target || last.explicit !== false || last.checkpoint !== false
    || last.intermediate !== false || (last.x === target.x && last.y === target.y)) return result;
  const elevation = prior.elevation;
  const actual = last.elevation;
  if (!Number.isFinite(elevation) || !Number.isFinite(actual) || actual === elevation
    || (target.elevation ?? elevation) !== elevation) return result;
  if (last.level !== prior.level || (target.level ?? prior.level) !== prior.level) return result;
  for (const key of DIMENSIONS) {
    if (last[key] !== prior[key] || (target[key] ?? prior[key]) !== prior[key]) return result;
  }
  // Tolérance de quelques unités de précision machine ; aucun arrondi à l'entier/au plancher.
  const tolerance = 8 * Number.EPSILON * Math.max(1, Math.abs(elevation), Math.abs(actual));
  if (Math.abs(actual - elevation) > tolerance) return result;
  const correctedPath = path.slice();
  correctedPath[index] = {...last, elevation};
  const corrected = result.slice();
  corrected[0] = correctedPath;
  return corrected;
}
