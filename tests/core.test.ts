import { describe, it, expect, vi, beforeEach } from 'vitest';
import DrawOnMap from '../src/draw-on-map/index';

describe('DrawOnMap Core', () => {
    let map;
    let drawOnMap;

    beforeEach(() => {
        // Create a mock map
        map = new google.maps.Map(document.createElement('div'), {});
        drawOnMap = new DrawOnMap(map);
    });

    it('should initialize correctly', () => {
        expect(drawOnMap).toBeDefined();
        expect(drawOnMap.brush).toBeDefined();
        expect(drawOnMap.polygon).toBeDefined();
        expect(drawOnMap.polyline).toBeDefined();
        expect(drawOnMap.circle).toBeDefined();
        expect(drawOnMap.rectangle).toBeDefined();
        expect(drawOnMap.marker).toBeDefined();
    });

    it('should throw error if map is not provided', () => {
        expect(() => new DrawOnMap(null as any)).toThrowError("You should pass the map instance.");
    });

    it('should start brush drawing', () => {
        drawOnMap.brush.startDraw();
        expect(drawOnMap.getSelectedTool()).toBe('BRUSH');
    });

    it('should start polygon drawing', () => {
        drawOnMap.polygon.startDraw();
        expect(drawOnMap.getSelectedTool()).toBe('POLYGON');
    });

    it('should change color', () => {
        const newColor = '#ff0000';
        drawOnMap.changeColor(newColor);
        expect(drawOnMap.getSelectedColor()).toBe(newColor);
    });

    it('should change stroke weight', () => {
        // Just verify it doesn't throw and potentially updates internal state (indirectly tested)
        drawOnMap.changeStrokeWeight(10);
    });
});
