import { describe, expect, it, vi } from 'vitest';
import DrawOnMap from '../src/draw-on-map';

describe('DrawOnMap Event Subscription API', () => {
  it('supports on/off and unsubscribe callbacks', () => {
    const map: any = new google.maps.Map(document.createElement('div'), {});
    const draw = new DrawOnMap(map);

    const handler = vi.fn();
    const unsubscribe = draw.on('toolChanged', handler);

    draw.brush.startDraw();
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();
    draw.polygon.startDraw();
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
