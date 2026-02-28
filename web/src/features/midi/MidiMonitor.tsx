import { useMidiStore } from './midiStore';

const TYPE_LABELS: Record<string, string> = {
  noteOn: '▶ Nota ON',
  noteOff: '◾ Nota OFF',
  cc: '≈ CC',
  other: '· Otro',
};

const TYPE_COLORS: Record<string, string> = {
  noteOn: 'text-green-600',
  noteOff: 'text-gray-500',
  cc: 'text-blue-600',
  other: 'text-gray-400',
};

export function MidiMonitor() {
  const { messages, clearMessages } = useMidiStore();

  if (messages.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-sm text-gray-400">
        <p>Sin mensajes MIDI todavía.</p>
        <p className="text-xs mt-1">Toca una tecla en el Minilogue para empezar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Monitor MIDI</span>
        <button onClick={clearMessages} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Limpiar
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto font-mono text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-center gap-3 px-4 py-1.5 border-b border-gray-50 hover:bg-gray-50">
            <span className="text-gray-300 w-12 shrink-0">
              {(msg.timestamp % 100000).toFixed(0).padStart(5, '0')}
            </span>
            <span className={`w-20 shrink-0 font-medium ${TYPE_COLORS[msg.type]}`}>
              {TYPE_LABELS[msg.type]}
            </span>
            <span className="text-gray-400 w-6 shrink-0">ch{msg.channel}</span>
            <span className="text-gray-700">
              {msg.type === 'noteOn' || msg.type === 'noteOff'
                ? `${msg.noteName} (${msg.note}) vel:${msg.velocity}`
                : msg.type === 'cc'
                ? `CC#${msg.ccNumber} = ${msg.ccValue}`
                : msg.data.join(' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
