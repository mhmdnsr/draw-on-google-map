import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import MapDraw from 'draw-on-google-map';

// Ensure Google Maps typings are available or declare var google: any;

@Component({
  selector: 'app-root',
  template: `
    <h1>Angular Example</h1>
    <div class="controls">
      <button (click)="draw?.brush.startDraw()">Brush</button>
      <button (click)="draw?.polygon.startDraw()">Polygon</button>
      <button (click)="draw?.polyline.startDraw()">Polyline</button>
      <button (click)="draw?.circle.startDraw()">Circle</button>
      <button (click)="draw?.rectangle.startDraw()">Rectangle</button>
      <button (click)="draw?.marker.startDraw()">Marker</button>
      <button (click)="draw?.clearAllArt()">Clear</button>
    </div>
    <div #mapContainer style="width: 100%; height: 500px;"></div>
  `,
  styles: ['.controls { margin-bottom: 10px; } button { margin-right: 5px; }']
})
export class AppComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  draw: any;

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    // Ensure Google Maps API is loaded
    if ((window as any).google) {
      const map = new (window as any).google.maps.Map(this.mapContainer.nativeElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapId: "DEMO_MAP_ID"
      });

      this.draw = new MapDraw(map);
    }
  }
}
