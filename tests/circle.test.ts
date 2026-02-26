import { describe, expect, it } from 'vitest';
import DrawOnMap from '../src/draw-on-map';

describe('DrawOnMap GeoJSON Import', () => {
  it('imports GeoJSON and supports clearExisting option', () => {
    const map: any = new google.maps.Map(document.createElement('div'), {});
    const draw = new DrawOnMap(map);

    draw.importData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'marker-geo',
          geometry: { type: 'Point', coordinates: [30, 10] },
          properties: {
            toolType: 'MARKER',
            style: { strokeColor: '#000', strokeWeight: 1, markerIcon: null },
            metadata: { createdAt: new Date().toISOString() },
          },
        },
      ],
    });

    expect((draw.exportData('json') as any[]).length).toBe(1);

    draw.importData(
      {
        shapes: [
          {
            id: 'polyline-2',
            type: 'POLYLINE',
            geometry: { path: [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }] },
            style: { strokeColor: '#111', strokeWeight: 3 },
            metadata: { createdAt: new Date().toISOString() },
          },
        ],
      },
      { clearExisting: true },
    );

    const shapes = draw.exportData('json') as any[];
    expect(shapes).toHaveLength(1);
    expect(shapes[0].id).toBe('polyline-2');
  });
});
