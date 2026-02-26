# Release Notes - v2.0.0

## 🚀 Major Improvements

*   **TypeScript Migration:** The entire codebase has been rewritten in TypeScript, providing better type safety and developer experience.
*   **Modern Build System:** Replaced Webpack with Vite for faster builds and modern ESM/UMD output.
*   **Performance Optimization:** Optimized `ColorfulMarkerIcon` generation using `TextMetrics` and caching, significantly reducing CPU usage when rendering many markers.
*   **Instance-Based Architecture:** Fixed a critical bug where state was shared globally. You can now have multiple independent maps on the same page.

## ✨ New Features

*   **New Drawing Tools:**
    *   **Polyline (`draw.polyline`):** Draw lines that don't close automatically.
    *   **Circle (`draw.circle`):** Click center and drag to define radius.
    *   **Rectangle (`draw.rectangle`):** Click and drag to define bounds.
*   **Framework Examples:** Added usage examples for React, Vue, Angular, and Vanilla JS in the `examples/` directory.

## ⚠️ Breaking Changes & Deprecations

*   **Removed Dependency:** The library **no longer depends on `google.maps.drawing.DrawingManager`**, which is deprecated by Google. All drawing tools are now implemented with custom logic using Google Maps events.
*   **Google Maps Loading:** The library now strictly requires `window.google.maps` to be loaded before initialization and will throw a clear error if missing.
*   **Internal API:** Internal class structures (Tools, Store) have changed. Public API remains mostly backward compatible but verify your implementation if you accessed internal properties.

## 📦 Installation

```bash
npm install draw-on-google-maps@latest
```
