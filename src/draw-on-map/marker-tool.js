let Tools = require('./tools');
let store = require('./store');
let ColorfulMarkerIcon = require('./colorfulMarkerIcon');

class Marker extends Tools {
    #map;
    #google;
    #drawing;
    #isSelected = false;
    #drawn = [];

    constructor(map, google, drawing) {
        super(store);
        this.#map = map;
        this.#google = google;
        this.#drawing = drawing;
    }

    #initTool() {
        return {
            drawingControl: false,
            markerOptions: {
                editable: false,
                draggable: false,
                clickable: false,
                cursor: 'pointer',
                zIndex: 200000
            }
        };
    }

    #setOptions() {
        let icon = null;
        if(!store.states.markerIcon)
            icon = null;
        else if(store.states.markerIcon.toLowerCase() === 'default')
            icon = null;
        else if(store.states.markerIcon.toLowerCase() === "colorful")
            icon = new ColorfulMarkerIcon().icon();
        else
            icon = store.states.markerIcon.toLowerCase();

        this.MARKER.markerOptions.icon = icon;
    }

    #initDraw() {
        let that = this;
        this.#google.maps.event.addListener(this.MARKER, 'markercomplete', (marker) => {
            that.#drawn.push(marker);
        });
        this.MARKER.setDrawingMode(this.#drawing.OverlayType.MARKER);
    }

    startDraw() {
        if (!(store.states.selected instanceof Marker))
            return;

        this.#isSelected = true;
        this.MARKER = new this.#drawing.DrawingManager(this.#initTool());
        this.#initDraw();
        this.#setOptions();
        this.MARKER.setMap(this.#map);
    }

    stopDraw() {
        if (!this.#isSelected)
            return;

        this.#isSelected = false;
        this.#google.maps.event.clearListeners(this.MARKER, 'markercomplete');
        this.MARKER.setMap(null);
    }

    clearDrawn() {
        this.#drawn.map(obj => obj.setMap(null));
        this.#drawn.length = 0;
    }
}

module.exports = Marker;