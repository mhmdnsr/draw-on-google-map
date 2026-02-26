import { Store } from './store/store';

export class Rectangle {
    #map: google.maps.Map;
    #store: Store;
    #isSelected: boolean = false;
    #drawn: google.maps.Rectangle[] = [];

    #mouseDownListener: google.maps.MapsEventListener | null = null;
    #mouseMoveListener: google.maps.MapsEventListener | null = null;
    #mouseUpListener: google.maps.MapsEventListener | null = null;

    #startPoint: google.maps.LatLng | null = null;
    #tempRectangle: google.maps.Rectangle | null = null;
    #isDragging: boolean = false;

    constructor(map: google.maps.Map, store: Store) {
        this.#map = map;
        this.#store = store;
    }

    startDraw = () => {
        if (!(this.#store.states.selected instanceof Rectangle)) return;

        this.#isSelected = true;
        this.#map.setOptions({ draggable: false, draggableCursor: 'crosshair', clickableIcons: false });

        this.#mouseDownListener = this.#map.addListener('mousedown', (e: google.maps.MapMouseEvent) => {
            if (!this.#isSelected || !e.latLng) return;
            this.startDragging(e.latLng);
        });

        this.#mouseMoveListener = this.#map.addListener('mousemove', (e: google.maps.MapMouseEvent) => {
            if (!this.#isSelected || !this.#isDragging || !e.latLng) return;
            this.updateBounds(e.latLng);
        });

        this.#mouseUpListener = this.#map.addListener('mouseup', (_e: google.maps.MapMouseEvent) => {
            if (!this.#isSelected || !this.#isDragging) return;
            this.finishRectangle();
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
        this.#startPoint = latLng;

        this.#tempRectangle = new google.maps.Rectangle({
            map: this.#map,
            bounds: new google.maps.LatLngBounds(latLng, latLng),
            strokeColor: this.#store.states.color,
            strokeWeight: this.#store.states.strokeWeight,
            fillColor: this.#store.states.polygonFillColor,
            fillOpacity: this.#store.states.polygonOpacity,
            clickable: false
        });
    }

    private updateBounds(cursorLatLng: google.maps.LatLng) {
        if (!this.#tempRectangle || !this.#startPoint) return;

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(this.#startPoint);
        bounds.extend(cursorLatLng);
        this.#tempRectangle.setBounds(bounds);
    }

    private finishRectangle() {
        if (this.#tempRectangle) {
            this.#tempRectangle.setOptions({ clickable: true });
            this.#drawn.push(this.#tempRectangle);
            this.#tempRectangle = null;
        }

        this.#isDragging = false;
        this.#startPoint = null;
    }

    private cleanupTemp() {
        if (this.#tempRectangle) {
            this.#tempRectangle.setMap(null);
            this.#tempRectangle = null;
        }
        this.#isDragging = false;
        this.#startPoint = null;
    }

    clearArt() {
        this.#drawn.forEach(r => r.setMap(null));
        this.#drawn = [];
    }

    clearDrawn() {
        this.clearArt();
    }

    getType() { return 'RECTANGLE'; }
}
