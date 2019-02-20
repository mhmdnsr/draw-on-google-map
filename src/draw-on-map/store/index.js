let Store = require('./store');

const States = {
    selected: null,
    color: "#fff",
    strokeWeight: 6,
    polygonFillColor: "#fff",
    polygonOpacity: 1,
    markerIcon: null
};

const Actions = {
    changeSelected(context, payload) {
        context.commit('changeSelected', payload);
    },
    changeColor(context, payload) {
        context.commit('changeColor', payload);
    },
    changeStrokeWeight(context, payload) {
        context.commit('changeStrokeWeight', payload);
    },
    changePolygonFillColor(context, payload) {
        context.commit('changePolygonFillColor', payload);
    },
    changePolygonOpacity(context, payload) {
        context.commit('changePolygonOpacity', payload);
    },
    changeMarkerIcon(context, payload) {
        context.commit('changeMarkerIcon', payload);
    },
};

const Mutations = {
    changeSelected(state, payload) {
        state.selected = payload;
        return state;
    },
    changeColor(state, payload) {
        state.color = payload;
        return state;
    },
    changeStrokeWeight(state, payload) {
        state.strokeWeight = payload;
        return state;
    },
    changePolygonFillColor(state, payload) {
        state.polygonFillColor = payload;
        return state;
    },
    changePolygonOpacity(state, payload) {
        if(payload > 1)
            payload = 1;
        else if(payload < 0)
            payload = 0;
        state.polygonOpacity = payload;
        return state;
    },
    changeMarkerIcon(state, payload) {
        state.markerIcon = payload;
        return state;
    },
};

let store = new Store({
    state: States,
    actions: Actions,
    mutations: Mutations
});

module.exports = store;