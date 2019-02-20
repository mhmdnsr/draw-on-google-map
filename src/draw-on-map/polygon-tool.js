let Tools = require('./tools');
let store = require('./store');

class Polygon extends Tools {
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
            polygonOptions: {
                editable: false,
                draggable: false,
                clickable: false,
                zIndex: 200000
            }
        }
    }

    #setOptions(){
        this.POLYGON.polygonOptions.strokeColor = store.states.color;
        this.POLYGON.polygonOptions.strokeWeight = store.states.strokeWeight;
        this.POLYGON.polygonOptions.fillColor = store.states.polygonFillColor;
        this.POLYGON.polygonOptions.fillOpacity = store.states.polygonOpacity;
    }

    #initDraw(){
        let that = this;
        this.#google.maps.event.addListener(this.POLYGON, 'polygoncomplete', (polygon) => {
            that.#drawn.push(polygon);
        });
        this.POLYGON.setDrawingMode(this.#drawing.OverlayType.POLYGON);
    }

    startDraw() {
        if(!(store.states.selected instanceof Polygon))
            return;

        this.#isSelected = true;
        this.POLYGON = new this.#drawing.DrawingManager(this.#initTool());
        this.#initDraw();
        this.#setOptions();
        this.POLYGON.setMap(this.#map);
    }

    stopDraw(){
        if(!this.#isSelected)
            return;

        this.#isSelected = false;
        this.#google.maps.event.clearListeners(this.POLYGON, 'polygoncomplete');
        this.POLYGON.setMap(null);
    }

    clearDrawn() {
        this.#drawn.map(obj => obj.setMap(null));
        this.#drawn.length = 0;
    }
}

module.exports = Polygon;