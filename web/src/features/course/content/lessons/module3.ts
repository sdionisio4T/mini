import type { Lesson } from '../types';

export const leccionADSR: Lesson = {
  id: 'm3-l1-adsr',
  titulo: 'La envolvente ADSR: dar forma al sonido en el tiempo',
  objetivo: 'Entender cómo ADSR controla la evolución del sonido',
  modulo: 3,
  pasos: [
    {
      id: 'm3-l1-p1',
      instruccion: 'La envolvente controla cómo cambia el volumen (o el filtro) con el tiempo: Attack (inicio), Decay (caída inicial), Sustain (nivel mientras mantienes), Release (cola al soltar).',
      accion: 'Leer concepto ADSR',
      condicion: { tipo: 'manual' },
      xp: 10,
    },
    {
      id: 'm3-l1-p2',
      instruccion: 'Pon el ATTACK del AMP EG al máximo. Toca una nota — el volumen ahora sube lentamente. Esto crea un efecto de "swell" o entrada suave.',
      accion: 'Subir ATTACK al máximo',
      condicion: { tipo: 'manual' },
      xp: 30,
      ayuda: 'El AMP EG está en la sección EG del panel. El knob A (Attack) es el primero a la izquierda de esa sección.'
    },
    {
      id: 'm3-l1-p3',
      instruccion: 'Baja el ATTACK al mínimo. Ahora sube el DECAY y baja el SUSTAIN a cero. Toca una nota — obtienes un sonido percusivo tipo "pluck".',
      accion: 'Crear sonido pluck (ADSR percusivo)',
      condicion: { tipo: 'manual' },
      xp: 40,
      ayuda: 'Un "pluck" típico: ATTACK mínimo, DECAY medio, SUSTAIN cero, RELEASE mínimo.'
    },
    {
      id: 'm3-l1-p4',
      instruccion: 'Para un pad suave: ATTACK alto, DECAY medio, SUSTAIN alto, RELEASE alto. Configúralo y toca varias notas mantenidas.',
      accion: 'Crear sonido pad (ADSR sostenido)',
      condicion: { tipo: 'manual' },
      xp: 40,
    },
  ]
};

export const leccionEGInt: Lesson = {
  id: 'm3-l2-egint',
  titulo: 'EG INT: modulación del filtro con la envolvente',
  objetivo: 'Aplicar la envolvente al filtro para sonidos dinámicos',
  modulo: 3,
  pasos: [
    {
      id: 'm3-l2-p1',
      instruccion: 'EG INT controla cuánto afecta la envolvente al CUTOFF. Con valor positivo, la envolvente abre el filtro al atacar la nota. Con negativo, lo cierra.',
      accion: 'Leer concepto EG INT',
      condicion: { tipo: 'manual' },
      xp: 10,
    },
    {
      id: 'm3-l2-p2',
      instruccion: 'Pon CUTOFF a la mitad, EG INT al máximo. Toca una nota — escucha cómo el ataque tiene más brillo y luego cae (el filtro se abre y cierra con la envolvente).',
      accion: 'Subir EG INT al máximo',
      condicion: { tipo: 'midi_cc_range', controlId: 'EG_INT', min: 90, max: 127 },
      xp: 50,
      ayuda: 'EG INT está en la sección FILTER, justo encima del CUTOFF.'
    },
    {
      id: 'm3-l2-p3',
      instruccion: 'Ahora mueve EG INT hacia el centro y experimenta con diferentes valores mientras tocas notas.',
      accion: 'Experimentar con EG INT',
      condicion: { tipo: 'midi_cc', controlId: 'EG_INT', veces: 3 },
      xp: 40,
    },
  ]
};
