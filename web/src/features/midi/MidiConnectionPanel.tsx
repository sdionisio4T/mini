import { useEffect, useState } from 'react';
import { midiService } from './midiService';
import { useMidiStore } from './midiStore';
import { eventBus, EVENTS } from '../../lib/events/eventBus';
import type { MidiDevice, MidiMessage } from './midiTypes';
import { useSynthStore } from '../synth-ui/synthStore';

const CC_TO_CONTROL_ID: Record<number, string> = {
  43: 'CUTOFF',
  44: 'RESONANCE',
  45: 'EG_INT',
  24: 'LFO_RATE',
  26: 'LFO_INT',
  18: 'VCO1_SHAPE',
  19: 'VCO2_SHAPE',
  28: 'FX_TIME',
  29: 'FX_DEPTH',
};

export function MidiConnectionPanel() {
  const { status, inputs, outputs, selectedInputId, selectedOutputId,
    setStatus, setDevices, setSelected, addMessage } = useMidiStore();
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!midiService.isSupported()) {
      setIsSupported(false);
      setStatus('unsupported');
      return;
    }

    const unsubMsg = eventBus.on<MidiMessage>(EVENTS.MIDI_MESSAGE, (msg) => {
      addMessage(msg);
    });

    const unsubCC = eventBus.on<MidiMessage>(EVENTS.MIDI_CC, (msg) => {
      const controlId = CC_TO_CONTROL_ID[msg.ccNumber ?? -1];
      if (!controlId) return;
      useSynthStore.getState().updateCC(controlId, msg.ccValue ?? 0);
    });

    const unsubConn = eventBus.on<unknown>(EVENTS.MIDI_CONNECTED, (payload) => {
      const p = payload as Partial<{ inputs: MidiDevice[]; outputs: MidiDevice[] }> | undefined;
      if (p?.inputs && p?.outputs) {
        setDevices(p.inputs, p.outputs);
      }
    });

    return () => { unsubMsg(); unsubCC(); unsubConn(); };
  }, []);

  const handleRequestAccess = async () => {
    setStatus('connecting');
    const ok = await midiService.requestAccess();
    if (ok) {
      const { inputs, outputs } = midiService.getDevices();
      setDevices(inputs, outputs);
      setStatus('disconnected');
    } else {
      setStatus('error');
    }
  };

  const handleConnect = () => {
    if (!selectedInputId) return;
    const ok = midiService.connect(selectedInputId, selectedOutputId ?? undefined);
    if (ok) {
      setStatus('connected');
      eventBus.emit(EVENTS.MIDI_CONNECTED, { inputId: selectedInputId });
    }
  };

  const handleDisconnect = () => {
    midiService.disconnect();
    setStatus('disconnected');
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
        <p className="font-semibold text-red-700">⚠ WebMIDI no está disponible en este navegador.</p>
        <p className="text-red-600 mt-1">Usa <strong>Chrome</strong> o <strong>Edge</strong> para conectar tu Minilogue XD.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Conexión MIDI</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          status === 'connected' ? 'bg-green-100 text-green-700' :
          status === 'error' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-500'
        }`}>
          {status === 'connected' ? '● Conectado' :
           status === 'connecting' ? '○ Conectando...' :
           status === 'error' ? '● Error' : '○ Desconectado'}
        </span>
      </div>

      {inputs.length === 0 ? (
        <button onClick={handleRequestAccess}
          className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors">
          Conectar MIDI
        </button>
      ) : (
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Entrada MIDI</label>
            <select
              value={selectedInputId ?? ''}
              onChange={(e) => setSelected(e.target.value || null, selectedOutputId)}
              className="w-full border border-gray-200 rounded-md text-sm px-3 py-1.5 bg-white">
              <option value="">Seleccionar dispositivo…</option>
              {inputs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          {outputs.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Salida MIDI (opcional)</label>
              <select
                value={selectedOutputId ?? ''}
                onChange={(e) => setSelected(selectedInputId, e.target.value || null)}
                className="w-full border border-gray-200 rounded-md text-sm px-3 py-1.5 bg-white">
                <option value="">Sin salida</option>
                {outputs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-2">
            {status !== 'connected' ? (
              <button onClick={handleConnect} disabled={!selectedInputId}
                className="flex-1 bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors">
                Conectar
              </button>
            ) : (
              <button onClick={handleDisconnect}
                className="flex-1 bg-gray-100 text-gray-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
                Desconectar
              </button>
            )}
          </div>
        </div>
      )}

      {status !== 'connected' && inputs.length === 0 && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded p-2">
          💡 Recomendado: <strong>Chrome</strong> o <strong>Edge</strong> para soporte completo de WebMIDI.
        </p>
      )}
    </div>
  );
}
