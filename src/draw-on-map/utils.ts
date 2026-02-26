import {
  DrawExportFormat,
  DrawShape,
  DrawToolType,
  GeoJSONFeature,
  GeoJSONFeatureCollection,
} from './types';

let shapeCounter = 0;

export function createShapeId(type: DrawToolType): string {
  shapeCounter += 1;
  return `${type.toLowerCase()}-${Date.now()}-${shapeCounter}`;
}

export function cloneShape(shape: DrawShape): DrawShape {
  return JSON.parse(JSON.stringify(shape)) as DrawShape;
}

export function toLatLngLiteral(value: unknown): google.maps.LatLngLiteral {
  if (!value || typeof value !== 'object') {
    return { lat: 0, lng: 0 };
  }

  const input = value as { lat?: unknown; lng?: unknown };

  if (typeof input.lat === 'function' && typeof input.lng === 'function') {
    return {
      lat: Number((input.lat as () => number)()),
      lng: Number((input.lng as () => number)()),
    };
  }

  return {
    lat: Number(input.lat ?? 0),
    lng: Number(input.lng ?? 0),
  };
}

export function latLngLiteralToObject(value: google.maps.LatLngLiteral): google.maps.LatLng | google.maps.LatLngLiteral {
  if (typeof google !== 'undefined' && google.maps && typeof google.maps.LatLng === 'function') {
    return new google.maps.LatLng(value.lat, value.lng);
  }

  return value;
}

export function mapPathToLiteral(path: unknown): google.maps.LatLngLiteral[] {
  if (!path) {
    return [];
  }

  if (Array.isArray(path)) {
    return path.map((point) => toLatLngLiteral(point));
  }

  const mvcArray = path as {
    getLength?: () => number;
    getAt?: (index: number) => unknown;
  };

  if (typeof mvcArray.getLength === 'function' && typeof mvcArray.getAt === 'function') {
    const points: google.maps.LatLngLiteral[] = [];
    const length = mvcArray.getLength();

    for (let index = 0; index < length; index += 1) {
      points.push(toLatLngLiteral(mvcArray.getAt(index)));
    }

    return points;
  }

  return [];
}

export function areSamePoint(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral): boolean {
  return a.lat === b.lat && a.lng === b.lng;
}

export function distanceBetween(from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral): number {
  const spherical =
    typeof google !== 'undefined' &&
    google.maps &&
    google.maps.geometry &&
    google.maps.geometry.spherical &&
    typeof google.maps.geometry.spherical.computeDistanceBetween === 'function'
      ? google.maps.geometry.spherical
      : null;

  if (spherical) {
    const fromPoint = latLngLiteralToObject(from);
    const toPoint = latLngLiteralToObject(to);
    return spherical.computeDistanceBetween(fromPoint as google.maps.LatLng, toPoint as google.maps.LatLng);
  }

  return haversineDistance(from, to);
}

function haversineDistance(from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral): number {
  const earthRadius = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export function shapeToGeoJSONFeature(shape: DrawShape): GeoJSONFeature {
  const baseProperties = {
    toolType: shape.type,
    style: shape.style,
    metadata: shape.metadata,
  };

  switch (shape.type) {
    case 'BRUSH':
    case 'POLYLINE': {
      const geometry = shape.geometry as { path: google.maps.LatLngLiteral[] };
      return {
        type: 'Feature',
        id: shape.id,
        geometry: {
          type: 'LineString',
          coordinates: geometry.path.map((point) => [point.lng, point.lat]),
        },
        properties: baseProperties,
      };
    }
    case 'POLYGON': {
      const geometry = shape.geometry as { path: google.maps.LatLngLiteral[] };
      const ring = [...geometry.path];
      if (ring.length > 0 && !areSamePoint(ring[0], ring[ring.length - 1])) {
        ring.push(ring[0]);
      }

      return {
        type: 'Feature',
        id: shape.id,
        geometry: {
          type: 'Polygon',
          coordinates: [ring.map((point) => [point.lng, point.lat])],
        },
        properties: baseProperties,
      };
    }
    case 'RECTANGLE': {
      const geometry = shape.geometry as { bounds: { north: number; south: number; east: number; west: number } };
      const ring = [
        [geometry.bounds.west, geometry.bounds.south],
        [geometry.bounds.east, geometry.bounds.south],
        [geometry.bounds.east, geometry.bounds.north],
        [geometry.bounds.west, geometry.bounds.north],
        [geometry.bounds.west, geometry.bounds.south],
      ];

      return {
        type: 'Feature',
        id: shape.id,
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
        properties: baseProperties,
      };
    }
    case 'CIRCLE': {
      const geometry = shape.geometry as { center: google.maps.LatLngLiteral; radius: number };
      return {
        type: 'Feature',
        id: shape.id,
        geometry: {
          type: 'Point',
          coordinates: [geometry.center.lng, geometry.center.lat],
        },
        properties: {
          ...baseProperties,
          radius: geometry.radius,
        },
      };
    }
    case 'MARKER': {
      const geometry = shape.geometry as { position: google.maps.LatLngLiteral };
      return {
        type: 'Feature',
        id: shape.id,
        geometry: {
          type: 'Point',
          coordinates: [geometry.position.lng, geometry.position.lat],
        },
        properties: baseProperties,
      };
    }
    default:
      return {
        type: 'Feature',
        id: shape.id,
        geometry: {
          type: 'Point',
          coordinates: [0, 0],
        },
        properties: baseProperties,
      };
  }
}

function toDrawToolType(value: unknown): DrawToolType | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.toUpperCase();
  if (
    normalized === 'BRUSH' ||
    normalized === 'POLYGON' ||
    normalized === 'POLYLINE' ||
    normalized === 'CIRCLE' ||
    normalized === 'RECTANGLE' ||
    normalized === 'MARKER'
  ) {
    return normalized;
  }

  return null;
}

