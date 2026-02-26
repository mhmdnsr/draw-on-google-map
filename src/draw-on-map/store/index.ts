import { Store } from './store';

export const States = {
    selected: null as any,
    color: "#fff",
    strokeWeight: 6,
    polygonFillColor: "#fff",
    polygonOpacity: 1,
    markerIcon: null as string | null
};

const Actions = {
    changeSelected(context: Store, payload: any) {
        context.commit('changeSelected', payload);
    },
    changeColor(context: Store, payload: string) {
        context.commit('changeColor', payload);
    },
    changeStrokeWeight(context: Store, payload: number) {
        context.commit('changeStrokeWeight', payload);
    },
    changePolygonFillColor(context: Store, payload: string) {
        context.commit('changePolygonFillColor', payload);
    },
    changePolygonOpacity(context: Store, payload: number) {
        context.commit('changePolygonOpacity', payload);
    },
    changeMarkerIcon(context: Store, payload: string) {
        context.commit('changeMarkerIcon', payload);
    },
};

const Mutations = {
    changeSelected(state: typeof States, payload: any) {
        state.selected = payload;
        return state;
    },
    changeColor(state: typeof States, payload: string) {
        state.color = payload;
        return state;
    },
    changeStrokeWeight(state: typeof States, payload: number) {
        state.strokeWeight = payload;
        return state;
    },
    changePolygonFillColor(state: typeof States, payload: string) {
        state.polygonFillColor = payload;
        return state;
    },
    changePolygonOpacity(state: typeof States, payload: number) {
        if(payload > 1)
            payload = 1;
        else if(payload < 0)
            payload = 0;
        state.polygonOpacity = payload;
        return state;
    },
    changeMarkerIcon(state: typeof States, payload: string) {
        state.markerIcon = payload;
        return state;
    },
};

export default function createStore() {
    const isolatedStates = JSON.parse(JSON.stringify(States));
    return new Store({
        state: isolatedStates,
        actions: Actions,
        mutations: Mutations
    });
}

// Re-export Store type for consumers
export { Store } from './store';
