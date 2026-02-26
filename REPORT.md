# Review Report: Draw On Google Map

## 1. Google Maps API Updates & Breaking Changes

### 🚨 Critical: `DrawingManager` Deprecation
The library heavily relies on `google.maps.drawing.DrawingManager` for user interaction (drawing polygons and markers).
**Status:** Deprecated as of **August 2025**.
**Removal Date:** **May 2026**.
**Impact:** The library will **cease to function** in May 2026.
**Action Required:**
-   **Immediate:** Plan a migration away from `DrawingManager`.
-   **Alternative:** Implement custom drawing logic using `google.maps` events (e.g., listening to `click` and `mousemove` to draw Polygons and Markers manually) or adopt a third-party drawing library that doesn't depend on the deprecated `DrawingManager` (e.g., `Terra Draw`).

### ⚠️ Warning: `google.maps.Marker` Deprecation
The library uses the legacy `google.maps.Marker` class (via `DrawingManager` and potentially internally).
**Status:** Deprecated as of **February 21, 2024 (v3.56)**.
**Recommendation:** Migrate to `google.maps.marker.AdvancedMarkerElement`.
**Impact:** While legacy markers still work, they will eventually be removed. `AdvancedMarkerElement` offers better performance and customization.
**Note:** `DrawingManager` likely produces legacy markers. If you move away from `DrawingManager`, you should ensure your new drawing logic creates `AdvancedMarkerElement` instances.

---

## 2. Issues & Bugs

### 🔴 Critical: Global Shared State (Singleton Store)
**Description:** The library uses a global singleton store (`src/draw-on-map/store/index.js`) to manage state (selected tool, color, etc.).
**Impact:** All instances of `MapDraw` share the exact same state.
**Consequence:** It is **impossible** to have two independent maps on the same page using this library. Changing the color on Map A will also change the color on Map B.
**Verification:** Confirmed via test script `verify_singleton_store.js`.
**Fix:** Refactor the `Store` to be instantiated within the `MapDraw` constructor and passed down to tools, rather than being a module-level singleton.

### ⚠️ Potential Memory Leaks
**Description:** `Tools.js` subscribes to the store but there is no mechanism to unsubscribe or destroy a `MapDraw` instance.
**Impact:** If a Single Page Application (SPA) creates and destroys maps frequently, the subscriptions will accumulate in the global store (if it remains global), leading to memory leaks and potential phantom updates.

---

## 3. Improvements & Refactoring

### ⚡ Performance: `ColorfulMarkerIcon`
**Description:** The `ColorfulMarkerIcon` class calculates the height of the font `.` character by rendering it to a canvas and using `getImageData()` to scan pixels.
**Issue:** `getImageData()` forces a synchronous CPU-GPU sync, which is expensive. This happens every time the marker color changes.
**Optimization:** Use the modern `TextMetrics` API (`ctx.measureText('.').actualBoundingBoxAscent`) which is widely supported and much faster. Additionally, cache the result since the font size/family is constant.

### 🏗️ Architecture: `Tools.js` Inheritance
**Description:** The `Tools` class acts as a weird mixin/base class that holds references to `BRUSH`, `POLYGON`, etc., but these seem to be instance properties that are somewhat confused with the tool types.
**Recommendation:** Refactor the inheritance hierarchy. Each tool (Brush, Polygon, Marker) should be a self-contained class that manages its own state and interaction with the map. The common `Tools` base class should only handle shared utility methods, not application state.

### 📘 TypeScript Migration
**Recommendation:** Migrate the codebase to TypeScript.
**Benefits:**
-   **Type Safety:** Catches bugs like "undefined is not a function" at compile time.
-   **Better IDE Support:** Autocomplete for Google Maps API types (via `@types/google.maps`).
-   **Refactoring Confidence:** Makes the necessary major refactors (removing global state, replacing DrawingManager) much safer and easier.
**Effort:** Medium. The codebase is relatively small, so a migration is feasible and highly recommended before starting the major rewrite for the DrawingManager deprecation.

## 4. Summary of Recommended Actions

1.  **Refactor Store:** Move state from global scope to instance scope to fix the multi-map issue.
2.  **Migrate to TypeScript:** Convert the project to TypeScript to aid in the upcoming major rewrite.
3.  **Rewrite Drawing Logic:** Replace `google.maps.drawing.DrawingManager` with custom event handling (or a library like `Terra Draw`) to survive the May 2026 deprecation.
4.  **Optimize Icons:** Rewrite `ColorfulMarkerIcon` to use `TextMetrics`.
