import { Brush } from './brush-tool.ts';
import { Polygon } from './polygon-tool.ts';
import { Polyline } from './polyline-tool.ts';
import { Circle } from './circle-tool.ts';
import { Rectangle } from './rectangle-tool.ts';
import { Marker } from './marker-tool.ts';
import createStore, { Store } from './store/index.ts';
// import { loadGoogleMapsLibrary } from '../utils/google-maps-loader';

export default class DrawOnMap {
    #map: google.maps.Map;
    #google: typeof google;
    #brush: Brush | null = null;
    #polygon: Polygon | null = null;
    #polyline: Polyline | null = null;
    #circle: Circle | null = null;
    #rectangle: Rectangle | null = null;
    #marker: Marker | null = null;
    #store: Store;

    // Public properties
    brush: any = null;
    polygon: any = null;
    polyline: any = null;
    circle: any = null;
    rectangle: any = null;
    marker: any = null;

    constructor(map: google.maps.Map) {
        console.log("DrawOnMap constructor running");
        if (!map)
            throw new Error("You should pass the map instance.");

        if (!window.google || !window.google.maps) {
            throw new Error("Google Maps JavaScript API is not loaded.");
        }

        this.#google = window.google;
        this.#map = map;
        this.#store = createStore();

        // Bind methods
        this.brush = {
            startDraw: () => { this.startBrushDraw(); },
            stopDraw: () => { this.stopBrushDraw(); },
            clearArt: () => { this.clearBrushArt(); }
        };
        console.log("Assigned brush:", this.brush);

        this.polygon = {
            startDraw: () => { this.startPolygonDraw(); },
            stopDraw: () => { this.stopPolygonDraw(); },
            clearArt: () => { this.clearPolygonArt(); },
            changeOpacity: (opacity: number) => { this.changePolygonOpacity(opacity); },
            changeFillColor: (color: string) => { this.changePolygonFillColor(color); }
        };

        this.polyline = {
            startDraw: () => { this.startPolylineDraw(); },
            stopDraw: () => { this.stopPolylineDraw(); },
            clearArt: () => { this.clearPolylineArt(); }
        };

        this.circle = {
            startDraw: () => { this.startCircleDraw(); },
            stopDraw: () => { this.stopCircleDraw(); },
            clearArt: () => { this.clearCircleArt(); }
        };

        this.rectangle = {
            startDraw: () => { this.startRectangleDraw(); },
            stopDraw: () => { this.stopRectangleDraw(); },
            clearArt: () => { this.clearRectangleArt(); }
        };

        this.marker = {
            startDraw: () => { this.startMarkerDraw(); },
            stopDraw: () => { this.stopMarkerDraw(); },
            clearArt: () => { this.clearMarkerArt(); },
            changeIcon: (icon: string) => { this.changeMarkerIcon(icon); }
        };

        console.log("Assigned circle:", this.circle);
    }

    holdMap = () => {
        this.#map.setOptions({draggable: false});
    };

    releaseMap = () => {
        this.#map.setOptions({draggable: true});
    };

