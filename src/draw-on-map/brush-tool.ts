import { Tools } from './tools';
import { Store } from './store/store';

export class Brush extends Tools {
    #map: google.maps.Map;
    #google: any;
    #store: Store;
    #isSelected: boolean = false;
    #drawn: google.maps.Polyline[] = [];

    constructor(map: google.maps.Map, google: any, store: Store) {
        super(store);
        this.#map = map;
        this.#google = google;
        this.#store = store;
    }

    private initTool() {
        return {
            cache: {} as any,
            map: this.#map,
            options: {zIndex: 200000},
            poly: false as string | false
        };
    }

    // Tools has #BRUSH private, but we need to access it.
    // In the original Tools class (in TS), it has getter/setters for BRUSH.
    // But here we are defining a private property BRUSH that conflicts or isn't compatible.
    // Let's use the setter/getter from base class or rename local property if it's meant to be internal state for this tool instance.
    // The base class Tools seems to hold the state of "current tool instance" in #BRUSH?
    // Let's assume we should use the base class accessor.

    // We remove `private BRUSH: any;` and use `this.BRUSH` accessor from Tools.

    private setOptions() {
        if(this.BRUSH && this.BRUSH.options) {
             this.BRUSH.options.strokeColor = this.#store.states.color;
             this.BRUSH.options.strokeWeight = this.#store.states.strokeWeight;
        }
    }

    private drawStroke(e: any) {
        if (!e || !this.BRUSH.poly) {
            this.BRUSH.poly = false;
            return;
        }
        let l = this.BRUSH.cache[this.BRUSH.poly],
            p = l.getPath();
        p.insertAt(p.getLength(), e.latLng);
        l.setPath(p);
    }

    private initDraw(e: any, google: any) {
        let options = this.BRUSH.options;
        options.map = this.BRUSH.map;
        options.clickable = false;

        this.setOptions();

        this.BRUSH.poly = 'p' + new Date().getTime();
        this.BRUSH.cache[this.BRUSH.poly] = new google.maps.Polyline(options);
        this.#drawn.push(this.BRUSH.cache[this.BRUSH.poly]);
        this.drawStroke(e);
    }

    private initEvents() {
        this.#google.maps.event.addListener(this.#map, 'mousemove', (e: any) => {
            this.drawStroke(e);
        });
        this.#google.maps.event.addListener(this.#map, 'mouseup', (_e: any) => {
            this.drawStroke(0);
        });
        this.#google.maps.event.addListener(this.#map, 'mouseout', (_e: any) => {
            this.drawStroke(0);
        });
        this.#google.maps.event.addListener(this.#map, 'mousedown', (e: any) => {
            this.initDraw(e, this.#google);
        });
    }

    startDraw = () => {
        if (!(this.#store.states.selected instanceof Brush))
            return;

        this.#map.setOptions({draggableCursor:'cell'});
        this.#isSelected = true;
        this.BRUSH = this.initTool();
        this.setOptions();
        this.initEvents();
    }

    stopDraw = () => {
        if (!this.#isSelected)
            return;

        this.#map.setOptions({draggableCursor:'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default'});
        this.#isSelected = false;

        this.#google.maps.event.clearListeners(this.#map, 'mousemove');
        this.#google.maps.event.clearListeners(this.#map, 'mouseup');
        this.#google.maps.event.clearListeners(this.#map, 'mouseout');
        this.#google.maps.event.clearListeners(this.#map, 'mousedown');
    }

    clearArt() {
        this.#drawn.map(obj => obj.setMap(null));
        this.#drawn.length = 0;
    }

    // Alias for compatibility
    clearDrawn() {
         this.clearArt();
    }

    getType() {
        return 'BRUSH'
    }
}
