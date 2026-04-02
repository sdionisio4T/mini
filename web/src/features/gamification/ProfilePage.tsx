import { useProgressStore } from './progressStore';
import { ACHIEVEMENT_DEFS } from './achievements';
import { MODULES } from '../course/content/modules';

const XP_PER_NIVEL = 500;

function XPBar({ xp, nivel }: { xp: number; nivel: number }) {
  const xpInLevel = xp % XP_PER_NIVEL;
  const pct = (xpInLevel / XP_PER_NIVEL) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-2xl font-bold text-indigo-600">Nivel {nivel}</span>
          <p className="text-xs text-gray-400 mt-0.5">{xp} XP totales</p>
        </div>
        <span className="text-sm text-gray-500">{xpInLevel} / {XP_PER_NIVEL} XP</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-1">{XP_PER_NIVEL - xpInLevel} XP para nivel {nivel + 1}</p>
    </div>
  );
}

function AchievementsGrid() {
  const { achievements } = useProgressStore();
  const unlockedIds = new Set(achievements.map(a => a.id));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="font-semibold text-gray-800 mb-4">
        Logros ({achievements.length}/{ACHIEVEMENT_DEFS.length})
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENT_DEFS.map(def => {
          const unlocked = unlockedIds.has(def.id);
          const earned = achievements.find(a => a.id === def.id);
          return (
            <div key={def.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
              unlocked
                ? 'bg-indigo-50 border-indigo-200'
                : 'bg-gray-50 border-gray-100 opacity-50'
            }`}>
              <span className="text-2xl">{unlocked ? def.icono : '🔒'}</span>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${unlocked ? 'text-indigo-800' : 'text-gray-500'}`}>
                  {def.nombre}
                </p>
                <p className="text-xs text-gray-400 leading-tight mt-0.5">{def.descripcion}</p>
                {unlocked && earned?.desbloqueadoEn && (
                  <p className="text-xs text-indigo-400 mt-1">
                    {new Date(earned.desbloqueadoEn).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourseProgress() {
  const { completedLessons } = useProgressStore();
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lecciones.length, 0);
  const completedCount = MODULES.reduce(
    (sum, m) => sum + m.lecciones.filter(l => completedLessons.has(l.id)).length,
    0
  );
  const pct = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gray-800">Progreso del curso</h2>
        <span className="text-sm text-gray-500">{completedCount}/{totalLessons} lecciones</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-1.5">
        {MODULES.map(mod => {
          const done = mod.lecciones.filter(l => completedLessons.has(l.id)).length;
          const total = mod.lecciones.length;
          return (
            <div key={mod.id} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                done === total ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {done === total ? '✓' : mod.id}
              </span>
              <span className="text-xs text-gray-600 flex-1">{mod.titulo}</span>
              <span className="text-xs text-gray-400">{done}/{total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { xp, nivel } = useProgressStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Tu progreso y logros desbloqueados.</p>
      </div>
      <XPBar xp={xp} nivel={nivel} />
      <CourseProgress />
      <AchievementsGrid />
    </div>
  );
}
