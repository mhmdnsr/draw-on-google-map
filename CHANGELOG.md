# Changelog

All notable changes to this project are documented in this file.

## [2.0.0] - 2026-02-27

### Added
- New drawing tools: `polyline`, `circle`, and `rectangle`.
- Event API: `on`, `off` with lifecycle events (`toolChanged`, `shapeCreated`, `shapeCleared`, `clearedAll`, `imported`, `exported`, `error`).
- Serialization API with JSON and GeoJSON support: `exportData` and `importData`.
- Explicit `destroy()` lifecycle method for cleanup in SPA usage.
- New framework examples for React, Vue, Angular, and Vanilla usage.

### Changed
- Full TypeScript rewrite of the library internals.
- Per-instance state management architecture (no shared global drawing state).
- Modernized build pipeline using Vite + TypeScript declarations.
- Public package identity standardized to `draw-on-google-maps`.

### Fixed
- Tool selection now safely returns `null` when no tool is active.
- Numeric edge cases: `changeStrokeWeight(0)` and `changePolygonOpacity(0)` are handled correctly.
- Listener cleanup now removes only owned listeners.
- Marker cleanup handles both legacy and advanced marker implementations.
- Test suite imports and lifecycle coverage corrected.

### Breaking
- Legacy DrawingManager-based behavior is removed from v1 implementation strategy.
- Consumers relying on internal classes or internal state shape must migrate to the documented public API.

### Docs
- README rewritten as single source of truth for setup, API, events, serialization, and migration.
- Release notes aligned with structured changelog entries.
