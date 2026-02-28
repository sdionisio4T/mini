export type ControlId = 'CUTOFF' | 'RESONANCE' | 'LFO_RATE' | 'LFO_INT' | 'EG_INT' |
  'VCO1_SHAPE' | 'VCO2_SHAPE' | 'FX_TIME' | 'FX_DEPTH';

export type StepCondition =
  | { tipo: 'midi_note_on'; cantidad: number }
  | { tipo: 'midi_cc'; controlId: ControlId; veces: number }
  | { tipo: 'midi_cc_range'; controlId: ControlId; min: number; max: number }
  | { tipo: 'manual' };

export interface LessonStep {
  id: string;
  instruccion: string;
  accion: string;
  condicion: StepCondition;
  xp: number;
  ayuda?: string;
}

export interface Lesson {
  id: string;
  titulo: string;
  objetivo: string;
  modulo: number;
  pasos: LessonStep[];
}
