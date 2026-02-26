import { BaseTool } from './base-tool';
import { Store } from './store';
import { DrawShape, ToolCallbacks } from './types';
import { createShapeId, toLatLngLiteral } from './utils';

export class Polyline extends BaseTool {
  private currentPath: google.maps.LatLngLiteral[] = [];
  private previewPolyline: google.maps.Polyline | null = null;
  private tempLine: google.maps.Polyline | null = null;

  constructor(map: google.maps.Map, store: Store, callbacks: ToolCallbacks) {
    super('POLYLINE', map, store, callbacks);
  }

  startDraw(): void {
    if (this.isDrawing) {
      return;
    }

    this.isDrawing = true;
    this.currentPath = [];
    this.map.setOptions({ draggableCursor: 'crosshair', clickableIcons: false, disableDoubleClickZoom: true });

    this.addMapListener('click', (event) => {
      if (!this.isDrawing || !event.latLng) {
        return;
      }
      this.addPoint(event.latLng);
    });

    this.addMapListener('mousemove', (event) => {
      if (!this.isDrawing || !event.latLng || this.currentPath.length === 0) {
        return;
      }
      this.updateTempLine(event.latLng);
    });

    this.addMapListener('dblclick', () => {
      if (!this.isDrawing) {
        return;
      }
      this.finishPolyline();
    });
  }

  stopDraw(): void {
    if (!this.isDrawing) {
      return;
    }

    this.clearListeners();
    this.cleanupDraft();
    this.map.setOptions({ draggableCursor: null, clickableIcons: true, disableDoubleClickZoom: false });
    this.isDrawing = false;
  }

  protected createOverlayFromShape(shape: DrawShape): unknown {
    const geometry = shape.geometry as { path: google.maps.LatLngLiteral[] };

    return new google.maps.Polyline({
      map: this.map,
      path: geometry.path,
      strokeColor: shape.style.strokeColor,
      strokeWeight: shape.style.strokeWeight,
      clickable: true,
    });
  }

  private addPoint(latLng: google.maps.LatLng): void {
    this.currentPath.push(toLatLngLiteral(latLng));

    if (!this.previewPolyline) {
      this.previewPolyline = new google.maps.Polyline({
        map: this.map,
        path: this.currentPath,
        strokeColor: this.store.states.color,
        strokeWeight: this.store.states.strokeWeight,
        clickable: false,
      });
      return;
    }

    this.previewPolyline.setPath(this.currentPath);
  }

  private updateTempLine(cursorLatLng: google.maps.LatLng): void {
    const lastPoint = this.currentPath[this.currentPath.length - 1];

    if (!this.tempLine) {
      this.tempLine = new google.maps.Polyline({
        map: this.map,
        path: [lastPoint, toLatLngLiteral(cursorLatLng)],
        strokeColor: this.store.states.color,
        strokeWeight: this.store.states.strokeWeight,
        strokeOpacity: 0.5,
        clickable: false,
      });
      return;
    }

    this.tempLine.setPath([lastPoint, toLatLngLiteral(cursorLatLng)]);
  }

  private finishPolyline(): void {
    if (this.currentPath.length < 2) {
      this.cleanupDraft();
      return;
    }

    const shape: DrawShape = {
      id: createShapeId('POLYLINE'),
      type: 'POLYLINE',
      geometry: { path: [...this.currentPath] },
      style: {
        strokeColor: this.store.states.color,
        strokeWeight: this.store.states.strokeWeight,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        source: 'draw',
      },
    };

    const polyline = this.createOverlayFromShape(shape);
    this.rememberShape(shape, polyline);
    this.cleanupDraft();
  }

  private cleanupDraft(): void {
    if (this.previewPolyline) {
      this.previewPolyline.setMap(null);
      this.previewPolyline = null;
    }

    if (this.tempLine) {
      this.tempLine.setMap(null);
      this.tempLine = null;
    }

    this.currentPath = [];
  }
}
