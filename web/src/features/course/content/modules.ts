import { leccionConexion, leccionLocalControl } from './lessons/module0';
import { leccionCutoff, leccionResonancia } from './lessons/module1';
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
    titulo: 'El filtro',
    descripcion: 'Aprende a controlar el timbre con CUTOFF y RESONANCE.',
    lecciones: [leccionCutoff, leccionResonancia],
  },
];
