import { Brush } from './brush-tool';
import { Circle } from './circle-tool';
import { Marker } from './marker-tool';
import { Polygon } from './polygon-tool';
import { Polyline } from './polyline-tool';
import { Rectangle } from './rectangle-tool';
import createStore, { Store } from './store';
import {
  DrawEventMap,
  DrawEventName,
  DrawExportFormat,
  DrawShape,
  DrawToolType,
  GeoJSONFeatureCollection,
  IDrawTool,
  ToolCallbacks,
} from './types';
import { parseImportPayload, toGeoJSON } from './utils';

interface DrawImportOptions {
  clearExisting?: boolean;
}

interface ToolApi {
  startDraw: () => void;
  stopDraw: () => void;
  clearArt: () => void;
}

interface PolygonToolApi extends ToolApi {
  changeOpacity: (opacity: number) => void;
  changeFillColor: (color: string) => void;
}

interface MarkerToolApi extends ToolApi {
  changeIcon: (icon: string) => void;
}

export default class DrawOnMap {
  private readonly map: google.maps.Map;
  private readonly store: Store;
  private readonly tools: Record<DrawToolType, IDrawTool>;
  private readonly eventHandlers: Record<DrawEventName, Set<(payload: unknown) => void>> = {
    toolChanged: new Set(),
    shapeCreated: new Set(),
    shapeCleared: new Set(),
    clearedAll: new Set(),
    imported: new Set(),
    exported: new Set(),
    error: new Set(),
  };

  brush: ToolApi;
  polygon: PolygonToolApi;
  polyline: ToolApi;
  circle: ToolApi;
  rectangle: ToolApi;
  marker: MarkerToolApi;

  constructor(map: google.maps.Map) {
    if (!map) {
      throw new Error('You should pass the map instance.');
    }

    const googleMaps = (globalThis as { google?: typeof google }).google?.maps;
    if (!googleMaps) {
      throw new Error('Google Maps JavaScript API is not loaded.');
    }

    this.map = map;
    this.store = createStore();

    const callbacks: ToolCallbacks = {
      onShapeCreated: (tool, shape) => {
        this.emit('shapeCreated', { tool, shape });
      },
      onShapeCleared: (tool, shapeIds) => {
        this.emit('shapeCleared', { tool, shapeIds });
      },
      onError: (error, context) => {
        this.emit('error', { error, context });
      },
    };

    this.tools = {
      BRUSH: new Brush(this.map, this.store, callbacks),
      POLYGON: new Polygon(this.map, this.store, callbacks),
      POLYLINE: new Polyline(this.map, this.store, callbacks),
      CIRCLE: new Circle(this.map, this.store, callbacks),
      RECTANGLE: new Rectangle(this.map, this.store, callbacks),
      MARKER: new Marker(this.map, this.store, callbacks),
    };

    this.brush = {
      startDraw: () => this.startBrushDraw(),
      stopDraw: () => this.stopBrushDraw(),
      clearArt: () => this.clearBrushArt(),
    };

    this.polygon = {
      startDraw: () => this.startPolygonDraw(),
      stopDraw: () => this.stopPolygonDraw(),
      clearArt: () => this.clearPolygonArt(),
      changeOpacity: (opacity: number) => this.changePolygonOpacity(opacity),
      changeFillColor: (color: string) => this.changePolygonFillColor(color),
    };

    this.polyline = {
      startDraw: () => this.startPolylineDraw(),
      stopDraw: () => this.stopPolylineDraw(),
      clearArt: () => this.clearPolylineArt(),
    };

    this.circle = {
      startDraw: () => this.startCircleDraw(),
      stopDraw: () => this.stopCircleDraw(),
      clearArt: () => this.clearCircleArt(),
    };

    this.rectangle = {
      startDraw: () => this.startRectangleDraw(),
      stopDraw: () => this.stopRectangleDraw(),
      clearArt: () => this.clearRectangleArt(),
    };

    this.marker = {
      startDraw: () => this.startMarkerDraw(),
      stopDraw: () => this.stopMarkerDraw(),
      clearArt: () => this.clearMarkerArt(),
      changeIcon: (icon: string) => this.changeMarkerIcon(icon),
    };
  }

  holdMap = (): void => {
    this.map.setOptions({ draggable: false });
  };

  releaseMap = (): void => {
    this.map.setOptions({ draggable: true });
  };

  startBrushDraw(): void {
    this.activateTool('BRUSH');
  }

  stopBrushDraw(): void {
    this.deactivateTool('BRUSH');
  }

  clearBrushArt(): void {
    this.tools.BRUSH.clearArt();
  }

  startPolygonDraw(): void {
    this.activateTool('POLYGON');
  }

  stopPolygonDraw(): void {
    this.deactivateTool('POLYGON');
  }

  clearPolygonArt(): void {
    this.tools.POLYGON.clearArt();
  }

  startPolylineDraw(): void {
    this.activateTool('POLYLINE');
  }

  stopPolylineDraw(): void {
    this.deactivateTool('POLYLINE');
  }

  clearPolylineArt(): void {
    this.tools.POLYLINE.clearArt();
  }

  startCircleDraw(): void {
    this.activateTool('CIRCLE');
  }

  stopCircleDraw(): void {
    this.deactivateTool('CIRCLE');
  }

