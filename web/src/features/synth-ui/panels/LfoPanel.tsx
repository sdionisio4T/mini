import { useSynthStore } from '../synthStore';

function LfoWaveform({ rate, intensity }: { rate: number; intensity: number }) {
  const cycles = 1 + Math.floor((rate / 127) * 4);
  const amp = 8 + (intensity / 127) * 20;
  const W = 200; const H = 60; const cy = H / 2;
  const step = W / (cycles * 40);
  const points = Array.from({ length: cycles * 40 + 1 }, (_, i) => {
    const x = i * step;
    const y = cy - Math.sin((i / 40) * Math.PI * 2) * amp;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 56 }}>
      <line x1="0" y1={cy} x2={W} y2={cy} stroke="#e5e7eb" strokeWidth="1"/>
      <polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="2"/>
    </svg>
  );
}

function Knob({ label, value, color = '#8b5cf6' }: { label: string; value: number; color?: string }) {
  const pct = (value / 127) * 100;
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          <circle cx="20" cy="20" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3.5"/>
          <circle cx="20" cy="20" r="15" fill="none" stroke={color}
            strokeWidth="3.5" strokeDasharray={`${pct * 0.942} 94.2`} strokeLinecap="round"/>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
          {value}
        </span>
      </div>
    </div>
  );
}

function rateToHz(rate: number): string {
  // LFO rate 0–127 → approx 0.05–100 Hz logarítmico
  const hz = 0.05 * Math.pow(2000, rate / 127);
  if (hz < 1) return `${hz.toFixed(2)} Hz`;
  if (hz < 10) return `${hz.toFixed(1)} Hz`;
  return `${Math.round(hz)} Hz`;
}

export function LfoPanel() {
  const rate = useSynthStore(s => s.getCCValue('LFO_RATE'));
  const intensity = useSynthStore(s => s.getCCValue('LFO_INT'));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3">LFO (Modulación lenta)</h3>

      <div className="bg-gray-900 rounded-md p-2 mb-4">
        <LfoWaveform rate={rate} intensity={intensity} />
      </div>

      <div className="flex justify-around">
        <Knob label="RATE" value={rate} />
        <Knob label="INTENSITY" value={intensity} />
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-gray-500">Velocidad</span>
          <span className="text-sm font-bold text-purple-600">{rateToHz(rate)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Mueve LFO RATE e INT en el Minilogue para ver la onda de modulación
      </p>
    </div>
  );
}