    startBrushDraw() {
        if (!this.#brush)
            this.#brush = new Brush(this.#map, this.#google, this.#store);
        if (this.#store.states.selected !== this.#brush)
            this.#store.dispatch('changeSelected', this.#brush);
    }

    stopBrushDraw() {
        if (!this.#brush)
            throw "Brush Didn't initialized yet! please start Brush drawing before stopping it!";
        this.#brush.stopDraw();
        if (this.#store.states.selected === this.#brush)
            this.#store.dispatch('changeSelected', null);
    }

    clearBrushArt() {
        if (this.#brush)
            this.#brush.clearDrawn();
    }

    startPolygonDraw() {
        if (!this.#polygon)
            this.#polygon = new Polygon(this.#map, this.#store);
        if (this.#store.states.selected !== this.#polygon)
            this.#store.dispatch('changeSelected', this.#polygon);
    }

    stopPolygonDraw() {
        if (!this.#polygon)
            throw "Polygon Didn't initialized yet! please start Polygon drawing before stopping it!";
        this.#polygon.stopDraw();
        if (this.#store.states.selected === this.#polygon)
            this.#store.dispatch('changeSelected', null);
    }

    clearPolygonArt() {
        if (this.#polygon)
            this.#polygon.clearDrawn();
    }

    startPolylineDraw() {
        if (!this.#polyline)
            this.#polyline = new Polyline(this.#map, this.#store);
        if (this.#store.states.selected !== this.#polyline)
            this.#store.dispatch('changeSelected', this.#polyline);
    }

    stopPolylineDraw() {
        if (!this.#polyline)
            throw "Polyline Didn't initialized yet! please start Polyline drawing before stopping it!";
        this.#polyline.stopDraw();
        if (this.#store.states.selected === this.#polyline)
            this.#store.dispatch('changeSelected', null);
    }

    clearPolylineArt() {
        if (this.#polyline)
            this.#polyline.clearDrawn();
    }

    startCircleDraw() {
        if (!this.#circle)
            this.#circle = new Circle(this.#map, this.#store);
        if (this.#store.states.selected !== this.#circle)
            this.#store.dispatch('changeSelected', this.#circle);
    }

    stopCircleDraw() {
        if (!this.#circle)
            throw "Circle Didn't initialized yet! please start Circle drawing before stopping it!";
        this.#circle.stopDraw();
        if (this.#store.states.selected === this.#circle)
            this.#store.dispatch('changeSelected', null);
    }

    clearCircleArt() {
        if (this.#circle)
            this.#circle.clearDrawn();
    }

    startRectangleDraw() {
        if (!this.#rectangle)
            this.#rectangle = new Rectangle(this.#map, this.#store);
        if (this.#store.states.selected !== this.#rectangle)
            this.#store.dispatch('changeSelected', this.#rectangle);
    }

    stopRectangleDraw() {
        if (!this.#rectangle)
            throw "Rectangle Didn't initialized yet! please start Rectangle drawing before stopping it!";
        this.#rectangle.stopDraw();
        if (this.#store.states.selected === this.#rectangle)
            this.#store.dispatch('changeSelected', null);
    }

    clearRectangleArt() {
        if (this.#rectangle)
            this.#rectangle.clearDrawn();
    }

    startMarkerDraw() {
        if (!this.#marker)
            this.#marker = new Marker(this.#map, this.#store);
        if (this.#store.states.selected !== this.#marker)
            this.#store.dispatch('changeSelected', this.#marker);
    }

    stopMarkerDraw() {
        if (!this.#marker)
            throw "Marker Didn't initialized yet! please start Marker drawing before stopping it!";
        this.#marker.stopDraw();
        if (this.#store.states.selected === this.#marker)
            this.#store.dispatch('changeSelected', null);
    }

    clearMarkerArt() {
        if (this.#marker)
            this.#marker.clearDrawn();
    }

    clearAllArt() {
        this.clearBrushArt();
        this.clearPolygonArt();
        this.clearMarkerArt();
        if (this.#polyline) this.clearPolylineArt();
        if (this.#circle) this.clearCircleArt();
        if (this.#rectangle) this.clearRectangleArt();
    }

    changeColor(color: string) {
        if (color && typeof color === "string")
            this.#store.dispatch('changeColor', color);
    }

    changeStrokeWeight(weight: number) {
        if (weight && typeof weight === "number")
            this.#store.dispatch('changeStrokeWeight', weight);
    }

    changePolygonFillColor(color: string) {
        if (color && typeof color === "string")
            this.#store.dispatch('changePolygonFillColor', color)
    }

    changePolygonOpacity(opacity: number) {
        if (opacity && typeof opacity === "number")
            this.#store.dispatch('changePolygonOpacity', opacity)
    }

    changeMarkerIcon(icon: string) {
        this.#store.dispatch('changeMarkerIcon', icon);
    }

    getSelectedTool() {
        return this.#store.states.selected.getType();
    }

    getSelectedColor() {
        return this.#store.states.color;
    }
}
