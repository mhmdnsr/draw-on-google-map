import { describe, expect, it } from 'vitest';
import DrawOnMap from '../src/draw-on-map';

describe('DrawOnMap Instance Isolation and Cleanup', () => {
  it('keeps state isolated across instances', () => {
    const mapOne: any = new google.maps.Map(document.createElement('div'), {});
    const mapTwo: any = new google.maps.Map(document.createElement('div'), {});

    const drawOne = new DrawOnMap(mapOne);
    const drawTwo = new DrawOnMap(mapTwo);

    drawOne.changeColor('#ff0000');
    drawTwo.changeColor('#00ff00');

    drawOne.marker.startDraw();
    drawTwo.marker.startDraw();

    mapOne.trigger('click', { latLng: new google.maps.LatLng(1, 1) });
    mapTwo.trigger('click', { latLng: new google.maps.LatLng(2, 2) });

    const oneShapes = drawOne.exportData('json') as any[];
    const twoShapes = drawTwo.exportData('json') as any[];

    expect(oneShapes[0].style.strokeColor).toBe('#ff0000');
    expect(twoShapes[0].style.strokeColor).toBe('#00ff00');
  });

  it('destroy clears listeners and resets selection', () => {
    const map: any = new google.maps.Map(document.createElement('div'), {});
    const draw = new DrawOnMap(map);

    draw.marker.startDraw();
    expect(draw.getSelectedTool()).toBe('MARKER');
    expect(map.listenerCount('click')).toBeGreaterThan(0);

    draw.destroy();

    expect(draw.getSelectedTool()).toBeNull();
    expect(map.listenerCount('click')).toBe(0);
  });
});
