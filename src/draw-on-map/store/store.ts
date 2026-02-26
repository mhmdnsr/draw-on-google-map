import { PubSub } from './pub-sub';

export interface State {
    [key: string]: any;
}

export interface StoreParams {
    state: State;
    actions?: { [key: string]: Function };
    mutations?: { [key: string]: Function };
}

export class Store {
    actions: { [key: string]: Function };
    mutations: { [key: string]: Function };
    states: State;
    status: string;
    events: PubSub;

    constructor(params: StoreParams) {
        let self = this;

        this.actions = {};
        this.mutations = {};
        this.states = {};
        this.status = 'resting';
        this.events = new PubSub();

        if (params.hasOwnProperty('actions') && params.actions) {
            this.actions = params.actions;
        }

        if (params.hasOwnProperty('mutations') && params.mutations) {
            this.mutations = params.mutations;
        }
        this.states = new Proxy(params.state, {
            set: function(state, key: string, value: any) {
                state[key] = value;
                self.events.publish('stateChange', self.states);
                self.status = 'resting';
                return true;
            }
        });
    }

    dispatch(actionKey: string, payload: any) {
        if(typeof this.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey} doesn't exist.`);
            return false;
        }
        this.status = 'action';
        this.actions[actionKey](this, payload);
        return true;
    }

    commit(mutationKey: string, payload: any) {
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
