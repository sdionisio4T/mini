export interface AchievementDef {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: 'first_note',
    nombre: 'Señal detectada',
    descripcion: 'Tocaste tu primera nota en el Minilogue.',
    icono: '🎵',
  },
  {
    id: 'midi_connected',
    nombre: 'Conectado',
    descripcion: 'Conectaste el Minilogue XD por MIDI.',
    icono: '🔌',
  },
  {
    id: 'module0_done',
    nombre: 'Listo para empezar',
    descripcion: 'Completaste el módulo de conexión y configuración.',
    icono: '✅',
  },
  {
    id: 'filter_101',
    nombre: 'Filtros 101',
    descripcion: 'Completaste el módulo del filtro VCF.',
    icono: '🎛',
  },
  {
    id: 'vco_explorer',
    nombre: 'Explorador de ondas',
    descripcion: 'Completaste el módulo de osciladores.',
    icono: '🌊',
  },
  {
    id: 'adsr_tamed',
    nombre: 'ADSR domado',
    descripcion: 'Completaste el módulo de envolventes.',
    icono: '📈',
  },
  {
    id: 'lfo_master',
    nombre: 'Modulación con control',
    descripcion: 'Completaste el módulo de LFO.',
    icono: '〰️',
  },
  {
    id: 'first_patch',
    nombre: 'Primer loop',
    descripcion: 'Creaste y guardaste tu primer patch completo.',
    icono: '🎼',
  },
  {
    id: 'calibrated',
    nombre: 'Calibrado',
    descripcion: 'Calibraste al menos 3 controles MIDI.',
    icono: '🎯',
  },
  {
    id: 'xp_500',
    nombre: 'Nivel 2',
    descripcion: 'Acumulaste 500 XP.',
    icono: '⭐',
  },
  {
    id: 'xp_1000',
    nombre: 'Nivel 3',
    descripcion: 'Acumulaste 1000 XP.',
    icono: '🌟',
  },
];
