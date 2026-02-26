import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import DrawOnMap from 'draw-on-google-map';

setOptions({
  key: 'YOUR_API_KEY',
  v: 'weekly',
});

async function init(): Promise<void> {
  const { Map } = await importLibrary('maps');
  await importLibrary('geometry');
  await importLibrary('marker');

  const map = new Map(document.getElementById('map') as HTMLElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    mapId: 'DEMO_MAP_ID',
  });

  const draw = new DrawOnMap(map);
  draw.brush.startDraw();
}

void init();
