import { beforeEach, describe, expect, it, vi } from 'vitest';
import DrawOnMap from '../src/draw-on-map';

describe('DrawOnMap Events and Serialization', () => {
  let map: any;
  let draw: DrawOnMap;

  beforeEach(() => {
    map = new google.maps.Map(document.createElement('div'), {});
    draw = new DrawOnMap(map);
  });

  it('emits tool and shape lifecycle events', () => {
    const onToolChanged = vi.fn();
    const onShapeCreated = vi.fn();
    const onShapeCleared = vi.fn();

    draw.on('toolChanged', onToolChanged);
    draw.on('shapeCreated', onShapeCreated);
    draw.on('shapeCleared', onShapeCleared);

    draw.marker.startDraw();
    map.trigger('click', { latLng: new google.maps.LatLng(10, 20) });

    expect(onToolChanged).toHaveBeenCalledWith({ tool: 'MARKER' });
    expect(onShapeCreated).toHaveBeenCalledTimes(1);

    draw.marker.clearArt();
    expect(onShapeCleared).toHaveBeenCalledWith(
      expect.objectContaining({
        tool: 'MARKER',
      }),
    );
  });

  it('imports and exports json + geojson payloads', () => {
    const imported = vi.fn();
    const exported = vi.fn();

    draw.on('imported', imported);
    draw.on('exported', exported);

    draw.importData({
      shapes: [
        {
          id: 'marker-1',
          type: 'MARKER',
          geometry: { position: { lat: 1, lng: 2 } },
          style: { strokeColor: '#f00', strokeWeight: 1, markerIcon: null },
          metadata: { createdAt: new Date().toISOString() },
        },
        {
          id: 'polyline-1',
          type: 'POLYLINE',
          geometry: { path: [{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }] },
          style: { strokeColor: '#0f0', strokeWeight: 2 },
          metadata: { createdAt: new Date().toISOString() },
        },
      ],
    });

    const jsonShapes = draw.exportData('json') as any[];
    const geojson = draw.exportData('geojson') as any;

    expect(jsonShapes).toHaveLength(2);
    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.features).toHaveLength(2);
    expect(imported).toHaveBeenCalledWith({ count: 2, format: 'json' });
    expect(exported).toHaveBeenCalledWith({ count: 2, format: 'json' });
    expect(exported).toHaveBeenCalledWith({ count: 2, format: 'geojson' });
  });
});
