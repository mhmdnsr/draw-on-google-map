import { Store } from './store/store';

export class ColorfulMarkerIcon {
    #store: Store;
    // Cache for generated icons: color -> dataURL
    static #iconCache: { [color: string]: string } = {};

    constructor(store: Store) {
        this.#store = store;
    }

    icon() {
        const color = this.#store.states.color;

        // Return cached icon if available
        if (ColorfulMarkerIcon.#iconCache[color]) {
            return ColorfulMarkerIcon.#iconCache[color];
        }

        let canvas = document.createElement('canvas');
        let tCtx = canvas.getContext('2d');
        if (!tCtx) return '';

        const text = '.';
        const fontStyle = '600 120px Times New Roman';
        tCtx.font = fontStyle;

        const metrics = tCtx.measureText(text);

        let height = 0;
        let width = metrics.width;
        let ascent = 0;

        if (metrics.actualBoundingBoxAscent !== undefined && metrics.actualBoundingBoxDescent !== undefined) {
             ascent = metrics.actualBoundingBoxAscent;
             height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        } else {
             // Fallback
             height = width;
             ascent = height * 0.8;
        }

        // Add padding
        canvas.height = height + 8;
        canvas.width = width + 8;

        // Reset context properties after resize (canvas resize clears context state)
        // Need to set font again
        tCtx.font = fontStyle;
        tCtx.fillStyle = color;

        // Draw
        tCtx.textBaseline = 'alphabetic';
        // Position: x=4 (padding), y = 4 (padding) + ascent
        tCtx.fillText(text, 4, 4 + ascent);

        const dataURL = canvas.toDataURL();

        // Cache it
        ColorfulMarkerIcon.#iconCache[color] = dataURL;

        return dataURL;
    }
}
