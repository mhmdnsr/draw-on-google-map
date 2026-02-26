import { Store } from './store/store';

export class Tools {
    #BRUSH: any;
    #POLYGON: any;
    #MARKER: any;
    #POLYLINE: any;
    #CIRCLE: any;
    #RECTANGLE: any;
    #NONE: any = null;

    startDraw: Function = function() {};
    stopDraw: Function = function() {};

    constructor(store: Store) {
        let self = this;
        if(store instanceof Store) {
            store.events.subscribe('stateChange', () => {
                self.stopDraw();
                self.startDraw();
            });
        }
    }

    set BRUSH(brush: any){
        this.#BRUSH = brush;
    }

    get BRUSH(){
        return this.#BRUSH;
    }

    set POLYGON(polygon: any){
        this.#POLYGON = polygon;
    }

    get POLYGON(){
        return this.#POLYGON;
    }

    set POLYLINE(polyline: any){
        this.#POLYLINE = polyline;
    }

    get POLYLINE(){
        return this.#POLYLINE;
    }

    set CIRCLE(circle: any){
        this.#CIRCLE = circle;
    }

    get CIRCLE(){
        return this.#CIRCLE;
    }

    set RECTANGLE(rectangle: any){
        this.#RECTANGLE = rectangle;
    }

    get RECTANGLE(){
        return this.#RECTANGLE;
    }

    set MARKER(marker: any){
        this.#MARKER = marker;
    }

    get MARKER(){
        return this.#MARKER;
    }

    get NONE(){
        return this.#NONE;
    }
}
