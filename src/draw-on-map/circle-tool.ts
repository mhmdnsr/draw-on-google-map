import { Store } from './store/store';

export class Circle {
    #map: google.maps.Map;
    #store: Store;
    #isSelected: boolean = false;
    #drawn: google.maps.Circle[] = [];

    #mouseDownListener: google.maps.MapsEventListener | null = null;
    #mouseMoveListener: google.maps.MapsEventListener | null = null;
    #mouseUpListener: google.maps.MapsEventListener | null = null;

    #center: google.maps.LatLng | null = null;
    #tempCircle: google.maps.Circle | null = null;
    #isDragging: boolean = false;

    constructor(map: google.maps.Map, store: Store) {
        this.#map = map;
        this.#store = store;
    }

    startDraw = () => {
        if (!(this.#store.states.selected instanceof Circle)) return;

        this.#isSelected = true;
        this.#map.setOptions({ draggable: false, draggableCursor: 'crosshair', clickableIcons: false });

        this.#mouseDownListener = this.#map.addListener('mousedown', (e: google.maps.MapMouseEvent) => {
            if (!this.#isSelected || !e.latLng) return;
            this.startDragging(e.latLng);
        });

        this.#mouseMoveListener = this.#map.addListener('mousemove', (e: google.maps.MapMouseEvent) => {
            if (!this.#isSelected || !this.#isDragging || !e.latLng) return;
            this.updateRadius(e.latLng);
        });

        this.#mouseUpListener = this.#map.addListener('mouseup', (_e: google.maps.MapMouseEvent) => {
            if (!this.#isSelected || !this.#isDragging) return;
            this.finishCircle();
        });
    }

    stopDraw = () => {
        if (!this.#isSelected) return;

        this.#isSelected = false;
        this.#map.setOptions({ draggable: true, draggableCursor: null, clickableIcons: true });
        this.cleanupListeners();
        this.cleanupTemp();
    }

    private cleanupListeners() {
        if (this.#mouseDownListener) {
            google.maps.event.removeListener(this.#mouseDownListener);
            this.#mouseDownListener = null;
        }
        if (this.#mouseMoveListener) {
            google.maps.event.removeListener(this.#mouseMoveListener);
            this.#mouseMoveListener = null;
        }
        if (this.#mouseUpListener) {
            google.maps.event.removeListener(this.#mouseUpListener);
            this.#mouseUpListener = null;
        }
    }

    private startDragging(latLng: google.maps.LatLng) {
        this.#isDragging = true;
        this.#center = latLng;

        this.#tempCircle = new google.maps.Circle({
            map: this.#map,
            center: this.#center,
            radius: 0,
            strokeColor: this.#store.states.color,
            strokeWeight: this.#store.states.strokeWeight,
            fillColor: this.#store.states.polygonFillColor,
            fillOpacity: this.#store.states.polygonOpacity,
            clickable: false
        });
    }

    private updateRadius(cursorLatLng: google.maps.LatLng) {
        if (!this.#tempCircle || !this.#center) return;

        const radius = google.maps.geometry.spherical.computeDistanceBetween(this.#center, cursorLatLng);
        this.#tempCircle.setRadius(radius);
    }

    private finishCircle() {
        if (this.#tempCircle) {
            // Make it permanent
            this.#tempCircle.setOptions({ clickable: true });
            this.#drawn.push(this.#tempCircle);
            this.#tempCircle = null;
        }

        this.#isDragging = false;
        this.#center = null;
    }

    private cleanupTemp() {
        if (this.#tempCircle) {
            this.#tempCircle.setMap(null);
            this.#tempCircle = null;
        }
        this.#isDragging = false;
        this.#center = null;
    }

    clearArt() {
        this.#drawn.forEach(c => c.setMap(null));
        this.#drawn = [];
    }

    clearDrawn() {
        this.clearArt();
    }

    getType() { return 'CIRCLE'; }
}
