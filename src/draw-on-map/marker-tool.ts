import { Store } from './store/store';
import { ColorfulMarkerIcon } from './colorfulMarkerIcon';

export class Marker {
    #map: google.maps.Map;
    #store: Store;
    #isSelected: boolean = false;
    #listener: google.maps.MapsEventListener | null = null;
    #drawn: any[] = [];

    constructor(map: google.maps.Map, store: Store) {
        this.#map = map;
        this.#store = store;
    }

    startDraw = () => {
        if (!(this.#store.states.selected instanceof Marker)) return;

        this.#isSelected = true;
        this.#map.setOptions({ draggableCursor: 'crosshair', clickableIcons: false });

        this.#listener = this.#map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (!this.#isSelected || !e.latLng) return;
            this.addMarker(e.latLng);
        });
    }

    stopDraw = () => {
        if (!this.#isSelected) return;

        this.#isSelected = false;
        this.#map.setOptions({ draggableCursor: null, clickableIcons: true });

        if (this.#listener) {
            google.maps.event.removeListener(this.#listener);
            this.#listener = null;
        }
    }

    private addMarker(position: google.maps.LatLng) {
        let marker;
        const icon = this.getIcon();

        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
             const markerOptions: any = {
                map: this.#map,
                position: position,
            };

            if (icon) {
                 const img = document.createElement('img');
                 img.src = icon;
                 markerOptions.content = img;
            }

            marker = new google.maps.marker.AdvancedMarkerElement(markerOptions);
        } else {
            marker = new google.maps.Marker({
                map: this.#map,
                position: position,
                icon: icon,
                draggable: false
            });
        }

        this.#drawn.push(marker);
    }

    private getIcon(): string | null {
        const { markerIcon } = this.#store.states;
        if (!markerIcon || markerIcon.toLowerCase() === 'default') return null;

        if (markerIcon.toLowerCase() === 'colorful') {
             return new ColorfulMarkerIcon(this.#store).icon();
        }

        return markerIcon;
    }

    clearArt() {
        this.#drawn.forEach(marker => {
            marker.map = null;
        });
        this.#drawn = [];
    }

    clearDrawn() {
        this.clearArt();
    }

    getType() { return 'MARKER'; }
}
