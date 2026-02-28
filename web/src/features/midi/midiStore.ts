import { create } from 'zustand';
import type { MidiDevice, MidiMessage, MidiConnectionStatus } from './midiTypes';

interface MidiStore {
  status: MidiConnectionStatus;
  inputs: MidiDevice[];
  outputs: MidiDevice[];
  selectedInputId: string | null;
  selectedOutputId: string | null;
  messages: MidiMessage[];
  // Acciones
  setStatus: (s: MidiConnectionStatus) => void;
  setDevices: (inputs: MidiDevice[], outputs: MidiDevice[]) => void;
  setSelected: (inputId: string | null, outputId: string | null) => void;
  addMessage: (msg: MidiMessage) => void;
  clearMessages: () => void;
}

export const useMidiStore = create<MidiStore>((set) => ({
  status: 'disconnected',
  inputs: [],
  outputs: [],
  selectedInputId: null,
  selectedOutputId: null,
  messages: [],

  setStatus: (status) => set({ status }),
  setDevices: (inputs, outputs) => set({ inputs, outputs }),
  setSelected: (selectedInputId, selectedOutputId) => set({ selectedInputId, selectedOutputId }),
  addMessage: (msg) => set((s) => ({
    messages: [msg, ...s.messages].slice(0, 50)
  })),
  clearMessages: () => set({ messages: [] }),
}));
