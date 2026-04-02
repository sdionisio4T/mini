import { useSynthStore } from '../synthStore';

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = (value / 127) * 100;
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="w-full h-24 bg-gray-100 rounded-lg relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-150"
          style={{ height: `${pct}%`, background: color }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 z-10">
          {value}
        </span>
      </div>
    </div>
  );
}

function timeToMs(value: number): string {
  // FX TIME: 0-127 → ~10ms–4s (delay) / 0.5–30s (reverb) aprox
  const ms = 10 + (value / 127) * 3990;
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function FxPanel() {
  const fxTime = useSynthStore(s => s.getCCValue('FX_TIME'));
  const fxDepth = useSynthStore(s => s.getCCValue('FX_DEPTH'));

  const depthLabel =
    fxDepth < 20 ? 'Muy seco' :
    fxDepth < 50 ? 'Ligero' :
    fxDepth < 90 ? 'Notorio' :
    'Muy húmedo';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Efectos (FX)</h3>

      <div className="flex gap-4">
        <Bar label="FX TIME" value={fxTime} color="rgba(16,185,129,0.6)" />
        <Bar label="FX DEPTH" value={fxDepth} color="rgba(245,158,11,0.6)" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-center">
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
          <p className="text-xs text-gray-400">Tiempo estimado</p>
          <p className="font-bold text-emerald-700 text-sm">{timeToMs(fxTime)}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-2">
          <p className="text-xs text-gray-400">Mezcla</p>
          <p className="font-bold text-amber-700 text-sm">{depthLabel}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Mueve FX TIME y FX DEPTH en el panel del Minilogue
      </p>
    </div>
  );
}
