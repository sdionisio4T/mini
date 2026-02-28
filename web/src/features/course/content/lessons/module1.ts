import type { Lesson } from '../types';

export const leccionCutoff: Lesson = {
  id: 'm1-l1-cutoff',
  titulo: 'El filtro: abre y cierra el brillo',
  objetivo: 'Sentir cómo el CUTOFF cambia el timbre',
  modulo: 1,
  pasos: [
    {
      id: 'p1',
      instruccion: 'Toca y mantén una nota. Gira el knob CUTOFF lentamente hacia la izquierda (mínimo). Escucha cómo el sonido se vuelve oscuro y apagado.',
      accion: 'Mover CUTOFF al mínimo mientras suena una nota',
      condicion: { tipo: 'midi_cc_range', controlId: 'CUTOFF', min: 0, max: 30 },
      xp: 30,
      ayuda: 'CUTOFF está en la sección FILTER del panel, es el knob más grande de esa sección.'
    },
    {
      id: 'p2',
      instruccion: 'Ahora gíralo completamente hacia la derecha (máximo). El sonido se vuelve brillante y lleno de armónicos agudos.',
      accion: 'Mover CUTOFF al máximo',
      condicion: { tipo: 'midi_cc_range', controlId: 'CUTOFF', min: 100, max: 127 },
      xp: 30
    },
    {
      id: 'p3',
      instruccion: "Mueve el CUTOFF de un lado al otro al menos 5 veces mientras tocas. Escucha el efecto 'wah' que produce.",
      accion: 'Mover CUTOFF 5 veces',
      condicion: { tipo: 'midi_cc', controlId: 'CUTOFF', veces: 5 },
      xp: 50
    }
  ]
};

export const leccionResonancia: Lesson = {
  id: 'm1-l2-resonancia',
  titulo: 'La resonancia: el pico del filtro',
  objetivo: 'Entender qué hace RESONANCE y cómo usarla',
  modulo: 1,
  pasos: [
    {
      id: 'p1',
      instruccion: 'Pon el CUTOFF a la mitad (posición de las 12). Ahora sube la RESONANCE lentamente. Escucha cómo aparece un tono "agudo" característico.',
      accion: 'Subir RESONANCE con CUTOFF a la mitad',
      condicion: { tipo: 'midi_cc_range', controlId: 'RESONANCE', min: 60, max: 127 },
      xp: 40,
      ayuda: 'RESONANCE está justo a la derecha del CUTOFF en la sección FILTER.'
    },
    {
      id: 'p2',
      instruccion: 'Con la resonancia alta, mueve el CUTOFF lentamente. Escucha cómo el tono resonante cambia de pitch.',
      accion: 'Mover CUTOFF con resonancia alta',
      condicion: { tipo: 'midi_cc', controlId: 'CUTOFF', veces: 3 },
      xp: 60
    }
  ]
};
