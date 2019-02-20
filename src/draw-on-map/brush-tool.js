let Tools = require('./tools');
let store = require('./store');

class Brush extends Tools {
    #map;
    #google;
    #isSelected = false;
    #drawn = [];

    constructor(map, google) {
        super(store);
        this.#map = map;
        this.#google = google;
    }

    #initTool() {
        return {
            cache: {},
            map: this.#map,
            options: {zIndex: 200000},
            poly: false
        };
    }

    #setOptions() {
        this.BRUSH.options.strokeColor = store.states.color;
        this.BRUSH.options.strokeWeight = store.states.strokeWeight;
    }

    #drawStroke(e) {
        if (!e || !this.BRUSH.poly) {
            this.BRUSH.poly = false;
            return;
        }
        let l = this.BRUSH.cache[this.BRUSH.poly],
            p = l.getPath();
        p.insertAt(p.getLength(), e.latLng);
        l.setPath(p);
    }

    #initDraw(e, google) {
        let options = this.BRUSH.options;
        options.map = this.BRUSH.map;
        options.clickable = false;
        this.BRUSH.poly = 'p' + new Date().getTime();
        this.BRUSH.cache[this.BRUSH.poly] = new google.maps.Polyline(options);
        this.#drawn.push(this.BRUSH.cache[this.BRUSH.poly]);
        this.#drawStroke(e);
    }

    #initEvents(){
        let that = this;
        this.#google.maps.event.addListener(that.#map, 'mousemove', e => {
            that.#drawStroke(e);
        });
        this.#google.maps.event.addListener(that.#map, 'mouseup', e => {
            that.#drawStroke(0);
        });
        this.#google.maps.event.addListener(that.#map, 'mouseout', e => {
            that.#drawStroke(0);
        });
        this.#google.maps.event.addListener(that.#map, 'mousedown', e => {
            that.#initDraw(e, that.#google);
        });
    }

    startDraw() {
        if(!(store.states.selected instanceof Brush))
            return;

        this.#isSelected = true;
        this.BRUSH = this.#initTool();
        this.#setOptions();
        this.#initEvents();
    }

    stopDraw() {
        if(!this.#isSelected)
            return;

        this.#isSelected = false;
        this.#google.maps.event.clearListeners(this.#map, 'mousemove');
        this.#google.maps.event.clearListeners(this.#map, 'mouseup');
        this.#google.maps.event.clearListeners(this.#map, 'mouseout');
        this.#google.maps.event.clearListeners(this.#map, 'mousedown');
    }

    clearDrawn() {
        this.#drawn.map(obj => obj.setMap(null));
        this.#drawn.length = 0;
    }
}

module.exports = Brush;