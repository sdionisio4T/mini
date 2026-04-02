import type { ControlId } from '../../course/content/types';

export const CONTROL_LIST: { id: ControlId; label: string; hint: string }[] = [
  { id: 'CUTOFF',     label: 'CUTOFF',     hint: 'Knob grande de la sección FILTER' },
  { id: 'RESONANCE',  label: 'RESONANCE',  hint: 'Knob a la derecha del CUTOFF' },
  { id: 'EG_INT',     label: 'EG INT',     hint: 'Knob de intensidad de envolvente al filtro' },
  { id: 'LFO_RATE',   label: 'LFO RATE',   hint: 'Knob de velocidad del LFO' },
  { id: 'LFO_INT',    label: 'LFO INT',    hint: 'Knob de intensidad del LFO' },
  { id: 'VCO1_SHAPE', label: 'VCO1 SHAPE', hint: 'Knob de forma de onda del oscilador 1' },
  { id: 'VCO2_SHAPE', label: 'VCO2 SHAPE', hint: 'Knob de forma de onda del oscilador 2' },
  { id: 'FX_TIME',    label: 'FX TIME',    hint: 'Knob de tiempo del efecto (reverb/delay)' },
  { id: 'FX_DEPTH',   label: 'FX DEPTH',   hint: 'Knob de profundidad del efecto' },
];

/** Defaults del MIDI Implementation Chart del Minilogue XD */
export const DEFAULT_CC_MAP: Record<ControlId, number> = {
  CUTOFF:     43,
  RESONANCE:  44,
  EG_INT:     45,
  LFO_RATE:   24,
  LFO_INT:    26,
  VCO1_SHAPE: 18,
  VCO2_SHAPE: 19,
  FX_TIME:    28,
  FX_DEPTH:   29,
};
