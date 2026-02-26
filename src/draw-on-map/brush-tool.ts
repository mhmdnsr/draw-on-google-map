import { BaseTool } from './base-tool';
import { Store } from './store';
import { DrawShape, ToolCallbacks } from './types';
import { createShapeId, mapPathToLiteral } from './utils';

export class Brush extends BaseTool {
  private activeStrokeId: string | null = null;
  private activePolyline: google.maps.Polyline | null = null;

  constructor(map: google.maps.Map, store: Store, callbacks: ToolCallbacks) {
    super('BRUSH', map, store, callbacks);
  }

  startDraw(): void {
    if (this.isDrawing) {
      return;
    }

    this.isDrawing = true;
    this.map.setOptions({ draggableCursor: 'cell' });

    this.addMapListener('mousedown', (event) => {
      if (!this.isDrawing || !event.latLng) {
        return;
      }
      this.startStroke(event.latLng);
      this.pushStrokePoint(event.latLng);
    });

    this.addMapListener('mousemove', (event) => {
      if (!this.isDrawing || !event.latLng) {
        return;
      }
      this.pushStrokePoint(event.latLng);
    });

    this.addMapListener('mouseup', () => {
      this.finishStroke();
    });

    this.addMapListener('mouseout', () => {
      this.finishStroke();
    });
  }

  stopDraw(): void {
    if (!this.isDrawing) {
      return;
    }

    this.finishStroke();
    this.clearListeners();
    this.map.setOptions({ draggableCursor: null });
    this.isDrawing = false;
  }

  protected createOverlayFromShape(shape: DrawShape): unknown {
    const geometry = shape.geometry as { path: google.maps.LatLngLiteral[] };
    return new google.maps.Polyline({
      map: this.map,
      path: geometry.path,
      strokeColor: shape.style.strokeColor,
      strokeWeight: shape.style.strokeWeight,
      clickable: false,
      zIndex: 200000,
    });
  }

  private startStroke(latLng: google.maps.LatLng): void {
    this.activeStrokeId = createShapeId('BRUSH');
    this.activePolyline = new google.maps.Polyline({
      map: this.map,
      path: [latLng],
      strokeColor: this.store.states.color,
      strokeWeight: this.store.states.strokeWeight,
      clickable: false,
      zIndex: 200000,
    });
  }

  private pushStrokePoint(latLng: google.maps.LatLng): void {
    if (!this.activePolyline) {
      return;
    }

    const path = this.activePolyline.getPath();
    path.insertAt(path.getLength(), latLng);
  }

  private finishStroke(): void {
    if (!this.activePolyline || !this.activeStrokeId) {
      this.activePolyline = null;
      this.activeStrokeId = null;
      return;
    }

    const path = mapPathToLiteral(this.activePolyline.getPath());

    if (path.length > 1) {
      const shape: DrawShape = {
        id: this.activeStrokeId,
        type: 'BRUSH',
        geometry: { path },
        style: {
          strokeColor: this.store.states.color,
          strokeWeight: this.store.states.strokeWeight,
        },
        metadata: {
          createdAt: new Date().toISOString(),
          source: 'draw',
        },
      };

      this.rememberShape(shape, this.activePolyline);
    } else {
      this.removeOverlay(this.activePolyline);
    }

    this.activePolyline = null;
    this.activeStrokeId = null;
  }
}
