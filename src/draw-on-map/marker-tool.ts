import { BaseTool } from './base-tool';
import { ColorfulMarkerIcon } from './colorfulMarkerIcon';
import { Store } from './store';
import { DrawShape, ToolCallbacks } from './types';
import { createShapeId, toLatLngLiteral } from './utils';

export class Marker extends BaseTool {
  constructor(map: google.maps.Map, store: Store, callbacks: ToolCallbacks) {
    super('MARKER', map, store, callbacks);
  }

  startDraw(): void {
    if (this.isDrawing) {
      return;
    }

    this.isDrawing = true;
    this.map.setOptions({ draggableCursor: 'crosshair', clickableIcons: false });

    this.addMapListener('click', (event) => {
      if (!this.isDrawing || !event.latLng) {
        return;
      }

      this.addMarker(event.latLng);
    });
  }

  stopDraw(): void {
    if (!this.isDrawing) {
      return;
    }

    this.clearListeners();
    this.map.setOptions({ draggableCursor: null, clickableIcons: true });
    this.isDrawing = false;
  }

  protected createOverlayFromShape(shape: DrawShape): unknown {
    const geometry = shape.geometry as { position: google.maps.LatLngLiteral };
    const markerIcon = shape.style.markerIcon ?? null;

    return this.createMarker(geometry.position, markerIcon);
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

  private addMarker(position: google.maps.LatLng): void {
    const icon = this.getIcon();
    const literalPosition = toLatLngLiteral(position);
    const marker = this.createMarker(literalPosition, icon);

    const shape: DrawShape = {
      id: createShapeId('MARKER'),
      type: 'MARKER',
      geometry: { position: literalPosition },
      style: {
        strokeColor: this.store.states.color,
        strokeWeight: this.store.states.strokeWeight,
        markerIcon: this.store.states.markerIcon,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        source: 'draw',
      },
    };

    this.rememberShape(shape, marker);
  }

  private createMarker(position: google.maps.LatLngLiteral, icon: string | null): unknown {
    if (google.maps.marker?.AdvancedMarkerElement) {
      const markerOptions: {
        map: google.maps.Map;
        position: google.maps.LatLngLiteral;
        content?: HTMLElement;
      } = {
        map: this.map,
        position,
      };

      if (icon) {
        const img = document.createElement('img');
        img.src = icon;
        markerOptions.content = img;
      }

      return new google.maps.marker.AdvancedMarkerElement(markerOptions);
    }

    return new google.maps.Marker({
      map: this.map,
      position,
      icon,
      draggable: false,
    });
  }

  private getIcon(): string | null {
    const { markerIcon } = this.store.states;

    if (!markerIcon || markerIcon.toLowerCase() === 'default') {
      return null;
    }

    if (markerIcon.toLowerCase() === 'colorful') {
      return new ColorfulMarkerIcon(this.store).icon();
    }

    return markerIcon;
  }
}
