import { eventBus, EVENTS } from '../../lib/events/eventBus';
import type { MidiDevice, MidiMessage } from './midiTypes';
import { midiNoteToName, generateId } from '../../shared/noteUtils';

class MidiService {
  private access: MIDIAccess | null = null;
  private activeInput: MIDIInput | null = null;
  private activeOutput: MIDIOutput | null = null;

  isSupported(): boolean {
    return 'requestMIDIAccess' in navigator;
  }

  async requestAccess(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      this.access = await navigator.requestMIDIAccess({ sysex: false });
      this.access.onstatechange = () => {
        eventBus.emit(EVENTS.MIDI_CONNECTED, this.getDevices());
      };
      return true;
    } catch {
      return false;
    }
  }

  getDevices(): { inputs: MidiDevice[]; outputs: MidiDevice[] } {
    if (!this.access) return { inputs: [], outputs: [] };
    const inputs = Array.from(this.access.inputs.values()).map(d => ({
      id: d.id, name: d.name ?? 'Desconocido', type: 'input' as const, manufacturer: d.manufacturer ?? undefined
    }));
    const outputs = Array.from(this.access.outputs.values()).map(d => ({
      id: d.id, name: d.name ?? 'Desconocido', type: 'output' as const, manufacturer: d.manufacturer ?? undefined
    }));
    return { inputs, outputs };
  }

  connect(inputId: string, outputId?: string): boolean {
    if (!this.access) return false;

    // Desconectar anterior
    if (this.activeInput) {
      this.activeInput.onmidimessage = null;
    }

    const input = this.access.inputs.get(inputId);
    if (!input) return false;

    this.activeInput = input;
    this.activeInput.onmidimessage = (event) => this.handleMessage(event);

    if (outputId) {
      this.activeOutput = this.access.outputs.get(outputId) ?? null;
    }

    eventBus.emit(EVENTS.MIDI_CONNECTED, { inputId, outputId });
    return true;
  }

  disconnect(): void {
    if (this.activeInput) {
      this.activeInput.onmidimessage = null;
      this.activeInput = null;
    }
    this.activeOutput = null;
    eventBus.emit(EVENTS.MIDI_DISCONNECTED, {});
  }

  sendCC(channel: number, cc: number, value: number): void {
    if (!this.activeOutput) return;
    this.activeOutput.send([0xB0 + (channel - 1), cc, value]);
  }

  private handleMessage(event: MIDIMessageEvent): void {
    if (!event.data) return;
    const [status, data1, data2] = Array.from(event.data);
    const type = status >> 4;
    const channel = (status & 0x0F) + 1;

    const msg: MidiMessage = {
      id: generateId(),
      timestamp: event.timeStamp,
      type: 'other',
      channel,
      data: [status, data1, data2],
    };

    if (type === 0x9 && data2 > 0) {
      msg.type = 'noteOn';
      msg.note = data1;
      msg.velocity = data2;
      msg.noteName = midiNoteToName(data1);
      eventBus.emit(EVENTS.MIDI_NOTE_ON, msg);
    } else if (type === 0x8 || (type === 0x9 && data2 === 0)) {
      msg.type = 'noteOff';
      msg.note = data1;
      msg.velocity = data2;
      msg.noteName = midiNoteToName(data1);
      eventBus.emit(EVENTS.MIDI_NOTE_OFF, msg);
    } else if (type === 0xB) {
      msg.type = 'cc';
      msg.ccNumber = data1;
      msg.ccValue = data2;
      eventBus.emit(EVENTS.MIDI_CC, msg);
    }

    eventBus.emit(EVENTS.MIDI_MESSAGE, msg);
  }
}

export const midiService = new MidiService();
