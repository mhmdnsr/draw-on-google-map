import { Store } from './store';
import { DrawShape, DrawToolType, IDrawTool, ToolCallbacks } from './types';
import { cloneShape } from './utils';

interface StoredShape {
  shape: DrawShape;
  overlay: unknown;
}

export abstract class BaseTool implements IDrawTool {
  readonly type: DrawToolType;

  protected readonly map: google.maps.Map;
  protected readonly store: Store;
  protected readonly callbacks: ToolCallbacks;
  protected isDrawing = false;

  private readonly listeners: google.maps.MapsEventListener[] = [];
  private readonly shapes: Map<string, StoredShape> = new Map();

  protected constructor(type: DrawToolType, map: google.maps.Map, store: Store, callbacks: ToolCallbacks) {
    this.type = type;
    this.map = map;
    this.store = store;
    this.callbacks = callbacks;
  }

  abstract startDraw(): void;
  abstract stopDraw(): void;

  protected abstract createOverlayFromShape(shape: DrawShape): unknown;

  protected addMapListener(eventName: string, handler: (event: google.maps.MapMouseEvent) => void): void {
    if (typeof this.map.addListener !== 'function') {
      return;
    }

    const listener = this.map.addListener(eventName, handler);
    if (listener) {
      this.listeners.push(listener);
    }
  }

  protected clearListeners(): void {
    this.listeners.splice(0).forEach((listener) => {
      if (typeof google !== 'undefined' && google.maps?.event?.removeListener) {
        google.maps.event.removeListener(listener);
      } else if (listener && typeof (listener as { remove?: () => void }).remove === 'function') {
        (listener as { remove: () => void }).remove();
      }
    });
  }

  protected rememberShape(shape: DrawShape, overlay: unknown, emit = true): void {
    const normalizedShape = cloneShape(shape);
    this.shapes.set(shape.id, {
      shape: normalizedShape,
      overlay,
    });

    if (emit) {
      this.callbacks.onShapeCreated(this.type, cloneShape(normalizedShape));
    }
  }

  protected removeOverlay(overlay: unknown): void {
    if (overlay && typeof (overlay as { setMap?: (map: google.maps.Map | null) => void }).setMap === 'function') {
      (overlay as { setMap: (map: google.maps.Map | null) => void }).setMap(null);
      return;
    }

    if (overlay && 'map' in (overlay as object)) {
      (overlay as { map: google.maps.Map | null }).map = null;
    }
  }

  exportShapes(): DrawShape[] {
    return Array.from(this.shapes.values()).map((entry) => cloneShape(entry.shape));
  }

  importShapes(shapes: DrawShape[]): void {
    const toolShapes = shapes.filter((shape) => shape.type === this.type);

    toolShapes.forEach((shape) => {
      try {
        const overlay = this.createOverlayFromShape(shape);
        this.rememberShape(shape, overlay, false);
      } catch (error) {
        this.callbacks.onError(error instanceof Error ? error : new Error('Failed to import shape'), `${this.type}.importShapes`);
      }
    });
  }

  clearArt(): void {
    if (this.shapes.size === 0) {
      return;
    }

    const ids: string[] = [];

    this.shapes.forEach((entry, id) => {
      ids.push(id);
      this.removeOverlay(entry.overlay);
    });

    this.shapes.clear();
    this.callbacks.onShapeCleared(this.type, ids);
  }

  destroy(): void {
    this.stopDraw();
    this.clearArt();
    this.clearListeners();
  }
}
