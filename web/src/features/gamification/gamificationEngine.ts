import { eventBus, EVENTS } from '../../lib/events/eventBus';
import { useProgressStore } from './progressStore';
import { ACHIEVEMENT_DEFS } from './achievements';
import { db } from '../../lib/storage/indexedDb';

/**
 * Motor de gamificación: escucha eventos del bus y aplica reglas de XP y logros.
 * Se inicia una vez al arrancar la app.
 */
class GamificationEngine {
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;

    // Primera nota tocada
    eventBus.on(EVENTS.MIDI_NOTE_ON, () => {
      this.tryUnlock('first_note');
    });

    // MIDI conectado
    eventBus.on(EVENTS.MIDI_CONNECTED, () => {
      this.tryUnlock('midi_connected');
      this.addXPOnce('midi_connected_xp', 100);
    });

    // Paso de lección completado
    eventBus.on<{ lessonId: string; stepId: string; xp: number }>(
      EVENTS.LESSON_STEP_COMPLETED,
      ({ xp }) => {
        this.persistProgressEvent('LESSON_STEP_COMPLETED', { xp });
        // XP ya se suma en LessonPage; aquí solo persistimos el evento
      }
    );

    // Lección completada → verificar logros de módulo
    eventBus.on<{ lessonId: string }>(EVENTS.LESSON_COMPLETED, ({ lessonId }) => {
      this.persistProgressEvent('LESSON_COMPLETED', { lessonId });
      this.checkModuleAchievements();
    });

    // CC mapeado → verificar si calibró suficientes controles
    eventBus.on(EVENTS.CC_MAPPED, () => {
      db.midi_mappings.count().then(count => {
        if (count >= 3) this.tryUnlock('calibrated');
      });
    });

    // XP milestones
    useProgressStore.subscribe((state) => {
      if (state.xp >= 500) this.tryUnlock('xp_500');
      if (state.xp >= 1000) this.tryUnlock('xp_1000');
    });
  }

  private checkModuleAchievements(): void {
    const { completedLessons } = useProgressStore.getState();
    const lessonsInModule = (ids: string[]) => ids.every(id => completedLessons.has(id));

    if (lessonsInModule(['m0-l1-conexion', 'm0-l2-localcontrol'])) this.tryUnlock('module0_done');
    if (lessonsInModule(['m1-l1-cutoff', 'm1-l2-resonancia']))     this.tryUnlock('filter_101');
    if (lessonsInModule(['m2-l1-vco1', 'm2-l2-detune']))           this.tryUnlock('vco_explorer');
    if (lessonsInModule(['m3-l1-adsr', 'm3-l2-egint']))            this.tryUnlock('adsr_tamed');
    if (lessonsInModule(['m4-l1-lforate', 'm4-l2-lfoint']))        this.tryUnlock('lfo_master');
    if (lessonsInModule(['m5-l1-fx', 'm5-l2-primer-patch']))       this.tryUnlock('first_patch');
  }

  private tryUnlock(achievementId: string): void {
    const def = ACHIEVEMENT_DEFS.find(a => a.id === achievementId);
    if (!def) return;
    const { achievements, unlockAchievement } = useProgressStore.getState();
    if (achievements.find(a => a.id === achievementId)) return;
    unlockAchievement({ id: def.id, nombre: def.nombre, descripcion: def.descripcion });
    eventBus.emit(EVENTS.ACHIEVEMENT_UNLOCKED, def);
    this.persistProgressEvent('ACHIEVEMENT_UNLOCKED', { id: achievementId });
  }

  private addXPOnce(key: string, amount: number): void {
    const storageKey = `xp_once_${key}`;
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, '1');
    useProgressStore.getState().addXP(amount);
  }

  private persistProgressEvent(type: string, payload: object): void {
    db.progress_events.add({ ts: Date.now(), type, payload }).catch(() => {});
  }
}

export const gamificationEngine = new GamificationEngine();
