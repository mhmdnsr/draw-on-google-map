import { Store } from './store';

export default function createStore(): Store {
  return new Store();
}

export { Store };
export type { DrawStoreState } from './store';
