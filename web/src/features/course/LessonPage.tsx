import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MODULES } from './content/modules';
import { courseEngine } from './courseEngine';
import { FilterPanel } from '../synth-ui/panels/FilterPanel';
import { MidiMonitor } from '../midi/MidiMonitor';
import { useProgressStore } from '../gamification/progressStore';
import type { Lesson, LessonStep } from './content/types';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { markStepCompleted, markLessonCompleted, addXP, isStepCompleted } = useProgressStore();

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedNow, setCompletedNow] = useState<Set<string>>(new Set());
  const [showAyuda, setShowAyuda] = useState(false);
  const [xpToast, setXpToast] = useState<number | null>(null);

  const lesson: Lesson | undefined = MODULES
    .flatMap(m => m.lecciones)
    .find(l => l.id === lessonId);

  const currentStep: LessonStep | undefined = lesson?.pasos[currentStepIdx];

  useEffect(() => {
    if (!lesson) return;

    // Encontrar primer paso no completado
    const firstIncomplete = lesson.pasos.findIndex(p => !isStepCompleted(p.id));
    const desiredIdx = firstIncomplete >= 0 ? firstIncomplete : 0;
    setCurrentStepIdx((prev) => (prev === desiredIdx ? prev : desiredIdx));

    courseEngine.start((stepId, xp) => {
      markStepCompleted(stepId);
      addXP(xp);
      setCompletedNow(prev => new Set([...prev, stepId]));
      setXpToast(xp);
      setTimeout(() => setXpToast(null), 2000);

      setCurrentStepIdx(prev => {
        const next = prev + 1;
        if (next < lesson.pasos.length) {
          const nextStep = lesson.pasos[next];
          if (nextStep.condicion.tipo !== 'manual') {
            courseEngine.setActiveStep(nextStep);
          }
          return next;
        } else {
          markLessonCompleted(lesson.id);
          courseEngine.stop();
        }
        return prev;
      });
    });

    if (currentStep && currentStep.condicion.tipo !== 'manual') {
      courseEngine.setActiveStep(currentStep);
    }

    return () => courseEngine.stop();
  }, [lesson, isStepCompleted, markStepCompleted, addXP, markLessonCompleted, currentStep]);

  const handleManualComplete = () => {
    if (!currentStep) return;
    markStepCompleted(currentStep.id);
    addXP(currentStep.xp);
    setCompletedNow(prev => new Set([...prev, currentStep.id]));
    setXpToast(currentStep.xp);
    setTimeout(() => setXpToast(null), 2000);
    setShowAyuda(false);

    const next = currentStepIdx + 1;
    if (next < (lesson?.pasos.length ?? 0)) {
      const nextStep = lesson!.pasos[next];
      setCurrentStepIdx(next);
      if (nextStep.condicion.tipo !== 'manual') {
        courseEngine.setActiveStep(nextStep);
      }
    } else {
      markLessonCompleted(lesson!.id);
      courseEngine.stop();
    }
  };

  const highlightParam = (): 'CUTOFF' | 'RESONANCE' | null => {
    if (!currentStep) return null;
    const c = currentStep.condicion;
    if ((c.tipo === 'midi_cc' || c.tipo === 'midi_cc_range') && c.controlId === 'CUTOFF') return 'CUTOFF';
    if ((c.tipo === 'midi_cc' || c.tipo === 'midi_cc_range') && c.controlId === 'RESONANCE') return 'RESONANCE';
    return null;
  };

  const allDone = lesson ? lesson.pasos.every(p => isStepCompleted(p.id) || completedNow.has(p.id)) : false;

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Lección no encontrada.</p>
        <button onClick={() => navigate('/curso')} className="mt-4 text-indigo-600 underline text-sm">
          Volver al curso
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Toast XP */}
      {xpToast !== null && (
        <div className="fixed top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-bounce z-50">
          +{xpToast} XP ✨
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/curso')} className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1">
          ← Volver al curso
        </button>
        <h1 className="text-xl font-bold text-gray-900">{lesson.titulo}</h1>
        <p className="text-gray-500 text-sm mt-1">{lesson.objetivo}</p>
        <div className="flex gap-1 mt-3">
          {lesson.pasos.map((paso, i) => (
            <div key={paso.id} className={`h-1.5 flex-1 rounded-full transition-all ${
              isStepCompleted(paso.id) || completedNow.has(paso.id)
                ? 'bg-green-500' : i === currentStepIdx ? 'bg-indigo-400' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </div>

      {allDone ? (
        <div className="text-center py-10 bg-green-50 rounded-xl border border-green-200">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-green-700">¡Lección completada!</h2>
          <p className="text-green-600 text-sm mt-1">{lesson.titulo}</p>
          <button onClick={() => navigate('/curso')}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Continuar
          </button>
        </div>
      ) : currentStep ? (
        <div className="space-y-4">
          {/* Paso actual */}
          <div className="bg-white border border-indigo-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                Paso {currentStepIdx + 1} de {lesson.pasos.length}
              </span>
              <span className="text-xs text-gray-400">+{currentStep.xp} XP</span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed mb-4">{currentStep.instruccion}</p>

            {currentStep.condicion.tipo === 'manual' ? (
              <button onClick={handleManualComplete}
                className="w-full bg-indigo-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-indigo-700 transition-colors">
                ✓ Listo, continuar
              </button>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
                ⏳ Esperando que lo hagas en el Minilogue…
              </div>
            )}

            {currentStep.ayuda && (
              <div className="mt-3">
                <button onClick={() => setShowAyuda(!showAyuda)}
                  className="text-xs text-gray-400 hover:text-gray-600 underline">
                  {showAyuda ? 'Ocultar ayuda' : '¿Necesitas ayuda?'}
                </button>
                {showAyuda && (
                  <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    💡 {currentStep.ayuda}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Panel del filtro (si aplica) */}
          {(lesson.modulo === 1 || highlightParam()) && (
            <FilterPanel highlightParam={highlightParam()} showGuide />
          )}

          {/* Monitor MIDI */}
          <MidiMonitor />
        </div>
      ) : null}
    </div>
  );
}
