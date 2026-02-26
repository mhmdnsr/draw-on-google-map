type ListenerHandler = (event: any) => void;

class MockListener {
  private readonly removeFn: () => void;
  removed = false;

  constructor(removeFn: () => void) {
    this.removeFn = removeFn;
  }

  remove(): void {
    if (this.removed) {
      return;
    }
    this.removed = true;
    this.removeFn();
  }
}

class MockLatLng {
  private readonly latitude: number;
  private readonly longitude: number;

  constructor(lat: number, lng: number) {
    this.latitude = lat;
    this.longitude = lng;
  }

  lat(): number {
    return this.latitude;
  }

  lng(): number {
    return this.longitude;
  }
}

class MockMvcArray {
  private points: MockLatLng[];

  constructor(points: Array<google.maps.LatLngLiteral | MockLatLng> = []) {
    this.points = points.map((point) =>
      point instanceof MockLatLng ? point : new MockLatLng(point.lat, point.lng),
    );
  }

  getLength(): number {
    return this.points.length;
  }

  getAt(index: number): MockLatLng {
    return this.points[index];
  }

  insertAt(index: number, value: google.maps.LatLng | google.maps.LatLngLiteral): void {
    const point =
      value instanceof MockLatLng
        ? value
        : new MockLatLng(
            typeof (value as google.maps.LatLng).lat === 'function'
              ? (value as google.maps.LatLng).lat()
              : (value as google.maps.LatLngLiteral).lat,
            typeof (value as google.maps.LatLng).lng === 'function'
              ? (value as google.maps.LatLng).lng()
              : (value as google.maps.LatLngLiteral).lng,
          );
    this.points.splice(index, 0, point);
  }

  getArray(): MockLatLng[] {
    return [...this.points];
  }
}

class MockMap {
  options: Record<string, unknown> = {};
  private listeners: Record<string, ListenerHandler[]> = {};

  setOptions(nextOptions: Record<string, unknown>): void {
    this.options = { ...this.options, ...nextOptions };
  }

  addListener(eventName: string, handler: ListenerHandler): MockListener {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(handler);

    return new MockListener(() => {
      this.listeners[eventName] = (this.listeners[eventName] || []).filter(
        (listener) => listener !== handler,
      );
    });
  }

  trigger(eventName: string, payload: any): void {
    (this.listeners[eventName] || []).forEach((handler) => handler(payload));
  }

  listenerCount(eventName: string): number {
    return (this.listeners[eventName] || []).length;
  }
}

class MockPolyline {
  map: any;
  private path: MockMvcArray;
  constructor(options: any) {
    this.map = options.map;
    this.path = new MockMvcArray(options.path || []);
  }
  setMap(map: any): void {
    this.map = map;
  }
  setPath(path: Array<google.maps.LatLngLiteral | MockLatLng>): void {
    this.path = new MockMvcArray(path);
  }
  getPath(): MockMvcArray {
    return this.path;
  }
}

class MockPolygon {
  map: any;
  paths: any;
  constructor(options: any) {
    this.map = options.map;
    this.paths = options.paths;
  }
  setMap(map: any): void {
    this.map = map;
  }
}

class MockCircle {
  map: any;
  private center: any;
  private radius: number;
  constructor(options: any) {
    this.map = options.map;
    this.center = options.center;
    this.radius = options.radius || 0;
  }
  setMap(map: any): void {
    this.map = map;
  }
  setRadius(radius: number): void {
    this.radius = radius;
  }
  setOptions(nextOptions: any): void {
    this.map = nextOptions.map ?? this.map;
  }
}

class MockRectangle {
  map: any;
  private bounds: { north: number; south: number; east: number; west: number };
  constructor(options: any) {
    this.map = options.map;
    this.bounds = options.bounds;
  }
  setMap(map: any): void {
    this.map = map;
  }
  setBounds(bounds: { north: number; south: number; east: number; west: number }): void {
    this.bounds = bounds;
  }
  getBounds(): { getNorthEast: () => MockLatLng; getSouthWest: () => MockLatLng } {
    return {
      getNorthEast: () => new MockLatLng(this.bounds.north, this.bounds.east),
      getSouthWest: () => new MockLatLng(this.bounds.south, this.bounds.west),
    };
  }
  setOptions(nextOptions: any): void {
    this.map = nextOptions.map ?? this.map;
  }
}

class MockMarker {
  map: any;
  position: any;
  icon?: string | null;
  constructor(options: any) {
    this.map = options.map;
    this.position = options.position;
    this.icon = options.icon;
  }
  setMap(map: any): void {
    this.map = map;
  }
}

class MockAdvancedMarkerElement {
  map: any;
  position: any;
  content?: HTMLElement;
  constructor(options: any) {
    this.map = options.map;
    this.position = options.position;
    this.content = options.content;
  }
}

const googleMock = {
  maps: {
    Map: MockMap as any,
    Marker: MockMarker as any,
    Polygon: MockPolygon as any,
    Polyline: MockPolyline as any,
    Circle: MockCircle as any,
    Rectangle: MockRectangle as any,
    LatLng: MockLatLng as any,
    marker: {
      AdvancedMarkerElement: MockAdvancedMarkerElement as any,
    },
    geometry: {
      spherical: {
        computeDistanceBetween: (from: any, to: any) => {
          const dLat = from.lat() - to.lat();
          const dLng = from.lng() - to.lng();
          return Math.sqrt(dLat * dLat + dLng * dLng) * 100000;
        },
      },
    },
    event: {
      removeListener: (listener: MockListener) => listener.remove(),
    },
  },
};

(globalThis as any).google = googleMock;
if (!(globalThis as any).window) {
  (globalThis as any).window = {};
}
(globalThis as any).window.google = googleMock;
