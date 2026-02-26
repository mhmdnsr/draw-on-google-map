import React, { useEffect, useRef, useState } from 'react';
import MapDraw from 'draw-on-google-map';

// Ensure you have loaded Google Maps API in your index.html or using a loader
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=marker,geometry"></script>

function App() {
  const mapRef = useRef(null);
  const [drawInstance, setDrawInstance] = useState(null);

  useEffect(() => {
    if (window.google && mapRef.current && !drawInstance) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapId: "DEMO_MAP_ID"
      });

      const draw = new MapDraw(map);
      setDrawInstance(draw);
    }
  }, []);

  if (!drawInstance) return <div>Loading Map...</div>;

  return (
    <div>
      <h1>React Example</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => drawInstance.brush.startDraw()}>Brush</button>
        <button onClick={() => drawInstance.polygon.startDraw()}>Polygon</button>
        <button onClick={() => drawInstance.polyline.startDraw()}>Polyline</button>
        <button onClick={() => drawInstance.circle.startDraw()}>Circle</button>
        <button onClick={() => drawInstance.rectangle.startDraw()}>Rectangle</button>
        <button onClick={() => drawInstance.marker.startDraw()}>Marker</button>
        <button onClick={() => drawInstance.clearAllArt()}>Clear</button>
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
}

export default App;
