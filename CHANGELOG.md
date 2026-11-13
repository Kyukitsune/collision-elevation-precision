# Changelog

## 0.1.0 — 2026-11-13

First shareable package of the correction deployed on 2026-11-12. Runtime JavaScript is unchanged from that tested implementation.

- Prevents a floating-point residue at the last point of a blocked horizontal movement.
- Preserves native collision X/Y, level, dimensions and terrain.
- Includes an optional selected-token repair example, French/English documentation and an MIT license selected by the project creator.
- Limits activation to Foundry generation 14, minimum 14.364, verified through 14.370.
- Manual ZIP distribution works without hosting; a publishing helper can generate GitHub release URLs.

Intermediate-elevation validation remains incomplete. Other game systems have not been verified in play. No performance guarantee applies to every scene or module combination.
