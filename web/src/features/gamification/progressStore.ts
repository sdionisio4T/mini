import { create } from 'zustand';

interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  desbloqueadoEn?: number;
}

interface ProgressStore {
  xp: number;
  nivel: number;
  achievements: Achievement[];
  completedSteps: Set<string>;
  completedLessons: Set<string>;
  addXP: (amount: number) => void;
  markStepCompleted: (stepId: string) => void;
  markLessonCompleted: (lessonId: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  isStepCompleted: (stepId: string) => boolean;
}

const XP_PER_NIVEL = 500;

export const useProgressStore = create<ProgressStore>((set, get) => ({
  xp: 0,
  nivel: 1,
  achievements: [],
  completedSteps: new Set(),
  completedLessons: new Set(),

  addXP: (amount) => set((s) => {
    const newXP = s.xp + amount;
    const newNivel = Math.floor(newXP / XP_PER_NIVEL) + 1;
    return { xp: newXP, nivel: newNivel };
  }),

  markStepCompleted: (stepId) => set((s) => ({
    completedSteps: new Set([...s.completedSteps, stepId]),
  })),

  markLessonCompleted: (lessonId) => set((s) => ({
    completedLessons: new Set([...s.completedLessons, lessonId]),
  })),

  unlockAchievement: (achievement) => set((s) => {
    const already = s.achievements.find(a => a.id === achievement.id);
    if (already) return {};
    return {
      achievements: [...s.achievements, { ...achievement, desbloqueadoEn: Date.now() }]
    };
  }),

  isStepCompleted: (stepId) => get().completedSteps.has(stepId),
}));
