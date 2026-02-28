import { useSynthStore } from '../synthStore';

interface FilterPanelProps {
  highlightParam?: 'CUTOFF' | 'RESONANCE' | null;
  showGuide?: boolean;
}

function KnobDisplay({ label, value, highlight, description }: {
  label: string; value: number; highlight?: boolean; description: string;
}) {
  const pct = (value / 127) * 100;
  return (
    <div className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
      highlight ? 'bg-indigo-50 ring-2 ring-indigo-400 ring-offset-1 animate-pulse' : 'bg-gray-50'
    }`}>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
          <circle cx="24" cy="24" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
          <circle cx="24" cy="24" r="18" fill="none" stroke={highlight ? '#6366f1' : '#3b82f6'}
            strokeWidth="4" strokeDasharray={`${pct * 1.13} 113`} strokeLinecap="round"/>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
          {value}
        </span>
      </div>
      <p className="text-center text-xs text-gray-500 max-w-[80px] leading-tight">{description}</p>
    </div>
  );
}

export function FilterPanel({ highlightParam, showGuide }: FilterPanelProps) {
  const cutoff = useSynthStore(s => s.getCCValue('CUTOFF'));
  const resonance = useSynthStore(s => s.getCCValue('RESONANCE'));

  // Descripción visual del cutoff
  const cutoffDesc =
    cutoff < 30 ? 'Muy oscuro — graves' :
    cutoff < 60 ? 'Oscuro — cálido' :
    cutoff < 90 ? 'Medio — equilibrado' :
    cutoff < 110 ? 'Brillante — armónicos' :
      'Abierto — todo el brillo';

  const resonanceDesc =
    resonance < 20 ? 'Sin énfasis' :
    resonance < 50 ? 'Ligero énfasis' :
    resonance < 80 ? 'Pico notorio' :
      'Auto-oscilación';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Filtro (VCF)</h3>
        {showGuide && highlightParam && (
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full animate-pulse">
            ← Mueve este knob
          </span>
        )}
      </div>

      {/* Visualización del espectro */}
      <div className="h-16 bg-gray-900 rounded-md mb-3 overflow-hidden relative">
        <div className="absolute inset-0 flex items-end px-1 gap-0.5">
          {Array.from({ length: 40 }, (_, i) => {
            const freq = i / 40;
            const cutoffNorm = cutoff / 127;
            const resonNorm = resonance / 127;
            const isNearCutoff = Math.abs(freq - cutoffNorm) < 0.04;
            let height = freq <= cutoffNorm ? 0.6 + Math.random() * 0.3 : 0.1 + Math.random() * 0.1;
            if (isNearCutoff) height = Math.min(1, height + resonNorm * 0.6);
            return (
              <div key={i} className="flex-1 rounded-t transition-all duration-100"
                style={{
                  height: `${height * 100}%`,
                  background: isNearCutoff && resonNorm > 0.3
                    ? 'rgb(239,68,68)'
                    : `rgba(99,102,241,${0.4 + height * 0.5})`
                }} />
            );
          })}
        </div>
        <div className="absolute bottom-1 left-2 text-gray-500 text-xs">graves</div>
        <div className="absolute bottom-1 right-2 text-gray-500 text-xs">agudos</div>
      </div>

      <div className="flex justify-around">
        <KnobDisplay label="CUTOFF" value={cutoff}
          highlight={highlightParam === 'CUTOFF'}
          description={cutoffDesc} />
        <KnobDisplay label="RESONANCE" value={resonance}
          highlight={highlightParam === 'RESONANCE'}
          description={resonanceDesc} />
      </div>
    </div>
  );
}
