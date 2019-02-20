let PubSub = require('./pub-sub');

class Store {
    constructor(params) {
        let self = this;

        this.actions = {};
        this.mutations = {};
        this.states = {};
        this.status = 'resting';
        this.events = new PubSub();

        if (params.hasOwnProperty('actions')) {
            this.actions = params.actions;
        }

        if (params.hasOwnProperty('mutations')) {
            this.mutations = params.mutations;
        }
        this.states = new Proxy(params.state, {
            set: function(state, key, value) {
                state[key] = value;
                self.events.publish('stateChange', self.states);
                self.status = 'resting';
                return true;
            }
        });
    }

    dispatch(actionKey, payload) {
        if(typeof this.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey} doesn't exist.`);
            return false;
        }
        this.status = 'action';
        this.actions[actionKey](this, payload);
        return true;
    }

    commit(mutationKey, payload) {
        if(typeof this.mutations[mutationKey] !== 'function') {
            console.error(`Mutation "${mutationKey}" doesn't exist`);
            return false;
        }
        this.status = 'mutation';
        let newState = this.mutations[mutationKey](this.states, payload);
        this.states = Object.assign(this.states, newState);
        return true;
    }
}

module.exports = Store;