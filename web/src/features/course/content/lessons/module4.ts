import type { Lesson } from '../types';

export const leccionLFORate: Lesson = {
  id: 'm4-l1-lforate',
  titulo: 'LFO Rate: velocidad de la modulación',
  objetivo: 'Controlar la velocidad del LFO para efectos rítmicos o sutiles',
  modulo: 4,
  pasos: [
    {
      id: 'm4-l1-p1',
      instruccion: 'El LFO (Oscillator de Baja Frecuencia) genera una onda que modula parámetros lentamente. Con LFO TARGET en CUTOFF creas el efecto "wah automático".',
      accion: 'Leer concepto LFO',
      condicion: { tipo: 'manual' },
      xp: 10,
    },
    {
      id: 'm4-l1-p2',
      instruccion: 'Configura el LFO TARGET en CUTOFF (mantén SHIFT + presiona la tecla LFO TARGET debajo del teclado y selecciona CUTOFF). Luego sube LFO INT a la mitad.',
      accion: 'Activar LFO en CUTOFF',
      condicion: { tipo: 'manual' },
      xp: 20,
      ayuda: 'LFO TARGET está accesible manteniendo SHIFT. Selecciona "CUTOFF" para que el LFO module el filtro.'
    },
    {
      id: 'm4-l1-p3',
      instruccion: 'Toca una nota larga. Baja LFO RATE al mínimo — la modulación es muy lenta, casi imperceptible en tiempos cortos. Escucha el "respiro" lento.',
      accion: 'LFO Rate muy lento',
      condicion: { tipo: 'midi_cc_range', controlId: 'LFO_RATE', min: 0, max: 20 },
      xp: 30,
    },
    {
      id: 'm4-l1-p4',
      instruccion: 'Sube LFO RATE al máximo. Ahora la modulación es tan rápida que produce vibrato/tremolo. Escucha el "titilar" del sonido.',
      accion: 'LFO Rate al máximo',
      condicion: { tipo: 'midi_cc_range', controlId: 'LFO_RATE', min: 100, max: 127 },
      xp: 30,
    },
    {
      id: 'm4-l1-p5',
      instruccion: 'Posiciona LFO RATE en el rango medio (60-80) para obtener un efecto "wah" rítmico y musical. Mueve el rate unas veces para encontrar el punto dulce.',
      accion: 'Encontrar rango medio de LFO Rate',
      condicion: { tipo: 'midi_cc', controlId: 'LFO_RATE', veces: 3 },
      xp: 50,
    },
  ]
};

export const leccionLFOInt: Lesson = {
  id: 'm4-l2-lfoint',
  titulo: 'LFO Intensity: profundidad de la modulación',
  objetivo: 'Controlar cuánto afecta el LFO al parámetro objetivo',
  modulo: 4,
  pasos: [
    {
      id: 'm4-l2-p1',
      instruccion: 'Con LFO TARGET en CUTOFF y RATE a la mitad, sube LFO INT hasta el máximo. Escucha cómo el filtro se abre y cierra con mayor rango.',
      accion: 'LFO INT al máximo',
      condicion: { tipo: 'midi_cc_range', controlId: 'LFO_INT', min: 90, max: 127 },
      xp: 40,
      ayuda: 'LFO INT está justo a la derecha del LFO RATE en la sección LFO.'
    },
    {
      id: 'm4-l2-p2',
      instruccion: 'Baja LFO INT a un valor sutil (15-30). La modulación se vuelve más discreta — se siente como un movimiento suave, no abrupto.',
      accion: 'LFO INT sutil',
      condicion: { tipo: 'midi_cc_range', controlId: 'LFO_INT', min: 15, max: 35 },
      xp: 40,
    },
    {
      id: 'm4-l2-p3',
      instruccion: 'Mueve LFO INT varias veces mientras tocas para comparar el efecto en distintas intensidades.',
      accion: 'Comparar intensidades',
      condicion: { tipo: 'midi_cc', controlId: 'LFO_INT', veces: 4 },
      xp: 30,
    },
  ]
};
