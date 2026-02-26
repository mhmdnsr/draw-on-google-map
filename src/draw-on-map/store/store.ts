import { DrawToolType } from '../types';

export interface DrawStoreState {
  selectedTool: DrawToolType | null;
  color: string;
  strokeWeight: number;
  polygonFillColor: string;
  polygonOpacity: number;
  markerIcon: string | null;
}

export type StoreListener = (state: DrawStoreState) => void;

export class Store {
  private readonly listeners: Set<StoreListener> = new Set();
  private state: DrawStoreState;

  constructor(initialState?: Partial<DrawStoreState>) {
    this.state = {
      selectedTool: null,
      color: '#fff',
      strokeWeight: 6,
      polygonFillColor: '#fff',
      polygonOpacity: 1,
      markerIcon: null,
      ...initialState,
    };
  }

  get states(): DrawStoreState {
    return this.state;
  }

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setSelectedTool(tool: DrawToolType | null): void {
    this.state.selectedTool = tool;
    this.notify();
  }

  setColor(color: string): void {
    this.state.color = color;
    this.notify();
  }

  setStrokeWeight(weight: number): void {
    this.state.strokeWeight = weight;
    this.notify();
  }

  setPolygonFillColor(color: string): void {
    this.state.polygonFillColor = color;
    this.notify();
  }

  setPolygonOpacity(opacity: number): void {
    const clamped = Math.min(1, Math.max(0, opacity));
    this.state.polygonOpacity = clamped;
    this.notify();
  }

  setMarkerIcon(icon: string | null): void {
    this.state.markerIcon = icon;
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
