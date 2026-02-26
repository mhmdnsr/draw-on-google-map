import { BaseTool } from './base-tool';
import { Store } from './store';
import { DrawShape, ToolCallbacks } from './types';
import { createShapeId, toLatLngLiteral } from './utils';

export class Rectangle extends BaseTool {
  private startPoint: google.maps.LatLngLiteral | null = null;
  private tempRectangle: google.maps.Rectangle | null = null;
  private isDragging = false;

  constructor(map: google.maps.Map, store: Store, callbacks: ToolCallbacks) {
    super('RECTANGLE', map, store, callbacks);
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

      this.updateBounds(event.latLng);
    });

    this.addMapListener('mouseup', () => {
      if (!this.isDrawing || !this.isDragging) {
        return;
      }

      this.finishRectangle();
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
    const geometry = shape.geometry as { bounds: { north: number; south: number; east: number; west: number } };

    return new google.maps.Rectangle({
      map: this.map,
      bounds: {
        north: geometry.bounds.north,
        south: geometry.bounds.south,
        east: geometry.bounds.east,
        west: geometry.bounds.west,
      },
      strokeColor: shape.style.strokeColor,
      strokeWeight: shape.style.strokeWeight,
      fillColor: shape.style.fillColor,
      fillOpacity: shape.style.fillOpacity,
      clickable: true,
    });
  }

  private startDragging(latLng: google.maps.LatLng): void {
    this.startPoint = toLatLngLiteral(latLng);
    this.isDragging = true;

    this.tempRectangle = new google.maps.Rectangle({
      map: this.map,
      bounds: {
        north: this.startPoint.lat,
        south: this.startPoint.lat,
        east: this.startPoint.lng,
        west: this.startPoint.lng,
      },
      strokeColor: this.store.states.color,
      strokeWeight: this.store.states.strokeWeight,
      fillColor: this.store.states.polygonFillColor,
      fillOpacity: this.store.states.polygonOpacity,
      clickable: false,
    });
  }

  private updateBounds(cursorLatLng: google.maps.LatLng): void {
    if (!this.tempRectangle || !this.startPoint) {
      return;
    }

    const cursor = toLatLngLiteral(cursorLatLng);

    this.tempRectangle.setBounds({
      north: Math.max(this.startPoint.lat, cursor.lat),
      south: Math.min(this.startPoint.lat, cursor.lat),
      east: Math.max(this.startPoint.lng, cursor.lng),
      west: Math.min(this.startPoint.lng, cursor.lng),
    });
  }

  private finishRectangle(): void {
    if (!this.tempRectangle || !this.startPoint) {
      this.cleanupDraft();
      return;
    }

    const bounds = this.tempRectangle.getBounds();
    if (!bounds) {
      this.cleanupDraft();
      return;
    }

    const finalRectangle = this.tempRectangle;
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    const shape: DrawShape = {
      id: createShapeId('RECTANGLE'),
      type: 'RECTANGLE',
      geometry: {
        bounds: {
          north: northEast.lat(),
          south: southWest.lat(),
          east: northEast.lng(),
          west: southWest.lng(),
        },
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

    finalRectangle.setOptions({ clickable: true });
    this.tempRectangle = null;
    this.rememberShape(shape, finalRectangle);
    this.cleanupDraft();
  }

  private cleanupDraft(): void {
    if (this.tempRectangle) {
      this.tempRectangle.setMap(null);
      this.tempRectangle = null;
    }

    this.startPoint = null;
    this.isDragging = false;
  }
}
