# Draw On Google Map

[![npm version](https://img.shields.io/npm/v/draw-on-google-map.svg?style=flat-square)](https://www.npmjs.com/package/draw-on-google-map)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, dependency-free (except for Google Maps API) library to draw polygons, markers, polylines, circles, rectangles, and freehand brushes on Google Maps.

This library provides a simple API to manage drawing tools, customize styles (colors, stroke weights, opacity), and handle multiple independent map instances.

## ✨ Features

*   **Multiple Tools:** Polygon, Marker, Polyline, Circle, Rectangle, and Freehand Brush.
*   **Customizable:** Easily change stroke color, fill color, stroke weight, and opacity.
*   **Independent Instances:** Supports multiple map instances on the same page.
*   **Framework Agnostic:** Works with Vanilla JS, React, Vue, Angular, etc.
*   **TypeScript Support:** Written in TypeScript with full type definitions included.
*   **Performance:** Optimized marker rendering using `TextMetrics` and caching.

## 📦 Installation

```bash
npm install draw-on-google-map
```

or via CDN:

```html
<script src="https://unpkg.com/draw-on-google-map/dist/draw-on-google-map.umd.js"></script>
```

## 🚀 Usage

### 1. Load Google Maps API

Ensure the Google Maps JavaScript API is loaded in your project before initializing the library.

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

### 2. Initialize the Library

```javascript
import DrawOnMap from 'draw-on-google-map';

const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
});

const draw = new DrawOnMap(map);
```

### 3. Use Drawing Tools

You can start and stop drawing using the exposed methods for each tool.

#### Brush (Freehand)
```javascript
draw.brush.startDraw();
// ... user draws on map ...
draw.brush.stopDraw();
draw.brush.clearArt(); // Clears all brush strokes
```

#### Polygon
```javascript
draw.polygon.startDraw();
// ... user clicks to add points, double click to finish ...
draw.polygon.stopDraw();
draw.polygon.clearArt();
```

#### Marker
```javascript
draw.marker.startDraw();
// ... user clicks to place markers ...
draw.marker.stopDraw();
draw.marker.changeIcon('https://path/to/icon.png'); // Change marker icon
```

#### Other Tools
Available tools: `polyline`, `circle`, `rectangle`. All follow the same `startDraw()`, `stopDraw()`, and `clearArt()` pattern.

### 4. Customizing Styles

You can change global drawing styles which apply to the currently selected tool and future drawings.

```javascript
// Change stroke color (for all tools)
draw.changeColor('#FF0000');

// Change stroke weight (for all tools)
draw.changeStrokeWeight(5);

// Change polygon fill color
draw.changePolygonFillColor('#00FF00');

// Change polygon fill opacity (0.0 to 1.0)
draw.changePolygonOpacity(0.5);
```

## ⚛️ Framework Examples

### React

```tsx
import React, { useEffect, useRef, useState } from 'react';
import DrawOnMap from 'draw-on-google-map';

const MapComponent = () => {
    const mapRef = useRef(null);
    const [drawTools, setDrawTools] = useState(null);

    useEffect(() => {
        if (window.google && mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: 0, lng: 0 },
                zoom: 4,
            });
            const tools = new DrawOnMap(map);
            setDrawTools(tools);
        }
    }, []);

    return (
        <div>
            <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
            <button onClick={() => drawTools?.brush.startDraw()}>Draw Brush</button>
            <button onClick={() => drawTools?.brush.stopDraw()}>Stop Drawing</button>
        </div>
    );
};
```

## 📖 API Reference

### `new DrawOnMap(map: google.maps.Map)`
Creates a new instance of the drawing tools for the specific map.

### Properties
*   `brush`: Brush tool instance.
*   `polygon`: Polygon tool instance.
*   `polyline`: Polyline tool instance.
*   `circle`: Circle tool instance.
*   `rectangle`: Rectangle tool instance.
*   `marker`: Marker tool instance.

### Methods (Global)
*   `changeColor(color: string)`: Sets the stroke color.
*   `changeStrokeWeight(weight: number)`: Sets the stroke weight.
*   `changePolygonFillColor(color: string)`: Sets the fill color for polygons.
*   `changePolygonOpacity(opacity: number)`: Sets the fill opacity (0-1).
*   `changeMarkerIcon(icon: string)`: Sets the icon URL for markers.
*   `getSelectedTool()`: Returns the type of the currently active tool.
*   `getSelectedColor()`: Returns the current color.
*   `clearAllArt()`: Clears drawings from all tools.

### Methods (Per Tool)
Each tool (brush, polygon, etc.) has:
*   `startDraw()`: Activates the tool.
*   `stopDraw()`: Deactivates the tool.
*   `clearArt()`: Clears drawings created by this specific tool.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
