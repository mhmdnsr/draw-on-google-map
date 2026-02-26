export type DrawToolType = 'BRUSH' | 'POLYGON' | 'POLYLINE' | 'CIRCLE' | 'RECTANGLE' | 'MARKER';

export interface DrawStyle {
  strokeColor: string;
  strokeWeight: number;
  fillColor?: string;
  fillOpacity?: number;
  markerIcon?: string | null;
}

export interface DrawShapeMetadata {
  createdAt: string;
  source?: 'draw' | 'import';
}

export interface PathGeometry {
  path: google.maps.LatLngLiteral[];
}

export interface CircleGeometry {
  center: google.maps.LatLngLiteral;
  radius: number;
}

export interface RectangleGeometry {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface MarkerGeometry {
  position: google.maps.LatLngLiteral;
}

export type DrawShapeGeometry = PathGeometry | CircleGeometry | RectangleGeometry | MarkerGeometry;

export interface DrawShape {
  id: string;
  type: DrawToolType;
  geometry: DrawShapeGeometry;
  style: DrawStyle;
  metadata: DrawShapeMetadata;
}

export interface DrawJsonPayload {
  shapes: DrawShape[];
}

export interface GeoJSONFeature {
  type: 'Feature';
  id?: string;
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon';
    coordinates: unknown;
  };
  properties?: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export type DrawExportFormat = 'json' | 'geojson';

export interface DrawEventMap {
  toolChanged: { tool: DrawToolType | null };
  shapeCreated: { tool: DrawToolType; shape: DrawShape };
  shapeCleared: { tool: DrawToolType; shapeIds: string[] };
  clearedAll: { shapeIds: string[] };
  imported: { count: number; format: DrawExportFormat };
  exported: { count: number; format: DrawExportFormat };
  error: { error: Error; context?: string };
}

export type DrawEventName = keyof DrawEventMap;

export interface ToolCallbacks {
  onShapeCreated: (tool: DrawToolType, shape: DrawShape) => void;
  onShapeCleared: (tool: DrawToolType, shapeIds: string[]) => void;
  onError: (error: Error, context?: string) => void;
}

export interface IDrawTool {
  readonly type: DrawToolType;
  startDraw(): void;
  stopDraw(): void;
  clearArt(): void;
  destroy(): void;
  exportShapes(): DrawShape[];
  importShapes(shapes: DrawShape[]): void;
}
