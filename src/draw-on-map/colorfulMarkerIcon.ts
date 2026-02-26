import { Store } from './store';

export class ColorfulMarkerIcon {
  private static iconCache: { [color: string]: string } = {};
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  icon(): string {
    const color = this.store.states.color;

    if (ColorfulMarkerIcon.iconCache[color]) {
      return ColorfulMarkerIcon.iconCache[color];
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return '';
    }

    const text = '.';
    const fontStyle = '600 120px Times New Roman';
    context.font = fontStyle;

    const metrics = context.measureText(text);
    const width = metrics.width;
    const height =
      metrics.actualBoundingBoxAscent !== undefined && metrics.actualBoundingBoxDescent !== undefined
        ? metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        : width;
    const ascent = metrics.actualBoundingBoxAscent !== undefined ? metrics.actualBoundingBoxAscent : height * 0.8;

    canvas.width = width + 8;
    canvas.height = height + 8;

    context.font = fontStyle;
    context.fillStyle = color;
    context.textBaseline = 'alphabetic';
    context.fillText(text, 4, 4 + ascent);

    const dataUrl = canvas.toDataURL();
    ColorfulMarkerIcon.iconCache[color] = dataUrl;

    return dataUrl;
  }
}
