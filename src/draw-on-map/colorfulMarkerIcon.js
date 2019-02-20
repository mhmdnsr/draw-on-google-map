let store = require('./store');

class ColorfulMarkerIcon {

    icon() {
        let canvas = document.createElement('canvas');
        canvas.style.display = "none";
        let tCtx = canvas.getContext('2d');
        tCtx.font = '600 120px Times New Roman';
        let size = tCtx.measureText('.');
        let fontMeasurement = this.#fontHeightCalculation(canvas, tCtx.font, '.');
        canvas.height = fontMeasurement.height + 8;
        canvas.width = size.width + 8;
        tCtx.font = '600 120px Times New Roman';
        tCtx.fillStyle = store.states.color;
        tCtx.fillText('.', 0, fontMeasurement.height + 4.5);
        return tCtx.canvas.toDataURL();
    }

    #fontHeightCalculation(canvas, fontStyle, text) {
        let context = canvas.getContext("2d");
        let sourceWidth = canvas.width;
        let sourceHeight = canvas.height;

        context.font = fontStyle;
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText(text, 25, 5);

        let data = context.getImageData(0, 0, sourceWidth, sourceHeight).data;
        let firstY = this.#firstHeightCalculation(sourceWidth, sourceHeight, data);
        let lastY = this.#lastHeightCalculation(sourceWidth, sourceHeight, data);

        return {height: lastY - firstY}
    }

    #firstHeightCalculation(sourceWidth, sourceHeight, data) {
        let firstY = -1;
        for (let y = 0; y < sourceHeight; y++) {
            for (let x = 0; x < sourceWidth; x++) {
                let alpha = data[((sourceWidth * y) + x) * 4 + 3];
                if (alpha > 0) {
                    firstY = y;
                    break;
                }
            }
            if (firstY >= 0)
                break;
        }
        return firstY;
    }

    #lastHeightCalculation(sourceWidth, sourceHeight, data) {
        let lastY = -1;
        for (let y = sourceHeight; y > 0; y--) {
            for (let x = 0; x < sourceWidth; x++) {
                let alpha = data[((sourceWidth * y) + x) * 4 + 3];
                if (alpha > 0) {
                    lastY = y;
                    break;
                }
            }
            if (lastY >= 0)
                break;
        }
        return lastY;
    }
}

module.exports = ColorfulMarkerIcon;