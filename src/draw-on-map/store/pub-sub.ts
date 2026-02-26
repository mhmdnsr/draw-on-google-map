export class PubSub {
    events: { [key: string]: Function[] };

    constructor() {
        this.events = {};
    }

    subscribe(event: string, callback: Function) {
        let self = this;
        if (!self.events.hasOwnProperty(event)) {
            self.events[event] = [];
        }
        return self.events[event].push(callback);
    }

    publish(event: string, data: any = {}) {
        let self = this;
        if(!self.events.hasOwnProperty(event)) {
            return [];
        }
        return self.events[event].map(callback => callback(data));
    }
}