function normalizeStyle(input: unknown): DrawShape['style'] {
  const style = typeof input === 'object' && input ? (input as DrawShape['style']) : ({} as DrawShape['style']);

  return {
    strokeColor: typeof style.strokeColor === 'string' ? style.strokeColor : '#fff',
    strokeWeight: typeof style.strokeWeight === 'number' ? style.strokeWeight : 6,
    fillColor: style.fillColor,
    fillOpacity: style.fillOpacity,
    markerIcon: style.markerIcon,
  };
}

function normalizeShape(shape: DrawShape): DrawShape {
  return {
    ...shape,
    style: normalizeStyle(shape.style),
    metadata: {
      createdAt: shape.metadata?.createdAt || new Date().toISOString(),
      source: shape.metadata?.source,
    },
  };
}

export function geoJSONFeatureToShape(feature: GeoJSONFeature): DrawShape | null {
  const geometryType = feature.geometry?.type;
  const coordinates = feature.geometry?.coordinates as unknown;
  const properties = feature.properties || {};
  const toolType = toDrawToolType(properties.toolType);

  if (!geometryType || !coordinates) {
    return null;
  }

  const baseShape = {
    id: typeof feature.id === 'string' ? feature.id : createShapeId(toolType || 'MARKER'),
    style: normalizeStyle(properties.style),
    metadata: {
      createdAt:
        typeof (properties.metadata as DrawShape['metadata'] | undefined)?.createdAt === 'string'
          ? ((properties.metadata as DrawShape['metadata']).createdAt as string)
          : new Date().toISOString(),
      source: 'import' as const,
    },
  };

  if (geometryType === 'LineString' && Array.isArray(coordinates)) {
    const path = coordinates
      .map((point) => (Array.isArray(point) ? { lng: Number(point[0]), lat: Number(point[1]) } : null))
      .filter((point): point is google.maps.LatLngLiteral => point !== null);

    const type = toolType === 'BRUSH' ? 'BRUSH' : 'POLYLINE';

    return normalizeShape({
      ...baseShape,
      type,
      geometry: { path },
    });
  }

  if (geometryType === 'Polygon' && Array.isArray(coordinates) && Array.isArray(coordinates[0])) {
    const ring = (coordinates[0] as unknown[])
      .map((point) => (Array.isArray(point) ? { lng: Number(point[0]), lat: Number(point[1]) } : null))
      .filter((point): point is google.maps.LatLngLiteral => point !== null);

    if (toolType === 'RECTANGLE') {
      const lats = ring.map((point) => point.lat);
      const lngs = ring.map((point) => point.lng);
      return normalizeShape({
        ...baseShape,
        type: 'RECTANGLE',
        geometry: {
          bounds: {
            north: Math.max(...lats),
            south: Math.min(...lats),
            east: Math.max(...lngs),
            west: Math.min(...lngs),
          },
        },
      });
    }

    const path = ring.length > 1 && areSamePoint(ring[0], ring[ring.length - 1]) ? ring.slice(0, -1) : ring;

    return normalizeShape({
      ...baseShape,
      type: 'POLYGON',
      geometry: { path },
    });
  }

  if (geometryType === 'Point' && Array.isArray(coordinates) && coordinates.length >= 2) {
    const position = {
      lng: Number(coordinates[0]),
      lat: Number(coordinates[1]),
    };

    if (toolType === 'CIRCLE' && typeof properties.radius === 'number') {
      return normalizeShape({
        ...baseShape,
        type: 'CIRCLE',
        geometry: {
          center: position,
          radius: properties.radius,
        },
      });
    }

    return normalizeShape({
      ...baseShape,
      type: 'MARKER',
      geometry: { position },
    });
  }

  return null;
}

function isShapeCandidate(value: unknown): value is DrawShape {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const shape = value as DrawShape;
  return typeof shape.id === 'string' && toDrawToolType(shape.type) !== null && typeof shape.geometry === 'object';
}

export function parseImportPayload(payload: unknown): { format: DrawExportFormat; shapes: DrawShape[] } {
  const parsedPayload = typeof payload === 'string' ? JSON.parse(payload) : payload;

  if (Array.isArray(parsedPayload)) {
    return {
      format: 'json',
      shapes: parsedPayload.filter(isShapeCandidate).map((shape) => normalizeShape({ ...shape, metadata: { ...shape.metadata, source: 'import' } })),
    };
  }

  if (parsedPayload && typeof parsedPayload === 'object') {
    const objectPayload = parsedPayload as Record<string, unknown>;

    if (objectPayload.type === 'FeatureCollection' && Array.isArray(objectPayload.features)) {
      const shapes = (objectPayload.features as GeoJSONFeature[])
        .map((feature) => geoJSONFeatureToShape(feature))
        .filter((shape): shape is DrawShape => shape !== null);
      return {
        format: 'geojson',
        shapes,
      };
    }

    if (Array.isArray(objectPayload.shapes)) {
      return {
        format: 'json',
        shapes: (objectPayload.shapes as unknown[])
          .filter(isShapeCandidate)
          .map((shape) => normalizeShape({ ...(shape as DrawShape), metadata: { ...(shape as DrawShape).metadata, source: 'import' } })),
      };
    }
  }

  return {
    format: 'json',
    shapes: [],
  };
}

export function toGeoJSON(shapes: DrawShape[]): GeoJSONFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: shapes.map((shape) => shapeToGeoJSONFeature(shape)),
  };
}
