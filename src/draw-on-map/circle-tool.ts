import { BaseTool } from './base-tool';
import { Store } from './store';
import { DrawShape, ToolCallbacks } from './types';
import { createShapeId, distanceBetween, toLatLngLiteral } from './utils';

export class Circle extends BaseTool {
  private center: google.maps.LatLngLiteral | null = null;
  private radius = 0;
  private tempCircle: google.maps.Circle | null = null;
  private isDragging = false;

  constructor(map: google.maps.Map, store: Store, callbacks: ToolCallbacks) {
    super('CIRCLE', map, store, callbacks);
  }

  startDraw(): void {
    if (this.isDrawing) {
      return;
    }

    this.isDrawing = true;
    this.map.setOptions({ draggable: false, draggableCursor: 'crosshair', clickableIcons: false });

    this.addMapListener('mousedown', (event) => {
      if (!this.isDrawing || !event.latLng) {
        return;
      }

      this.startDragging(event.latLng);
    });

    this.addMapListener('mousemove', (event) => {
      if (!this.isDrawing || !this.isDragging || !event.latLng) {
        return;
      }

      this.updateRadius(event.latLng);
    });

    this.addMapListener('mouseup', () => {
      if (!this.isDrawing || !this.isDragging) {
        return;
      }

      this.finishCircle();
    });
  }

  stopDraw(): void {
    if (!this.isDrawing) {
      return;
    }

    this.clearListeners();
    this.cleanupDraft();
    this.map.setOptions({ draggable: true, draggableCursor: null, clickableIcons: true });
    this.isDrawing = false;
  }

  protected createOverlayFromShape(shape: DrawShape): unknown {
    const geometry = shape.geometry as { center: google.maps.LatLngLiteral; radius: number };

    return new google.maps.Circle({
      map: this.map,
      center: geometry.center,
      radius: geometry.radius,
      strokeColor: shape.style.strokeColor,
      strokeWeight: shape.style.strokeWeight,
      fillColor: shape.style.fillColor,
      fillOpacity: shape.style.fillOpacity,
      clickable: true,
    });
  }

  private startDragging(latLng: google.maps.LatLng): void {
    this.isDragging = true;
    this.center = toLatLngLiteral(latLng);
    this.radius = 0;

    this.tempCircle = new google.maps.Circle({
      map: this.map,
      center: this.center,
      radius: this.radius,
      strokeColor: this.store.states.color,
      strokeWeight: this.store.states.strokeWeight,
      fillColor: this.store.states.polygonFillColor,
      fillOpacity: this.store.states.polygonOpacity,
      clickable: false,
    });
  }

  private updateRadius(cursorLatLng: google.maps.LatLng): void {
    if (!this.tempCircle || !this.center) {
      return;
    }

    this.radius = distanceBetween(this.center, toLatLngLiteral(cursorLatLng));
    this.tempCircle.setRadius(this.radius);
  }

  private finishCircle(): void {
    if (!this.center || !this.tempCircle || this.radius <= 0) {
      this.cleanupDraft();
      return;
    }

    const finalCircle = this.tempCircle;

    const shape: DrawShape = {
      id: createShapeId('CIRCLE'),
      type: 'CIRCLE',
      geometry: {
        center: this.center,
        radius: this.radius,
      },
      style: {
        strokeColor: this.store.states.color,
        strokeWeight: this.store.states.strokeWeight,
        fillColor: this.store.states.polygonFillColor,
        fillOpacity: this.store.states.polygonOpacity,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        source: 'draw',
      },
    };

    finalCircle.setOptions({ clickable: true });
    this.tempCircle = null;
    this.rememberShape(shape, finalCircle);
    this.cleanupDraft();
  }

  private cleanupDraft(): void {
    if (this.tempCircle) {
      this.tempCircle.setMap(null);
      this.tempCircle = null;
    }

    this.center = null;
    this.radius = 0;
    this.isDragging = false;
  }
}
