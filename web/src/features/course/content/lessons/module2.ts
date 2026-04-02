import type { Lesson } from '../types';

export const leccionVCO1: Lesson = {
  id: 'm2-l1-vco1',
  titulo: 'Oscilador 1: formas de onda',
  objetivo: 'Entender cómo la forma de onda define el timbre básico',
  modulo: 2,
  pasos: [
    {
      id: 'm2-l1-p1',
      instruccion: 'Localiza la sección VCO 1 en el panel del Minilogue. El knob SHAPE controla la forma de onda entre sierra (brillante), cuadrada (hueca) y triángulo (suave).',
      accion: 'Identificar sección VCO 1',
      condicion: { tipo: 'manual' },
      xp: 10,
      ayuda: 'VCO 1 está en la parte superior izquierda del panel, encima de la sección MIXER.'
    },
    {
      id: 'm2-l1-p2',
      instruccion: 'Toca una nota y gira el SHAPE de VCO 1 al mínimo (diente de sierra). Escucha el sonido brillante y rico en armónicos.',
      accion: 'Mover VCO1 SHAPE al mínimo',
      condicion: { tipo: 'midi_cc_range', controlId: 'VCO1_SHAPE', min: 0, max: 25 },
      xp: 30,
      ayuda: 'El sonido de sierra es el más brillante — contiene todos los armónicos pares e impares.'
    },
    {
      id: 'm2-l1-p3',
      instruccion: 'Gira SHAPE hacia el centro (posición cuadrada). El sonido se vuelve más hueco — solo tiene armónicos impares.',
      accion: 'Mover VCO1 SHAPE al centro',
      condicion: { tipo: 'midi_cc_range', controlId: 'VCO1_SHAPE', min: 50, max: 80 },
      xp: 30,
    },
    {
      id: 'm2-l1-p4',
      instruccion: 'Gira SHAPE al máximo (triángulo). El sonido es más suave y puro — pocos armónicos.',
      accion: 'Mover VCO1 SHAPE al máximo',
      condicion: { tipo: 'midi_cc_range', controlId: 'VCO1_SHAPE', min: 100, max: 127 },
      xp: 30,
    },
    {
      id: 'm2-l1-p5',
      instruccion: 'Mueve el knob SHAPE de extremo a extremo 3 veces para sentir toda la paleta de timbres.',
      accion: 'Recorrer todo el rango de SHAPE',
      condicion: { tipo: 'midi_cc', controlId: 'VCO1_SHAPE', veces: 3 },
      xp: 50,
    },
  ]
};

export const leccionVCO2Detune: Lesson = {
  id: 'm2-l2-detune',
  titulo: 'Oscilador 2: detune y mezcla',
  objetivo: 'Crear un sonido más gordo combinando dos osciladores',
  modulo: 2,
  pasos: [
    {
      id: 'm2-l2-p1',
      instruccion: 'El Minilogue tiene dos osciladores. Cuando ambos tocan la misma nota pero levemente desafinados, crean un "batido" (beating) que hace el sonido más gordo.',
      accion: 'Leer concepto de detune',
      condicion: { tipo: 'manual' },
      xp: 10,
    },
    {
      id: 'm2-l2-p2',
      instruccion: 'En VCO 2, gira el knob PITCH levemente a la derecha del centro. Toca una nota y escucha cómo aparece el efecto "chorus" natural.',
      accion: 'Aplicar detune en VCO2',
      condicion: { tipo: 'manual' },
      xp: 40,
      ayuda: 'El knob PITCH de VCO 2 está en la sección VCO 2. Solo un giro muy pequeño es suficiente — demasiado suena desafinado.'
    },
    {
      id: 'm2-l2-p3',
      instruccion: 'En la sección MIXER, gira VCO 2 LEVEL hasta la mitad para mezclar los dos osciladores por igual.',
      accion: 'Ajustar mezcla VCO1 + VCO2',
      condicion: { tipo: 'manual' },
      xp: 30,
    },
  ]
};
