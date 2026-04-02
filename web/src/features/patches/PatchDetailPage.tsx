import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PATCHES } from './patchLibrary';
import { evaluatePatch } from './patchEvaluator';
import { useSynthStore } from '../synth-ui/synthStore';
import { useProgressStore } from '../gamification/progressStore';
import type { EvaluationResult } from './patchEvaluator';

const DIFF_LABELS = { facil: 'Fácil', media: 'Media', alta: 'Alta' };
const DIFF_COLORS = {
  facil: 'bg-green-100 text-green-700',
  media: 'bg-amber-100 text-amber-700',
  alta: 'bg-red-100 text-red-700',
};

function ScoreCircle({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8"/>
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

function EvaluationPanel({ result, onReset }: { result: EvaluationResult; onReset: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="text-center">
        <ScoreCircle score={result.score} />
        <p className={`text-lg font-bold mt-2 ${result.verdict === 'PASS' ? 'text-green-600' : 'text-amber-600'}`}>
          {result.verdict === 'PASS' ? '¡Patch recreado! ✅' : 'Sigue ajustando…'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {result.matched.length}/{result.totalTargets} parámetros dentro del rango
        </p>
      </div>

      {result.mismatches.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Ajustes sugeridos:</p>
          <div className="space-y-2">
            {result.mismatches.map(m => (
              <div key={m.controlId} className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${
                m.required ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'
              }`}>
                <span className="mt-0.5">{m.required ? '🔴' : '🟡'}</span>
                <p className="text-gray-700">{m.hint}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.verdict === 'PASS' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center text-sm text-green-700">
          🎉 Guarda este patch en el Minilogue: SHIFT + WRITE → elige un slot de memoria.
        </div>
      )}

      <div className="text-center text-xs text-gray-400 italic">
        Evaluación por coincidencia de parámetros MIDI ±{8}.<br/>
        La evaluación con IA (audio + LangChain) estará disponible próximamente.
      </div>

      <button onClick={onReset}
        className="w-full text-sm text-indigo-600 hover:text-indigo-800 underline">
        Volver a intentar
      </button>
    </div>
  );
}

export function PatchDetailPage() {
  const { patchId } = useParams<{ patchId: string }>();
  const navigate = useNavigate();
  const ccValues = useSynthStore(s => s.ccValues);
  const { addXP } = useProgressStore();
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [xpAwarded, setXpAwarded] = useState(false);

  const patch = PATCHES.find(p => p.id === patchId);

  if (!patch) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Patch no encontrado.</p>
        <button onClick={() => navigate('/patches')}
          className="mt-4 text-indigo-600 underline text-sm">Volver</button>
      </div>
    );
  }

  const handleEvaluate = () => {
    const res = evaluatePatch(patch, ccValues);
    setResult(res);
    if (res.verdict === 'PASS' && !xpAwarded) {
      const xp = { facil: 100, media: 200, alta: 350 }[patch.dificultad];
      addXP(xp);
      setXpAwarded(true);
    }
  };

  const handleReset = () => {
    setResult(null);
    setXpAwarded(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <button onClick={() => navigate('/patches')}
        className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
        ← Biblioteca
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900">{patch.nombre}</h1>
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${DIFF_COLORS[patch.dificultad]}`}>
            {DIFF_LABELS[patch.dificultad]}
          </span>
        </div>
        <p className="text-sm text-gray-500">{patch.descripcion}</p>
        <p className="text-xs text-indigo-600 mt-1">Aprende: {patch.ensena}</p>
      </div>

      {/* Pasos desde INIT */}
      {!result && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Pasos desde Init Program</h2>
          <ol className="space-y-3">
            {patch.pasos.map(paso => (
              <li key={paso.orden} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {paso.orden}
                </span>
                <div>
                  <p className="text-gray-800">{paso.instruccion}</p>
                  {paso.ayuda && (
                    <p className="text-xs text-amber-600 mt-0.5">💡 {paso.ayuda}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Botón evaluar / resultado */}
      {!result ? (
        <button onClick={handleEvaluate}
          className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors">
          Evaluar patch
        </button>
      ) : (
        <EvaluationPanel result={result} onReset={handleReset} />
      )}

      {/* Nota sobre MIDI */}
      {!result && (
        <p className="text-xs text-gray-400 text-center">
          Asegúrate de que el Minilogue esté conectado por MIDI antes de evaluar.
        </p>
      )}
    </div>
  );
}
