# Draw On Google Map

[![npm version](https://img.shields.io/npm/v/draw-on-google-maps.svg?style=flat-square)](https://www.npmjs.com/package/draw-on-google-maps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`draw-on-google-maps` is a framework-agnostic TypeScript library for drawing and managing overlays on Google Maps.

Supported tools:
- Brush (freehand)
- Polygon
- Polyline
- Circle
- Rectangle
- Marker

## Installation

```bash
npm install draw-on-google-maps
```

## Google Maps Loading Options

The library works with all common Google Maps JS loading patterns.

### 1) Direct script tag

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=marker,geometry"></script>
<script src="https://unpkg.com/draw-on-google-maps@latest/dist/draw-on-google-map.umd.js"></script>
<script>
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 30.0444, lng: 31.2357 },
    zoom: 10,
    mapId: 'YOUR_MAP_ID',
  });

  const draw = new DrawOnGoogleMap(map);
</script>
```

### 2) Dynamic library import (`google.maps.importLibrary`)

```html
<script>
  (g => {
    let h, a, k, p = 'The Google Maps JavaScript API', c = 'google', l = 'importLibrary', q = '__ib__', m = document, b = window;
    b = b[c] || (b[c] = {});
    const d = b.maps || (b.maps = {}), r = new Set(), e = new URLSearchParams();
    const u = () => h || (h = new Promise(async (f, n) => {
      a = m.createElement('script');
      e.set('key', g.key);
      e.set('v', g.v || 'weekly');
      e.set('libraries', [...r] + '');
      e.set('callback', c + '.maps.' + q);
      a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
      d[q] = f;
      a.onerror = () => n(Error(p + ' could not load.'));
      m.head.append(a);
    }));
    d[l] ? console.warn(p + ' only loads once. Ignoring:', g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
  })({ key: 'YOUR_API_KEY' });
</script>
<script type="module">
  import DrawOnMap from 'https://cdn.jsdelivr.net/npm/draw-on-google-maps@latest/dist/draw-on-google-map.es.js';

  const { Map } = await google.maps.importLibrary('maps');
  await google.maps.importLibrary('geometry');
  await google.maps.importLibrary('marker');

  const map = new Map(document.getElementById('map'), {
    center: { lat: 30.0444, lng: 31.2357 },
    zoom: 10,
    mapId: 'YOUR_MAP_ID',
  });

  const draw = new DrawOnMap(map);
</script>
```

### 3) NPM `@googlemaps/js-api-loader`

```ts
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import DrawOnMap from 'draw-on-google-maps';

setOptions({ key: process.env.GOOGLE_MAPS_API_KEY!, v: 'weekly' });

const { Map } = await importLibrary('maps');
await importLibrary('geometry');
await importLibrary('marker');

const map = new Map(document.getElementById('map') as HTMLElement, {
  center: { lat: 30.0444, lng: 31.2357 },
  zoom: 10,
  mapId: 'YOUR_MAP_ID',
});

const draw = new DrawOnMap(map);
```

Notes:
- `marker` is required for `AdvancedMarkerElement` support.
- `geometry` is recommended for accurate circle radius calculations (library includes fallback when missing).
- Use a valid `mapId` when advanced markers are expected.

## Bundled Files / CDN Hosting

Bundled files are published to npm and can be consumed from CDNs:

- UMD: `https://unpkg.com/draw-on-google-maps@latest/dist/draw-on-google-map.umd.js`
- UMD: `https://cdn.jsdelivr.net/npm/draw-on-google-maps@latest/dist/draw-on-google-map.umd.js`
- ESM: `https://cdn.jsdelivr.net/npm/draw-on-google-maps@latest/dist/draw-on-google-map.es.js`

## Quick Start (NPM)

```ts
import DrawOnMap from 'draw-on-google-maps';

const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
  center: { lat: 30.0444, lng: 31.2357 },
  zoom: 10,
  mapId: 'YOUR_MAP_ID',
});

const draw = new DrawOnMap(map);
draw.changeColor('#ff4d4f');
draw.changeStrokeWeight(4);
draw.brush.startDraw();
```

## Tool API

Each tool exposes:
- `startDraw()`
- `stopDraw()`
- `clearArt()`

Tool entrypoints:
- `draw.brush`
- `draw.polygon`
- `draw.polyline`
- `draw.circle`
- `draw.rectangle`
- `draw.marker`

Tool-specific methods:
- `draw.polygon.changeFillColor(color: string)`
- `draw.polygon.changeOpacity(opacity: number)`
- `draw.marker.changeIcon(icon: string)`

## Global API

- `changeColor(color: string)`
- `changeStrokeWeight(weight: number)`
- `changePolygonFillColor(color: string)`
- `changePolygonOpacity(opacity: number)`
- `changeMarkerIcon(icon: string)`
- `getSelectedTool(): 'BRUSH' | 'POLYGON' | 'POLYLINE' | 'CIRCLE' | 'RECTANGLE' | 'MARKER' | null`
- `getSelectedColor(): string`
- `clearAllArt()`
- `destroy()`

## Events API

```ts
const unsubscribe = draw.on('shapeCreated', ({ tool, shape }) => {
  console.log(tool, shape.id);
});

unsubscribe();
```

Available events:
- `toolChanged`
- `shapeCreated`
- `shapeCleared`
- `clearedAll`
- `imported`
- `exported`
- `error`

You can also remove listeners with `draw.off(eventName, handler)`.

## Serialization API

```ts
const json = draw.exportData('json');
const geojson = draw.exportData('geojson');

draw.importData(json);
draw.importData(geojson, { clearExisting: true });
```

Accepted import payloads:
- `DrawShape[]`
- `{ shapes: DrawShape[] }`
- `GeoJSON FeatureCollection`

## Framework Usage

The package works with Vanilla JS, React, Vue, Angular, and any environment where Google Maps API is loaded.

See examples in:
- `examples/vanilla`
- `examples/react`
- `examples/vue`
- `examples/angular`

## Migration from v1.0.4 to v2.0.0

Breaking changes:
- Internal architecture was rewritten in TypeScript.
- The legacy DrawingManager-based flow is no longer used.
- New tools are available (`polyline`, `circle`, `rectangle`).

Compatibility notes:
- Existing public entrypoints (`draw.brush.startDraw()`, `draw.polygon...`, `draw.marker...`) are preserved.
- `getSelectedTool()` now safely returns `null` when no tool is active.

## Security Best Practices

- Never commit real API keys, tokens, certificates, or `.env` files.
- Use environment variables and CI/CD secret managers for all credentials.
- Run `npm run audit` before publishing.

## Troubleshooting

- `Google Maps JavaScript API is not loaded.`
: Ensure the API is loaded before `new DrawOnMap(map)`.
- Circle radius not accurate
: Include `geometry` in your loaded libraries.
- Markers do not render as expected
: Include `marker` and use a valid `mapId`.
- Multiple map instances influence each other
: Use one `DrawOnMap` instance per map container.

## License

MIT
