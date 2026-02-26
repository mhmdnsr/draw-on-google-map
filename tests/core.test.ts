import { beforeEach, describe, expect, it } from 'vitest';
import DrawOnMap from '../src/draw-on-map';

describe('DrawOnMap Core', () => {
  let map: any;
  let drawOnMap: DrawOnMap;

  beforeEach(() => {
    map = new google.maps.Map(document.createElement('div'), {});
    drawOnMap = new DrawOnMap(map);
  });

  it('initializes all tool APIs', () => {
    expect(drawOnMap.brush).toBeDefined();
    expect(drawOnMap.polygon).toBeDefined();
    expect(drawOnMap.polyline).toBeDefined();
    expect(drawOnMap.circle).toBeDefined();
    expect(drawOnMap.rectangle).toBeDefined();
    expect(drawOnMap.marker).toBeDefined();
  });

  it('throws when map is missing', () => {
    expect(() => new DrawOnMap(null as any)).toThrowError('You should pass the map instance.');
  });

  it('switches selected tool and clears selection on stop', () => {
    drawOnMap.brush.startDraw();
    expect(drawOnMap.getSelectedTool()).toBe('BRUSH');

    drawOnMap.polygon.startDraw();
    expect(drawOnMap.getSelectedTool()).toBe('POLYGON');

    drawOnMap.polygon.stopDraw();
    expect(drawOnMap.getSelectedTool()).toBeNull();
  });

  it('accepts numeric zero for stroke weight and polygon opacity', () => {
    drawOnMap.changeColor('#123456');
    drawOnMap.changeStrokeWeight(0);
    drawOnMap.changePolygonOpacity(0);

    drawOnMap.rectangle.startDraw();
    map.trigger('mousedown', { latLng: new google.maps.LatLng(1, 1) });
    map.trigger('mousemove', { latLng: new google.maps.LatLng(2, 3) });
    map.trigger('mouseup', {});

    const shapes = drawOnMap.exportData('json') as any[];
    const rectangle = shapes.find((shape) => shape.type === 'RECTANGLE');

    expect(rectangle).toBeDefined();
    expect(rectangle.style.strokeWeight).toBe(0);
    expect(rectangle.style.fillOpacity).toBe(0);
  });
});
