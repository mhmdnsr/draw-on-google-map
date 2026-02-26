<template>
  <div>
    <h1>Vue Example</h1>
    <div class="controls">
      <button @click="drawInstance?.brush.startDraw()">Brush</button>
      <button @click="drawInstance?.polygon.startDraw()">Polygon</button>
      <button @click="drawInstance?.polyline.startDraw()">Polyline</button>
      <button @click="drawInstance?.circle.startDraw()">Circle</button>
      <button @click="drawInstance?.rectangle.startDraw()">Rectangle</button>
      <button @click="drawInstance?.marker.startDraw()">Marker</button>
      <button @click="drawInstance?.clearAllArt()">Clear</button>
    </div>
    <div ref="mapContainer" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import MapDraw from 'draw-on-google-maps';

// Ensure Google Maps API is loaded externally

const mapContainer = ref(null);
const drawInstance = ref(null);

onMounted(() => {
  if (window.google && mapContainer.value) {
    const map = new window.google.maps.Map(mapContainer.value, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
      mapId: "DEMO_MAP_ID"
    });

    drawInstance.value = new MapDraw(map);
  }
});
</script>

<style scoped>
.controls {
  margin-bottom: 10px;
}
button {
  margin-right: 5px;
}
</style>
