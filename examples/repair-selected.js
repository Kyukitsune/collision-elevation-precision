// Optional Script macro. Normal collision prevention does not need this macro.
const api = globalThis.CollisionElevationPrecision;
if (!api) ui.notifications.warn("Enable Collision Elevation Precision first.");
else if (!canvas.tokens.controlled.length) ui.notifications.warn("Select the affected tokens first.");
else {
  const result = await api.repairSelectedAtLevel();
  ui.notifications.info(`${result.repaired} repaired, ${result.ignored} unchanged.`);
}
