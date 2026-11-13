# Collision Elevation Precision

[Documentation française](README.md)

Foundry VTT 14 can turn elevation 4 into 3.9999999999999996 when horizontal movement hits a wall. This tiny residue can place a token below its floor. The module preserves the starting elevation when the final collision point differs only by floating-point precision.

## Install

Extract the ZIP into `Data/modules/collision-elevation-precision/`, with `module.json` directly inside that directory. Restart Foundry, enable **Collision Elevation Precision** in the world, and reload connected clients. A publisher-provided manifest URL also supports the native module installer.

## Use

New blocked horizontal movement is handled automatically. No macro is needed during normal play. Installation does not scan or rewrite existing tokens.

For tokens already affected, optionally copy `examples/repair-selected.js` into a Script macro and run it on selected tokens. It only repairs minute differences from the bottom of their current level, respects ownership, and performs at most one grouped update. Distinct elevations are left intact.

## Scope

Requires Foundry 14.364 or later within generation 14. In-world checks used Long Hu on 14.364 and 14.370. There is no dependency on that system or on another module, but other systems have not been verified in play. Versions 13 and 15 are unsupported.

The patch handles the final point of a blocked horizontal segment with unchanged level and dimensions. It preserves native X/Y, terrain and collision behavior. Token artwork may still overlap a wall. Deliberate vertical movement is not rounded to the floor. Validation of intermediate elevations, especially 4.5 with multiple active modules, remains incomplete; this is an initial release rather than a general elevation engine.

There are no timers, network requests, telemetry, extra wall searches, automatic corrective document updates or vision refreshes. The patch runs synchronously in `Token.constrainMovementPath`. A corrected path is copied without mutating the original arguments. This does not remove the cost of native movement animation or lighting.

Modules overriding the same method can conflict. Disable this module and reload clients to return to native behavior. Bug reports should include Foundry/system/module versions, starting and final coordinates/elevations, and a reproducible movement.

## License

**MIT**, see [LICENSE](LICENSE). Long Hu project, with technical assistance from Codex. No Foundry core source, commercial artwork, actors or scenes are included. Do not label this package as made without AI assistance.
