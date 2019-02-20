let Store = require('./store/store');

class Tools{
    #BRUSH;
    #POLYGON;
    #MARKER;
    #NONE = null;

    constructor(store) {
        let self = this;
        this.startDraw = this.startDraw || function() {};
        this.stopDraw = this.stopDraw || function() {};
        if(store instanceof Store) {
            store.events.subscribe('stateChange', () => {
                self.stopDraw();
                self.startDraw();
            });
        }
    }

    set BRUSH(brush){
        this.#BRUSH = brush;
    }

    get BRUSH(){
        return this.#BRUSH;
    }

    set POLYGON(polygon){
        this.#POLYGON = polygon;
    }

    get POLYGON(){
        return this.#POLYGON;
    }

    set MARKER(marker){
        this.#MARKER = marker;
    }

    get MARKER(){
        return this.#MARKER;
    }

    get NONE(){
        return this.#NONE;
    }
}

module.exports = Tools;