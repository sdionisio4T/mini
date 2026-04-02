import { useSynthStore } from '../synthStore';

const SHAPES = ['Diente\nde sierra', 'Cuadrada', 'Triángulo'];

function ShapeSelector({ label, value }: { label: string; value: number }) {
  const idx = Math.floor((value / 128) * 3);
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="flex gap-1">
        {SHAPES.map((s, i) => (
          <div key={i} className={`flex flex-col items-center px-2 py-1.5 rounded-lg border text-center transition-all ${
            i === idx ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'border-gray-200 text-gray-400'
          }`}>
            <ShapeIcon type={i} active={i === idx} />
            <span className="text-xs mt-1 whitespace-pre-line leading-tight">{s}</span>
          </div>
        ))}
      </div>
      <span className="text-xs text-gray-400">CC: {value}</span>
    </div>
  );
}

function ShapeIcon({ type, active }: { type: number; active: boolean }) {
  const color = active ? '#6366f1' : '#d1d5db';
  if (type === 0) return (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <polyline points="0,14 0,2 14,2 14,14 14,2 28,2 28,14" fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
  if (type === 1) return (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <polyline points="0,14 0,2 14,2 14,14 14,2 28,2 28,14" fill="none" stroke={color} strokeWidth="1.5"
        strokeDasharray="0" />
      <rect x="0" y="2" width="14" height="12" fill="none" stroke={color} strokeWidth="1.5"/>
      <rect x="14" y="2" width="14" height="12" fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
  return (
    <svg width="28" height="16" viewBox="0 0 28 16">
      <polyline points="0,14 7,2 14,14 21,2 28,14" fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

export function OscillatorsPanel() {
  const vco1Shape = useSynthStore(s => s.getCCValue('VCO1_SHAPE'));
  const vco2Shape = useSynthStore(s => s.getCCValue('VCO2_SHAPE'));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Osciladores (VCO)</h3>
      <div className="grid grid-cols-2 gap-6">
        <ShapeSelector label="VCO 1 — Shape" value={vco1Shape} />
        <ShapeSelector label="VCO 2 — Shape" value={vco2Shape} />
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Mueve los knobs VCO1/VCO2 SHAPE en el Minilogue para ver el cambio
      </p>
    </div>
  );
}
