
import { describe, it, expect, vi } from 'vitest';
import DrawOnMap from '../draw-on-map/index';

const mockGoogle = {
  maps: {
    drawing: {
      OverlayType: { MARKER: 'marker', POLYGON: 'polygon' },
      DrawingManager: class {}
    },
    event: {
      addListener: vi.fn(() => ({ remove: vi.fn() })),
      clearListeners: vi.fn(),
      removeListener: vi.fn(),
    },
    Polyline: class { setMap() {} setPath() {} getPath() { return { getLength: () => 0, insertAt: () => {} }; } },
    Polygon: class { setMap() {} },
    Circle: class { setMap() {} },
    Rectangle: class { setMap() {} },
    Marker: class { map: any = null; },
    marker: { AdvancedMarkerElement: class { map: any = null; } },
    geometry: { spherical: { computeDistanceBetween: vi.fn(() => 100) } },
    LatLngBounds: class { extend() {} }
  }
};
(globalThis as any).window = { google: mockGoogle };

describe('DrawOnMap', () => {
    it('should initialize rectangle tool', () => {
        const map = { setOptions: vi.fn(), addListener: vi.fn() } as any;
        const draw = new DrawOnMap(map);

        expect(draw.rectangle).toBeDefined();
        expect(typeof draw.rectangle.startDraw).toBe('function');
    });
});
