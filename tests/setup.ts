import { vi } from 'vitest';

// Mock google.maps namespace
const google = {
  maps: {
    Map: vi.fn(() => ({
      setOptions: vi.fn(),
      addListener: vi.fn().mockReturnValue({ remove: vi.fn() }),
      getDiv: vi.fn(() => document.createElement('div')),
    })),
    Marker: vi.fn(() => ({
      setMap: vi.fn(),
      setIcon: vi.fn(),
    })),
    Polygon: vi.fn(() => ({
      setMap: vi.fn(),
      setPath: vi.fn(),
    })),
    Polyline: vi.fn(() => ({
      setMap: vi.fn(),
      setPath: vi.fn(),
      getPath: vi.fn(() => ({
        getLength: vi.fn(() => 0),
        insertAt: vi.fn(),
        push: vi.fn(),
        getArray: vi.fn(() => []),
      })),
    })),
    Circle: vi.fn(() => ({
      setMap: vi.fn(),
    })),
    Rectangle: vi.fn(() => ({
      setMap: vi.fn(),
    })),
    LatLng: vi.fn((lat, lng) => ({ lat: () => lat, lng: () => lng })),
    event: {
      addListener: vi.fn().mockReturnValue({ remove: vi.fn() }),
      removeListener: vi.fn(),
      clearListeners: vi.fn(),
      trigger: vi.fn(),
    },
    drawing: {
      OverlayType: {
        POLYGON: 'polygon',
        MARKER: 'marker',
        POLYLINE: 'polyline',
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
      },
    },
    ControlPosition: {
      TOP_LEFT: 1,
    },
  },
};

global.google = google as any;
global.window.google = google as any;
