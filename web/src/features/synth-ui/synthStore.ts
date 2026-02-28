import { create } from 'zustand';

// Valores CC por nombre de control
interface SynthStore {
  ccValues: Record<string, number>; // controlId -> valor 0–127
  ccHistory: Record<string, number[]>; // controlId -> últimos 5 valores
  updateCC: (controlId: string, value: number) => void;
  getCCValue: (controlId: string) => number;
}

export const useSynthStore = create<SynthStore>((set, get) => ({
  ccValues: {},
  ccHistory: {},

  updateCC: (controlId, value) => set((s) => ({
    ccValues: { ...s.ccValues, [controlId]: value },
    ccHistory: {
      ...s.ccHistory,
      [controlId]: [...(s.ccHistory[controlId] ?? []), value].slice(-5),
    },
  })),

  getCCValue: (controlId) => get().ccValues[controlId] ?? 64,
}));
