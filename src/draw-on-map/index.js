let Brush = require('./brush-tool');
let Polygon = require('./polygon-tool');
let Marker = require('./marker-tool');
let store = require('./store');

class DrawOnMap {
    #map;
    #google;
    #drawing;
    #brush;
    #polygon;
    #marker;

    constructor(map) {
        this.#google = window.google;
        this.#drawing = window.google.maps.drawing;
        this.#map = map;
    }

    startBrushDraw() {
        if (!this.#brush)
            this.#brush = new Brush(this.#map, this.#google);
        if (store.states.selected !== this.#brush)
            store.dispatch('changeSelected', this.#brush);
    }

    stopBrushDraw() {
        if (!this.#brush)
            throw "Brush Didn't initialized yet! please start Brush drawing before stopping it!";
        this.#brush.stopDraw();
        if (store.states.selected === this.#brush)
            store.dispatch('changeSelected', null);
    }

    clearBrushArt() {
        if (this.#brush)
            this.#brush.clearDrawn();
    }

    startPolygonDraw() {
        if (!this.#polygon)
            this.#polygon = new Polygon(this.#map, this.#google, this.#drawing);
        if (store.states.selected !== this.#polygon)
            store.dispatch('changeSelected', this.#polygon);
    }

    stopPolygonDraw() {
        if (!this.#polygon)
            throw "Polygon Didn't initialized yet! please start Polygon drawing before stopping it!";
        this.#polygon.stopDraw();
        if (store.states.selected === this.#polygon)
            store.dispatch('changeSelected', null);
    }

    clearPolygonArt() {
        if (this.#polygon)
            this.#polygon.clearDrawn();
    }

    startMarkerDraw() {
        if (!this.#marker)
            this.#marker = new Marker(this.#map, this.#google, this.#drawing);
        if (store.states.selected !== this.#marker)
            store.dispatch('changeSelected', this.#marker);
    }

    stopMarkerDraw() {
        if (!this.#marker)
            throw "Marker Didn't initialized yet! please start Marker drawing before stopping it!";
        this.#marker.stopDraw();
        if (store.states.selected === this.#marker)
            store.dispatch('changeSelected', null);
    }

    clearMarkerArt() {
        if (this.#marker)
            this.#marker.clearDrawn();
    }

    clearAllArt() {
        this.clearBrushArt();
        this.clearPolygonArt();
        this.clearMarkerArt();
    }

    changeColor(color) {
        if (color && typeof color === "string")
            store.dispatch('changeColor', color);
    }

    changeStrokeWeight(weight) {
        if (weight && typeof weight === "number")
            store.dispatch('changeStrokeWeight', weight);
    }

    changePolygonFillColor(color) {
        if (color && typeof color === "string")
            store.dispatch('changePolygonFillColor', color)
    }

    changePolygonOpacity(opacity) {
        if (opacity && typeof opacity === "number")
            store.dispatch('changePolygonOpacity', opacity)
    }

    changeMarkerIcon(icon) {
        store.dispatch('changeMarkerIcon', icon);
    }

    getSelectedTool() {
        return store.states.selected.getType();
    }

    getSelectedColor() {
        return store.states.color;
    }
}

module.exports = DrawOnMap;