import { eventBus, EVENTS } from '../../lib/events/eventBus';
import type { LessonStep } from './content/types';
import type { MidiMessage } from '../midi/midiTypes';

// Contadores internos para condiciones acumulativas
const ccCounters: Record<string, number> = {};

type StepCompleteHandler = (stepId: string, xp: number) => void;

class CourseEngine {
  private activeStep: LessonStep | null = null;
  private onComplete: StepCompleteHandler | null = null;
  private unsubscribers: (() => void)[] = [];

  // Mapeo de controlId -> CC (lo llenará el CalibrationWizard)
  private ccMap: Record<string, number> = {
    // Defaults del Minilogue XD según el MIDI Implementation Chart
    CUTOFF: 43,
    RESONANCE: 44,
    EG_INT: 45,
    LFO_RATE: 24,
    LFO_INT: 26,
    VCO1_SHAPE: 18,
    VCO2_SHAPE: 19,
    FX_TIME: 28,
    FX_DEPTH: 29,
  };

  start(onComplete: StepCompleteHandler): void {
    this.onComplete = onComplete;

    const unsubNote = eventBus.on<MidiMessage>(EVENTS.MIDI_NOTE_ON, (msg) => {
      this.evaluateCondition(msg);
    });

    const unsubCC = eventBus.on<MidiMessage>(EVENTS.MIDI_CC, (msg) => {
      // Actualizar synthStore con el nombre del control
      const controlId = this.getControlIdFromCC(msg.ccNumber!);
      if (controlId) {
        import('../synth-ui/synthStore').then(({ useSynthStore }) => {
          useSynthStore.getState().updateCC(controlId, msg.ccValue!);
        });
      }
      this.evaluateCondition(msg);
    });

    this.unsubscribers = [unsubNote, unsubCC];
  }

  stop(): void {
    this.unsubscribers.forEach(u => u());
    this.unsubscribers = [];
    this.activeStep = null;
  }

  setActiveStep(step: LessonStep): void {
    this.activeStep = step;
    // Resetear contador para condiciones cc
    if (step.condicion.tipo === 'midi_cc' || step.condicion.tipo === 'midi_cc_range') {
      const cond = step.condicion as { controlId: string };
      ccCounters[cond.controlId] = 0;
    }
  }

  updateCCMap(controlId: string, ccNumber: number): void {
    this.ccMap[controlId] = ccNumber;
  }

  private getControlIdFromCC(ccNumber: number): string | null {
    for (const [id, cc] of Object.entries(this.ccMap)) {
      if (cc === ccNumber) return id;
    }
    return null;
  }

  private noteOnCount = 0;

  private evaluateCondition(msg: MidiMessage): void {
    if (!this.activeStep || !this.onComplete) return;
    const { condicion, id, xp } = this.activeStep;

    if (condicion.tipo === 'midi_note_on' && msg.type === 'noteOn') {
      this.noteOnCount++;
      if (this.noteOnCount >= condicion.cantidad) {
        this.noteOnCount = 0;
        this.activeStep = null;
        this.onComplete(id, xp);
      }
    }

    if ((condicion.tipo === 'midi_cc' || condicion.tipo === 'midi_cc_range') && msg.type === 'cc') {
      const expectedCC = this.ccMap[condicion.controlId];
      if (msg.ccNumber !== expectedCC) return;

      if (condicion.tipo === 'midi_cc_range') {
        const val = msg.ccValue!;
        if (val >= condicion.min && val <= condicion.max) {
          this.activeStep = null;
          this.onComplete(id, xp);
        }
      }

      if (condicion.tipo === 'midi_cc') {
        ccCounters[condicion.controlId] = (ccCounters[condicion.controlId] ?? 0) + 1;
        if (ccCounters[condicion.controlId] >= condicion.veces) {
          this.activeStep = null;
          this.onComplete(id, xp);
        }
      }
    }
  }
}

export const courseEngine = new CourseEngine();
