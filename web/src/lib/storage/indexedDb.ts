import Dexie, { type Table } from 'dexie';
import type { MidiMapping } from '../../features/midi/midiTypes';

interface ProgressEvent {
  id?: number;
  ts: number;
  type: string;
  payload: object;
}

interface UserState {
  id?: number;
  xp: number;
  nivel: number;
  achievementIds: string[];
  updatedAt: number;
}

class MinilogueDB extends Dexie {
  midi_mappings!: Table<MidiMapping & { id?: number }>;
  progress_events!: Table<ProgressEvent>;
  user_state!: Table<UserState>;

  constructor() {
    super('MinilogueXDCoach');
    this.version(1).stores({
      midi_mappings: '++id, controlId, deviceId',
      progress_events: '++id, ts, type',
      user_state: '++id',
    });
  }
}

export const db = new MinilogueDB();
