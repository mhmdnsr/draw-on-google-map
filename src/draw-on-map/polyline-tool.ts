import { Store } from './store/store';

export class Polyline {
    #map: google.maps.Map;
    #store: Store;
    #isSelected: boolean = false;
    #listener: google.maps.MapsEventListener | null = null;
    #moveListener: google.maps.MapsEventListener | null = null;
    #dblClickListener: google.maps.MapsEventListener | null = null;
    #drawn: google.maps.Polyline[] = [];

    #currentPolyline: google.maps.Polyline | null = null;
    #path: google.maps.LatLng[] = [];
    #tempLine: google.maps.Polyline | null = null;

    constructor(map: google.maps.Map, store: Store) {
        this.#map = map;
        this.#store = store;
    }

    startDraw = () => {
        if (!(this.#store.states.selected instanceof Polyline)) return;

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
             this.finishPolyline();
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

    private finishPolyline() {
        if (this.#path.length < 2) {
            this.cleanupTemp();
            return;
        }

        const polyline = new google.maps.Polyline({
            map: this.#map,
            path: this.#path,
            strokeColor: this.#store.states.color,
            strokeWeight: this.#store.states.strokeWeight,
            clickable: true
        });

        this.#drawn.push(polyline);

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

    clearDrawn() {
        this.clearArt();
    }

    getType() { return 'POLYLINE'; }
}
