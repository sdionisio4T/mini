import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATCHES } from './patchLibrary';
import type { Difficulty } from './patchTypes';

const DIFF_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  media: 'Media',
  alta: 'Alta',
};

const DIFF_COLORS: Record<Difficulty, string> = {
  facil: 'bg-green-100 text-green-700',
  media: 'bg-amber-100 text-amber-700',
  alta: 'bg-red-100 text-red-700',
};

export function PatchLibraryPage() {
  const [filter, setFilter] = useState<Difficulty | 'todos'>('todos');

  const visible = filter === 'todos' ? PATCHES : PATCHES.filter(p => p.dificultad === filter);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Patches</h1>
        <p className="text-gray-500 text-sm mt-1">
          Recrea cada patch y recibe un score basado en tus ajustes.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5">
        {(['todos', 'facil', 'media', 'alta'] as const).map(d => (
          <button key={d} onClick={() => setFilter(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === d ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {d === 'todos' ? 'Todos' : DIFF_LABELS[d]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map(patch => (
          <Link key={patch.id} to={`/patches/${patch.id}`}
            className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-gray-900 text-sm">{patch.nombre}</h2>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${DIFF_COLORS[patch.dificultad]}`}>
                  {DIFF_LABELS[patch.dificultad]}
                </span>
              </div>
              <p className="text-xs text-gray-500">{patch.descripcion}</p>
              <p className="text-xs text-indigo-600 mt-1">Aprende: {patch.ensena}</p>
            </div>
            <span className="text-gray-400 text-lg self-center">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
