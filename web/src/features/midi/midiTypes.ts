export interface MidiDevice {
  id: string;
  name: string;
  type: 'input' | 'output';
  manufacturer?: string;
}

export interface MidiMessage {
  id: string;
  timestamp: number;
  type: 'noteOn' | 'noteOff' | 'cc' | 'other';
  channel: number;
  data: number[];
  // Para noteOn/noteOff:
  note?: number;
  velocity?: number;
  noteName?: string;
  // Para CC:
  ccNumber?: number;
  ccValue?: number;
}

export interface MidiMapping {
  controlId: string;
  ccNumber: number;
  deviceId: string;
  createdAt: number;
}

export type MidiConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'unsupported';
