import type { Lesson } from '../types';

export const leccionFX: Lesson = {
  id: 'm5-l1-fx',
  titulo: 'Efectos: delay y reverb',
  objetivo: 'Añadir espacio y dimensión al sonido con FX',
  modulo: 5,
  pasos: [
    {
      id: 'm5-l1-p1',
      instruccion: 'El Minilogue XD tiene tres tipos de efecto: MOD (chorus/phaser/flanger), DELAY y REVERB. Selecciona DELAY con el switch FX TYPE en el panel.',
      accion: 'Seleccionar efecto DELAY',
      condicion: { tipo: 'manual' },
      xp: 10,
      ayuda: 'El switch FX TYPE está en la sección FX, en el panel derecho del Minilogue.'
    },
    {
      id: 'm5-l1-p2',
      instruccion: 'Sube FX DEPTH a la mitad. Toca notas cortas y escucha los ecos. Ajusta FX TIME para cambiar el tiempo entre ecos.',
      accion: 'Activar delay con DEPTH a la mitad',
      condicion: { tipo: 'midi_cc_range', controlId: 'FX_DEPTH', min: 50, max: 80 },
      xp: 30,
    },
    {
      id: 'm5-l1-p3',
      instruccion: 'Mueve FX TIME al mínimo (ecos muy rápidos, casi coro) y luego al máximo (ecos largos tipo "eco de caverna"). Escucha la diferencia.',
      accion: 'Explorar rango de FX TIME',
      condicion: { tipo: 'midi_cc', controlId: 'FX_TIME', veces: 3 },
      xp: 40,
    },
    {
      id: 'm5-l1-p4',
      instruccion: 'Cambia FX TYPE a REVERB. Sube DEPTH a 60-80. Toca acordes lentos y escucha cómo el espacio envuelve el sonido.',
      accion: 'Probar reverb',
      condicion: { tipo: 'manual' },
      xp: 30,
    },
  ]
};

export const leccionPrimerPatch: Lesson = {
  id: 'm5-l2-primer-patch',
  titulo: 'Tu primer patch completo',
  objetivo: 'Construir un sonido reproducible desde Init Program',
  modulo: 5,
  pasos: [
    {
      id: 'm5-l2-p1',
      instruccion: 'Inicializa el programa: mantén SHIFT + presiona WRITE. Selecciona "Init Program". Esto da un sonido limpio de base para construir.',
      accion: 'Inicializar programa',
      condicion: { tipo: 'manual' },
      xp: 10,
      ayuda: 'Init Program borra todas las modificaciones y empieza con un tono simple de oscilador.'
    },
    {
      id: 'm5-l2-p2',
      instruccion: 'Construye un LEAD brillante:\n• VCO1 SHAPE → mínimo (sierra)\n• CUTOFF → 90\n• RESONANCE → 20\n• ATTACK → mínimo, DECAY → medio',
      accion: 'Configurar lead brillante',
      condicion: { tipo: 'manual' },
      xp: 30,
    },
    {
      id: 'm5-l2-p3',
      instruccion: 'Añade movimiento con LFO:\n• LFO TARGET → CUTOFF\n• LFO RATE → 40\n• LFO INT → 25',
      accion: 'Añadir LFO al patch',
      condicion: { tipo: 'manual' },
      xp: 30,
    },
    {
      id: 'm5-l2-p4',
      instruccion: 'Añade reverb corta:\n• FX TYPE → REVERB\n• FX TIME → 40\n• FX DEPTH → 50',
      accion: 'Añadir reverb',
      condicion: { tipo: 'manual' },
      xp: 20,
    },
    {
      id: 'm5-l2-p5',
      instruccion: 'Toca varias notas para probar el patch. Cuando estés satisfecho, guárdalo: mantén SHIFT + WRITE y selecciona un slot de memoria.',
      accion: 'Guardar patch en el Minilogue',
      condicion: { tipo: 'manual' },
      xp: 100,
      ayuda: 'El Minilogue tiene 200 slots de memoria. Los primeros 100 son de fábrica (sobreescribibles), los 100 siguientes son de usuario.'
    },
  ]
};
