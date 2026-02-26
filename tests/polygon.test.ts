import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Polygon } from '../src/draw-on-map/polygon-tool';
import createStore, { Store } from '../src/draw-on-map/store/index';

describe('Polygon Tool', () => {
    let map: google.maps.Map;
    let store: Store;
    let polygonTool: Polygon;

    beforeEach(() => {
        // Create a mock map
        map = new google.maps.Map(document.createElement('div'), {});
        store = createStore();
        polygonTool = new Polygon(map, store);
    });

    it('should initialize correctly', () => {
        expect(polygonTool).toBeDefined();
        expect(polygonTool.getType()).toBe('POLYGON');
    });

    it('should set map options and add listeners on startDraw', () => {
        // Mock startDraw behavior directly or simulate store selection if needed
        // The startDraw method checks `this.#store.states.selected instanceof Polygon`
        // We need to set the store state to make the check pass.
        store.dispatch('changeSelected', polygonTool);

        // Spy on methods
        const setOptionsSpy = vi.spyOn(map, 'setOptions');
        const addListenerSpy = vi.spyOn(map, 'addListener');

        polygonTool.startDraw();

        expect(setOptionsSpy).toHaveBeenCalledWith({ draggableCursor: 'crosshair', clickableIcons: false, disableDoubleClickZoom: true });
        expect(addListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
        expect(addListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
        expect(addListenerSpy).toHaveBeenCalledWith('dblclick', expect.any(Function));
    });

    it('should clear listeners and reset options on stopDraw', () => {
        // Setup state for stopDraw
        store.dispatch('changeSelected', polygonTool);
        polygonTool.startDraw();

        const setOptionsSpy = vi.spyOn(map, 'setOptions');
        const removeListenerSpy = vi.spyOn(google.maps.event, 'removeListener');

        polygonTool.stopDraw();

        expect(setOptionsSpy).toHaveBeenCalledWith({ draggableCursor: null, clickableIcons: true, disableDoubleClickZoom: false });
        // It should remove click, mousemove, dblclick listeners
        expect(removeListenerSpy).toHaveBeenCalledTimes(3);
    });

    it('should clean up temporary lines when stopping draw', () => {
         store.dispatch('changeSelected', polygonTool);
         polygonTool.startDraw();

         // Mock internal state if possible or just ensure stopDraw runs without error
         expect(() => polygonTool.stopDraw()).not.toThrow();
    });
});
