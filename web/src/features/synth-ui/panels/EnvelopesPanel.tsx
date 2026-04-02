import { useSynthStore } from '../synthStore';

function ADSRGraph({ attack, decay, sustain, release }: {
  attack: number; decay: number; sustain: number; release: number;
}) {
  // Normalizar a 0-1
  const a = attack / 127;
  const d = decay / 127;
  const s = sustain / 127;
  const r = release / 127;

  // Ancho de cada fase (en porcentaje del SVG)
  const W = 200; const H = 60;
  const aW = 30 + a * 40;
  const dW = 20 + d * 30;
  const sW = 40;
  const rW = 20 + r * 40;
  const total = aW + dW + sW + rW;
  const scale = W / total;

  const x0 = 0;
  const x1 = x0 + aW * scale;
  const x2 = x1 + dW * scale;
  const x3 = x2 + sW * scale;
  const x4 = x3 + rW * scale;
  const yTop = 4;
  const yBot = H - 4;
  const ySus = yBot - (s * (yBot - yTop));

  const d_path = `M${x0},${yBot} L${x1},${yTop} L${x2},${ySus} L${x3},${ySus} L${x4},${yBot}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 60 }}>
      <path d={d_path} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round"/>
      <path d={`${d_path} L${x0},${yBot}`} fill="rgba(99,102,241,0.08)"/>
      {/* Labels */}
      {[
        { x: x1 / 2, label: 'A' },
        { x: (x1 + x2) / 2, label: 'D' },
        { x: (x2 + x3) / 2, label: 'S' },
        { x: (x3 + x4) / 2, label: 'R' },
      ].map(({ x, label }) => (
        <text key={label} x={x} y={H - 1} textAnchor="middle"
          className="fill-gray-400" style={{ fontSize: 9 }}>{label}</text>
      ))}
    </svg>
  );
}

function Knob({ label, value }: { label: string; value: number }) {
  const pct = (value / 127) * 100;
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          <circle cx="20" cy="20" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3.5"/>
          <circle cx="20" cy="20" r="15" fill="none" stroke="#6366f1"
            strokeWidth="3.5" strokeDasharray={`${pct * 0.942} 94.2`} strokeLinecap="round"/>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
          {value}
        </span>
      </div>
    </div>
  );
}

// EG_INT tiene rango -63..+63 (CC 0-127, centro=64)
function EGIntDisplay({ value }: { value: number }) {
  const signed = value - 64;
  const label = signed === 0 ? '0' : signed > 0 ? `+${signed}` : `${signed}`;
  const pct = (value / 127) * 100;
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500">EG INT</span>
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          <circle cx="20" cy="20" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3.5"/>
          <circle cx="20" cy="20" r="15" fill="none" stroke={signed >= 0 ? '#6366f1' : '#ef4444'}
            strokeWidth="3.5" strokeDasharray={`${pct * 0.942} 94.2`} strokeLinecap="round"/>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
          {label}
        </span>
      </div>
    </div>
  );
}

export function EnvelopesPanel() {
  const egInt = useSynthStore(s => s.getCCValue('EG_INT'));

  // Sin CC directo para ADSR en el Minilogue XD vía knob-to-CC por defecto,
  // mostramos valores de ejemplo / demo
  const attack = 30;
  const decay = 50;
  const sustain = 80;
  const release = 40;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Envolvente (EG)</h3>

      <ADSRGraph attack={attack} decay={decay} sustain={sustain} release={release} />

      <div className="flex justify-around mt-4">
        <Knob label="ATTACK" value={attack} />
        <Knob label="DECAY" value={decay} />
        <Knob label="SUSTAIN" value={sustain} />
        <Knob label="RELEASE" value={release} />
        <EGIntDisplay value={egInt} />
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        EG INT refleja el knob físico. ADSR se muestra como ejemplo de forma de envolvente.
      </p>
    </div>
  );
}
