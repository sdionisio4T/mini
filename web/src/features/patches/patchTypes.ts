import type { ControlId } from '../course/content/types';

export type Difficulty = 'facil' | 'media' | 'alta';

/** Tolerancia para evaluación determinista de CC */
export const CC_TOLERANCE = 8;
export const SWITCH_TOLERANCE = 0;

export interface CCTarget {
  controlId: ControlId;
  value: number;       // 0–127
  tolerance?: number;  // overrides CC_TOLERANCE
  required: boolean;   // si false, es opcional / no penaliza mucho
}

export interface PatchStep {
  orden: number;
  instruccion: string;
  ayuda?: string;
}

export interface PatchSpec {
  id: string;
  nombre: string;
  descripcion: string;
  dificultad: Difficulty;
  ensena: string;          // concepto principal
  targets: CCTarget[];     // valores MIDI objetivo evaluables
  pasos: PatchStep[];      // guía desde INIT
}
