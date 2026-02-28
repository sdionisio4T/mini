import { Link } from 'react-router-dom';
import { MODULES } from './content/modules';
import { useProgressStore } from '../gamification/progressStore';

export function CourseHome() {
  const { completedLessons, xp, nivel } = useProgressStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Minilogue XD Coach</h1>
        <p className="text-gray-500 mt-1">Tu guía para aprender síntesis desde cero.</p>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
            Nivel {nivel}
          </span>
          <span className="text-sm text-gray-500">{xp} XP</span>
        </div>
      </div>

      <div className="space-y-4">
        {MODULES.map((mod) => {
          const completadas = mod.lecciones.filter(l => completedLessons.has(l.id)).length;
          const total = mod.lecciones.length;
          const pct = total > 0 ? (completadas / total) * 100 : 0;

          return (
            <div key={mod.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Módulo {mod.id}</span>
                  <h2 className="font-semibold text-gray-900 text-lg">{mod.titulo}</h2>
                  <p className="text-sm text-gray-500">{mod.descripcion}</p>
                </div>
                <span className="text-sm text-gray-400">{completadas}/{total}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full mt-3 mb-4">
                <div className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="space-y-2">
                {mod.lecciones.map((leccion) => {
                  const done = completedLessons.has(leccion.id);
                  return (
                    <Link key={leccion.id} to={`/leccion/${leccion.id}`}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        done ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{leccion.titulo}</p>
                        <p className="text-xs text-gray-500">{leccion.objetivo}</p>
                      </div>
                      <span className="text-lg">{done ? '✅' : '→'}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
