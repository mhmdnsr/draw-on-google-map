import { Store } from './store/store';

export class Polygon {
    #map: google.maps.Map;
    #store: Store; // Type Store
    #isSelected: boolean = false;
    #listener: google.maps.MapsEventListener | null = null;
    #moveListener: google.maps.MapsEventListener | null = null;
    #dblClickListener: google.maps.MapsEventListener | null = null;
    #drawn: google.maps.Polygon[] = [];

    #currentPolyline: google.maps.Polyline | null = null;
    #path: google.maps.LatLng[] = [];
    #tempLine: google.maps.Polyline | null = null; // Line from last point to cursor

    constructor(map: google.maps.Map, store: Store) {
        this.#map = map;
        this.#store = store;
    }

    startDraw = () => {
        if (!(this.#store.states.selected instanceof Polygon)) return;

        this.#isSelected = true;
        this.#map.setOptions({ draggableCursor: 'crosshair', clickableIcons: false, disableDoubleClickZoom: true });

        this.#path = [];

        this.#listener = this.#map.addListener('click', (e: google.maps.MapMouseEvent) => {
             if (!this.#isSelected || !e.latLng) return;
             this.addPoint(e.latLng);
        });

        this.#moveListener = this.#map.addListener('mousemove', (e: google.maps.MapMouseEvent) => {
            if (!this.#isSelected || !e.latLng || this.#path.length === 0) return;
            this.updateTempLine(e.latLng);
        });

        this.#dblClickListener = this.#map.addListener('dblclick', (_e: google.maps.MapMouseEvent) => {
             if (!this.#isSelected) return;
             this.finishPolygon();
        });
    }

    stopDraw = () => {
        if (!this.#isSelected) return;

        this.#isSelected = false;
        this.#map.setOptions({ draggableCursor: null, clickableIcons: true, disableDoubleClickZoom: false });

        if (this.#listener) {
            google.maps.event.removeListener(this.#listener);
            this.#listener = null;
        }
        if (this.#moveListener) {
             google.maps.event.removeListener(this.#moveListener);
             this.#moveListener = null;
        }
        if (this.#dblClickListener) {
             google.maps.event.removeListener(this.#dblClickListener);
             this.#dblClickListener = null;
        }

        this.cleanupTemp();
    }

    private addPoint(latLng: google.maps.LatLng) {
        this.#path.push(latLng);

        if (!this.#currentPolyline) {
            this.#currentPolyline = new google.maps.Polyline({
                map: this.#map,
                path: this.#path,
                strokeColor: this.#store.states.color,
                strokeWeight: this.#store.states.strokeWeight,
                clickable: false
            });
        } else {
            this.#currentPolyline.setPath(this.#path);
        }
    }

    private updateTempLine(cursorLatLng: google.maps.LatLng) {
        if (this.#path.length === 0) return;
        const lastPoint = this.#path[this.#path.length - 1];

        if (!this.#tempLine) {
            this.#tempLine = new google.maps.Polyline({
                map: this.#map,
                path: [lastPoint, cursorLatLng],
                strokeColor: this.#store.states.color,
                strokeWeight: this.#store.states.strokeWeight,
                strokeOpacity: 0.5,
                clickable: false
            });
        } else {
            this.#tempLine.setPath([lastPoint, cursorLatLng]);
        }
    }

    private finishPolygon() {
        if (this.#path.length < 3) {
            this.cleanupTemp();
            return; // Not enough points
        }

        const polygon = new google.maps.Polygon({
            map: this.#map,
            paths: this.#path,
            strokeColor: this.#store.states.color,
            strokeWeight: this.#store.states.strokeWeight,
            fillColor: this.#store.states.polygonFillColor,
            fillOpacity: this.#store.states.polygonOpacity,
            clickable: true
        });

        this.#drawn.push(polygon);

        // Reset path for the next polygon (Drawing Manager allows multiple polygons sequentially)
        this.cleanupTemp();
    }

    private cleanupTemp() {
        if (this.#currentPolyline) {
            this.#currentPolyline.setMap(null);
            this.#currentPolyline = null;
        }
        if (this.#tempLine) {
            this.#tempLine.setMap(null);
            this.#tempLine = null;
        }
        this.#path = [];
    }

    clearArt() {
        this.#drawn.forEach(p => p.setMap(null));
        this.#drawn = [];
    }

    // Alias for compatibility
    clearDrawn() {
        this.clearArt();
    }

    getType() { return 'POLYGON'; }
}