  clearCircleArt(): void {
    this.tools.CIRCLE.clearArt();
  }

  startRectangleDraw(): void {
    this.activateTool('RECTANGLE');
  }

  stopRectangleDraw(): void {
    this.deactivateTool('RECTANGLE');
  }

  clearRectangleArt(): void {
    this.tools.RECTANGLE.clearArt();
  }

  startMarkerDraw(): void {
    this.activateTool('MARKER');
  }

  stopMarkerDraw(): void {
    this.deactivateTool('MARKER');
  }

  clearMarkerArt(): void {
    this.tools.MARKER.clearArt();
  }

  clearAllArt(): void {
    const allShapeIds = this.collectShapes().map((shape) => shape.id);

    Object.values(this.tools).forEach((tool) => {
      tool.clearArt();
    });

    if (allShapeIds.length > 0) {
      this.emit('clearedAll', { shapeIds: allShapeIds });
    }
  }

  changeColor(color: string): void {
    if (typeof color === 'string' && color.trim().length > 0) {
      this.store.setColor(color);
    }
  }

  changeStrokeWeight(weight: number): void {
    if (typeof weight === 'number' && Number.isFinite(weight) && weight >= 0) {
      this.store.setStrokeWeight(weight);
    }
  }

  changePolygonFillColor(color: string): void {
    if (typeof color === 'string' && color.trim().length > 0) {
      this.store.setPolygonFillColor(color);
    }
  }

  changePolygonOpacity(opacity: number): void {
    if (typeof opacity === 'number' && Number.isFinite(opacity)) {
      this.store.setPolygonOpacity(opacity);
    }
  }

  changeMarkerIcon(icon: string): void {
    if (typeof icon === 'string') {
      this.store.setMarkerIcon(icon);
    }
  }

  getSelectedTool(): DrawToolType | null {
    return this.store.states.selectedTool;
  }

  getSelectedColor(): string {
    return this.store.states.color;
  }

  on<K extends DrawEventName>(eventName: K, handler: (payload: DrawEventMap[K]) => void): () => void {
    this.eventHandlers[eventName].add(handler as (payload: unknown) => void);

    return () => {
      this.off(eventName, handler);
    };
  }

  off<K extends DrawEventName>(eventName: K, handler: (payload: DrawEventMap[K]) => void): void {
    this.eventHandlers[eventName].delete(handler as (payload: unknown) => void);
  }

  exportData(format: DrawExportFormat = 'json'): DrawShape[] | GeoJSONFeatureCollection {
    const shapes = this.collectShapes();
    this.emit('exported', { count: shapes.length, format });

    if (format === 'geojson') {
      return toGeoJSON(shapes);
    }

    return shapes;
  }

  importData(payload: unknown, options: DrawImportOptions = {}): void {
    const { clearExisting = false } = options;

    if (clearExisting) {
      this.clearAllArt();
    }

    let parsed: { format: DrawExportFormat; shapes: DrawShape[] };
    try {
      parsed = parseImportPayload(payload);
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Failed to parse import payload');
      this.emit('error', { error: normalizedError, context: 'importData' });
      throw normalizedError;
    }

    if (parsed.shapes.length === 0) {
      return;
    }

    const grouped = parsed.shapes.reduce((accumulator, shape) => {
      accumulator[shape.type].push(shape);
      return accumulator;
    }, {
      BRUSH: [] as DrawShape[],
      POLYGON: [] as DrawShape[],
      POLYLINE: [] as DrawShape[],
      CIRCLE: [] as DrawShape[],
      RECTANGLE: [] as DrawShape[],
      MARKER: [] as DrawShape[],
    });

    (Object.keys(grouped) as DrawToolType[]).forEach((toolType) => {
      if (grouped[toolType].length > 0) {
        this.tools[toolType].importShapes(grouped[toolType]);
      }
    });

    this.emit('imported', { count: parsed.shapes.length, format: parsed.format });
  }

  destroy(): void {
    Object.values(this.tools).forEach((tool) => tool.destroy());
    this.store.setSelectedTool(null);
    this.emit('toolChanged', { tool: null });
    (Object.keys(this.eventHandlers) as DrawEventName[]).forEach((eventName) => this.eventHandlers[eventName].clear());
  }

  private activateTool(toolType: DrawToolType): void {
    const selectedTool = this.store.states.selectedTool;

    if (selectedTool === toolType) {
      return;
    }

    if (selectedTool) {
      this.tools[selectedTool].stopDraw();
    }

    this.store.setSelectedTool(toolType);
    this.tools[toolType].startDraw();
    this.emit('toolChanged', { tool: toolType });
  }

  private deactivateTool(toolType: DrawToolType): void {
    this.tools[toolType].stopDraw();

    if (this.store.states.selectedTool === toolType) {
      this.store.setSelectedTool(null);
      this.emit('toolChanged', { tool: null });
    }
  }

  private collectShapes(): DrawShape[] {
    return (Object.keys(this.tools) as DrawToolType[]).flatMap((toolType) => this.tools[toolType].exportShapes());
  }

  private emit<K extends DrawEventName>(eventName: K, payload: DrawEventMap[K]): void {
    this.eventHandlers[eventName].forEach((handler) => {
      (handler as (eventPayload: DrawEventMap[K]) => void)(payload);
    });
  }
}
