import { leccionConexion, leccionLocalControl } from './lessons/module0';
import { leccionCutoff, leccionResonancia } from './lessons/module1';
import { leccionVCO1, leccionVCO2Detune } from './lessons/module2';
import { leccionADSR, leccionEGInt } from './lessons/module3';
import { leccionLFORate, leccionLFOInt } from './lessons/module4';
import { leccionFX, leccionPrimerPatch } from './lessons/module5';
import type { Lesson } from './types';

export interface ModuleInfo {
  id: number;
  titulo: string;
  descripcion: string;
  lecciones: Lesson[];
}

export const MODULES: ModuleInfo[] = [
  {
    id: 0,
    titulo: 'Conecta y configura',
    descripcion: 'Conecta el Minilogue XD y prepara todo para empezar.',
    lecciones: [leccionConexion, leccionLocalControl],
  },
  {
    id: 1,
    titulo: 'El filtro (VCF)',
    descripcion: 'Aprende a controlar el timbre con CUTOFF y RESONANCE.',
    lecciones: [leccionCutoff, leccionResonancia],
  },
  {
    id: 2,
    titulo: 'Osciladores (VCO)',
    descripcion: 'Formas de onda, detune y mezcla de osciladores.',
    lecciones: [leccionVCO1, leccionVCO2Detune],
  },
  {
    id: 3,
    titulo: 'Envolventes (EG)',
    descripcion: 'ADSR: controla la evolución del sonido en el tiempo.',
    lecciones: [leccionADSR, leccionEGInt],
  },
  {
    id: 4,
    titulo: 'LFO y modulación',
    descripcion: 'Modulación lenta para efectos de movimiento y animación.',
    lecciones: [leccionLFORate, leccionLFOInt],
  },
  {
    id: 5,
    titulo: 'Efectos y primer patch',
    descripcion: 'Delay, reverb y construcción de tu primer sonido completo.',
    lecciones: [leccionFX, leccionPrimerPatch],
  },
];
