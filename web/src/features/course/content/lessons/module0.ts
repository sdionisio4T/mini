import type { Lesson } from '../types';

export const leccionConexion: Lesson = {
  id: 'm0-l1-conexion',
  titulo: 'Conecta tu Minilogue XD',
  objetivo: 'Ver tu primera nota en pantalla',
  modulo: 0,
  pasos: [
    {
      id: 'p1',
      instruccion: 'Conecta el Minilogue al computador con un cable USB (el puerto está en el panel trasero).',
      accion: 'Conectar el cable físico',
      condicion: { tipo: 'manual' },
      xp: 20,
      ayuda: "El puerto USB está en el panel trasero del Minilogue, marcado como 'USB'."
    },
    {
      id: 'p2',
      instruccion: "Haz clic en 'Conectar MIDI' arriba y acepta el permiso del navegador.",
      accion: 'Aceptar permiso WebMIDI',
      condicion: { tipo: 'manual' },
      xp: 10,
      ayuda: 'Si no aparece el botón de permiso, recarga la página. Asegúrate de usar Chrome o Edge.'
    },
    {
      id: 'p3',
      instruccion: "Selecciona 'minilogue xd' en el menú desplegable de entrada MIDI.",
      accion: 'Seleccionar dispositivo MIDI',
      condicion: { tipo: 'manual' },
      xp: 10
    },
    {
      id: 'p4',
      instruccion: 'Toca 3 notas en el teclado del Minilogue. Deberías ver los mensajes aparecer en el monitor.',
      accion: 'Tocar 3 notas',
      condicion: { tipo: 'midi_note_on', cantidad: 3 },
      xp: 100,
      ayuda: 'Si no aparecen mensajes, verifica que el canal MIDI del Minilogue sea 1 (mantén SHIFT + MIDI CFG > MIDI CH = 1).'
    }
  ]
};

export const leccionLocalControl: Lesson = {
  id: 'm0-l2-localcontrol',
  titulo: 'Configura el Local Control',
  objetivo: 'Evitar que las notas suenen dos veces',
  modulo: 0,
  pasos: [
    {
      id: 'p1',
      instruccion: 'Mantén presionado el botón SHIFT del Minilogue.',
      accion: 'Mantener SHIFT presionado',
      condicion: { tipo: 'manual' },
      xp: 5
    },
    {
      id: 'p2',
      instruccion: 'Mientras mantienes SHIFT, presiona la tecla marcada como MIDI CFG (está debajo del teclado).',
      accion: 'Presionar tecla MIDI CFG',
      condicion: { tipo: 'manual' },
      xp: 5
    },
    {
      id: 'p3',
      instruccion: 'Gira el encoder para navegar hasta "Local SW" y cámbialo de ON a OFF. Presiona el encoder para confirmar.',
      accion: 'Cambiar Local SW a OFF',
      condicion: { tipo: 'manual' },
      xp: 50,
      ayuda: 'El encoder es la perilla grande de la derecha del display. Esto evita el doble-trigger sin afectar el sonido del Minilogue.'
    }
  ]
};
