type Handler<T = unknown> = (payload: T) => void;

class EventBus {
  private listeners: Map<string, Handler[]> = new Map();

  on<T>(event: string, handler: Handler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler as Handler);
    // Devuelve función de cleanup
    return () => this.off(event, handler as Handler);
  }

  off(event: string, handler: Handler): void {
    const handlers = this.listeners.get(event) ?? [];
    this.listeners.set(event, handlers.filter(h => h !== handler));
  }

  emit<T>(event: string, payload?: T): void {
    (this.listeners.get(event) ?? []).forEach(h => h(payload as unknown));
  }
}

export const eventBus = new EventBus();

// Constantes de eventos
export const EVENTS = {
  MIDI_CONNECTED: 'MIDI_CONNECTED',
  MIDI_DISCONNECTED: 'MIDI_DISCONNECTED',
  MIDI_MESSAGE: 'MIDI_MESSAGE',
  MIDI_NOTE_ON: 'MIDI_NOTE_ON',
  MIDI_NOTE_OFF: 'MIDI_NOTE_OFF',
  MIDI_CC: 'MIDI_CC',
  CC_MAPPED: 'CC_MAPPED',
  LESSON_STEP_COMPLETED: 'LESSON_STEP_COMPLETED',
  LESSON_COMPLETED: 'LESSON_COMPLETED',
  XP_GAINED: 'XP_GAINED',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
} as const;
