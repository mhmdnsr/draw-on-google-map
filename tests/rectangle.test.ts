import { describe, expect, it } from 'vitest';
import DrawOnMap from '../src/draw-on-map';

describe('DrawOnMap Marker Lifecycle', () => {
  it('creates and clears marker shapes safely', () => {
    const map: any = new google.maps.Map(document.createElement('div'), {});
    const draw = new DrawOnMap(map);

    draw.marker.startDraw();
    map.trigger('click', { latLng: new google.maps.LatLng(3, 4) });
    map.trigger('click', { latLng: new google.maps.LatLng(5, 6) });

    expect((draw.exportData('json') as any[]).length).toBe(2);

    draw.marker.clearArt();
    expect((draw.exportData('json') as any[]).length).toBe(0);
  });
});
