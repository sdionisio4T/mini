import { useState, useEffect, useRef } from 'react';
import { eventBus, EVENTS } from '../../../lib/events/eventBus';
import { db } from '../../../lib/storage/indexedDb';
import { courseEngine } from '../../course/courseEngine';
import { CONTROL_LIST, DEFAULT_CC_MAP } from './mappingModel';
import type { MidiMessage, MidiMapping } from '../midiTypes';
import type { ControlId } from '../../course/content/types';

type WizardState = 'idle' | 'listening' | 'confirm' | 'done';

interface CCCandidate { cc: number; count: number }

interface CalibrationWizardProps {
  onComplete?: (map: Record<ControlId, number>) => void;
}

export function CalibrationWizard({ onComplete }: CalibrationWizardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wizardState, setWizardState] = useState<WizardState>('idle');
  const [candidate, setCandidate] = useState<CCCandidate | null>(null);
  const [savedMap, setSavedMap] = useState<Partial<Record<ControlId, number>>>({});
  const [countdown, setCountdown] = useState(0);
  const countersRef = useRef<Record<number, number>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const control = CONTROL_LIST[currentIdx];
  const totalControls = CONTROL_LIST.length;

  useEffect(() => {
    // Cargar mappings existentes de DB al montar
    db.midi_mappings.toArray().then((rows) => {
      const map: Partial<Record<ControlId, number>> = {};
      for (const row of rows) {
        map[row.controlId as ControlId] = row.ccNumber;
      }
      setSavedMap(map);
    });
  }, []);

  const startListening = () => {
    countersRef.current = {};
    setCandidate(null);
    setWizardState('listening');
    setCountdown(5);

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopListening = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Encontrar el CC con mayor conteo
    const entries = Object.entries(countersRef.current);
    if (entries.length === 0) {
      setWizardState('idle');
      return;
    }
    const best = entries.reduce((a, b) => (Number(b[1]) > Number(a[1]) ? b : a));
    setCandidate({ cc: Number(best[0]), count: Number(best[1]) });
    setWizardState('confirm');
  };

  useEffect(() => {
    if (wizardState !== 'listening') return;
    const unsub = eventBus.on<MidiMessage>(EVENTS.MIDI_CC, (msg) => {
      const cc = msg.ccNumber!;
      countersRef.current[cc] = (countersRef.current[cc] ?? 0) + 1;
    });
    return unsub;
  }, [wizardState]);

  // Cleanup timer on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const confirmMapping = async () => {
    if (!candidate) return;
    const controlId = control.id;
    const ccNumber = candidate.cc;

    // Guardar en DB (reemplazar si ya existe)
    await db.midi_mappings.where('controlId').equals(controlId).delete();
    const mapping: MidiMapping = { controlId, ccNumber, deviceId: 'default', createdAt: Date.now() };
    await db.midi_mappings.add(mapping as MidiMapping & { id?: number });

    // Actualizar courseEngine
    courseEngine.updateCCMap(controlId, ccNumber);

    const newMap = { ...savedMap, [controlId]: ccNumber };
    setSavedMap(newMap);

    if (currentIdx < totalControls - 1) {
      setCurrentIdx(currentIdx + 1);
      setWizardState('idle');
      setCandidate(null);
    } else {
      setWizardState('done');
      onComplete?.(newMap as Record<ControlId, number>);
    }
  };

  const skipControl = () => {
    // Usar default del Implementation Chart
    const defaultCC = DEFAULT_CC_MAP[control.id];
    courseEngine.updateCCMap(control.id, defaultCC);
    const newMap = { ...savedMap, [control.id]: defaultCC };
    setSavedMap(newMap);

    if (currentIdx < totalControls - 1) {
      setCurrentIdx(currentIdx + 1);
      setWizardState('idle');
      setCandidate(null);
    } else {
      setWizardState('done');
      onComplete?.(newMap as Record<ControlId, number>);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setWizardState('idle');
    setCandidate(null);
    setSavedMap({});
  };

  if (wizardState === 'done') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="font-bold text-green-800 text-lg">Calibración completada</h3>
        <p className="text-green-600 text-sm mt-1">
          Los knobs están mapeados. Los paneles se actualizarán en tiempo real.
        </p>
        <button onClick={reset}
          className="mt-3 text-xs text-green-700 underline hover:text-green-900">
          Recalibrar desde cero
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Calibrar controles MIDI</h3>
        <span className="text-xs text-gray-400">{currentIdx + 1} / {totalControls}</span>
      </div>

      {/* Barra de progreso */}
      <div className="flex gap-1 mb-5">
        {CONTROL_LIST.map((c, i) => (
          <div key={c.id} className={`h-1.5 flex-1 rounded-full transition-all ${
            savedMap[c.id] !== undefined ? 'bg-green-500'
            : i === currentIdx ? 'bg-indigo-400'
            : 'bg-gray-200'
          }`} />
        ))}
      </div>

      {/* Control actual */}
      <div className="mb-4">
        <span className="inline-block text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full mb-2">
          {control.label}
        </span>
        <p className="text-sm text-gray-600">{control.hint}</p>
        {savedMap[control.id] !== undefined && (
          <p className="text-xs text-green-600 mt-1">
            Ya mapeado → CC#{savedMap[control.id]}
          </p>
        )}
      </div>

      {wizardState === 'idle' && (
        <div className="space-y-2">
          <button onClick={startListening}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors">
            Escuchar knob (5s)
          </button>
          <button onClick={skipControl}
            className="w-full text-gray-400 text-xs hover:text-gray-600 py-1">
            Usar default (CC#{DEFAULT_CC_MAP[control.id]}) y continuar
          </button>
        </div>
      )}

      {wizardState === 'listening' && (
        <div className="text-center py-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1 tabular-nums">{countdown}s</div>
          <p className="text-sm text-blue-700 animate-pulse">
            Mueve el knob <strong>{control.label}</strong> lentamente de mín a máx…
          </p>
        </div>
      )}

      {wizardState === 'confirm' && candidate && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <p className="text-sm text-amber-800">
              Detecté <strong>CC#{candidate.cc}</strong> ({candidate.count} eventos)
            </p>
            <p className="text-xs text-amber-600 mt-1">¿Es correcto?</p>
          </div>
          <div className="flex gap-2">
            <button onClick={confirmMapping}
              className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 transition-colors">
              ✓ Confirmar
            </button>
            <button onClick={() => setWizardState('idle')}
              className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
