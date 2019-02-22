let DrawOnMap = require("./draw-on-map");

class MapDraw {
    #map;
    #draw;

    constructor(map) {
        if (!map)
            throw("You should pass the map instance.");
        this.#map = map;
        this.#draw = new DrawOnMap(map);
    }

    holdMap = () => {
        this.#map.setOptions({draggable: false});
    };

    releaseMap = () => {
        this.#map.setOptions({draggable: true});
    };

    clearAllArt() {
        this.#draw.clearAllArt();
    }

    changeColor(color){
        this.#draw.changeColor(color);
    }

    changeStrokeWeight(weight){
        this.#draw.changeStrokeWeight(weight);
    }

    getSelectedTool(){
        return this.#draw.getSelectedTool();
    }

    getSelectedColor(){
        return this.#draw.getSelectedColor();
    }

    brush = {
        startDraw: () => {
            this.#draw.startBrushDraw();
        },
        stopDraw: () => {
            this.#draw.stopBrushDraw();
        },
        clearArt: () => {
            this.#draw.clearBrushArt();
        }
    };

    polygon = {
        startDraw: () => {
            this.#draw.startPolygonDraw();
        },
        stopDraw: () => {
            this.#draw.stopPolygonDraw();
        },
        clearArt: () => {
            this.#draw.clearPolygonArt();
        },
        changeOpacity: opacity => {
            this.#draw.changePolygonOpacity(opacity);
        },
        changeFillColor: color => {
            this.#draw.changePolygonFillColor(color);
        }
    };

    marker = {
        startDraw: () => {
            this.#draw.startMarkerDraw();
        },
        stopDraw: () => {
            this.#draw.stopMarkerDraw();
        },
        clearArt: () => {
            this.#draw.clearMarkerArt();
        },
        changeIcon: icon => {
            this.#draw.changeMarkerIcon(icon);
        }
    };
}

module.exports = MapDraw;