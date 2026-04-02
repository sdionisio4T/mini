import { create } from 'zustand';
import type { AudioDevice, AudioConnectionState, AudioFeatures } from './audioTypes';

interface AudioStore {
  state: AudioConnectionState;
  devices: AudioDevice[];
  selectedDeviceId: string | null;
  latestFeatures: AudioFeatures | null;

  setState: (s: AudioConnectionState) => void;
  setDevices: (d: AudioDevice[]) => void;
  setSelectedDeviceId: (id: string | null) => void;
  setLatestFeatures: (f: AudioFeatures) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  state: 'idle',
  devices: [],
  selectedDeviceId: null,
  latestFeatures: null,

  setState: (state) => set({ state }),
  setDevices: (devices) => set({ devices }),
  setSelectedDeviceId: (selectedDeviceId) => set({ selectedDeviceId }),
  setLatestFeatures: (latestFeatures) => set({ latestFeatures }),
}));
