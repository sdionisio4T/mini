import { useState, useEffect } from 'react';
import { audioService } from './audioService';
import { useAudioStore } from './audioStore';

function SignalMeter({ rms, clipping }: { rms: number; clipping: boolean }) {
  const bars = 20;
  const filled = Math.round(rms * bars * 10); // amplificamos visualmente
  return (
    <div className="flex gap-0.5 items-end h-6">
      {Array.from({ length: bars }, (_, i) => (
        <div key={i} className={`w-1.5 rounded-sm transition-all duration-75 ${
          i < filled
            ? clipping
              ? 'bg-red-500'
              : i > bars * 0.75
                ? 'bg-yellow-400'
                : 'bg-green-500'
            : 'bg-gray-200'
        }`} style={{ height: `${40 + i * 3}%` }} />
      ))}
    </div>
  );
}

export function AudioInputPanel() {
  const { state, devices, selectedDeviceId, latestFeatures, setState, setDevices, setSelectedDeviceId, setLatestFeatures } = useAudioStore();
  const [error, setError] = useState<string | null>(null);

  if (!audioService.isSupported()) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
        Tu navegador no soporta captura de audio. Usa Chrome o Edge.
      </div>
    );
  }

  const handleConnect = async () => {
    setState('requesting');
    setError(null);
    try {
      const devs = await audioService.listInputs();
      setDevices(devs);
      const deviceId = selectedDeviceId ?? devs[0]?.deviceId;
      const ok = await audioService.connect(deviceId ?? undefined);
      if (ok) {
        setState('connected');
        audioService.onFeatures(setLatestFeatures);
      } else {
        setState('error');
        setError('No se pudo conectar al dispositivo de audio.');
      }
    } catch (e) {
      setState('error');
      setError('Permiso de audio denegado.');
    }
  };

  const handleDisconnect = () => {
    audioService.disconnect();
    setState('idle');
  };

  useEffect(() => {
    return () => { audioService.disconnect(); };
  }, []);

  const rms = latestFeatures?.level.rmsAvg ?? 0;
  const clipping = latestFeatures?.level.clippingDetected ?? false;
  const centroid = latestFeatures?.timbre.spectralCentroidHz ?? 0;
  const connected = state === 'connected';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">Entrada de audio</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          connected ? 'bg-green-100 text-green-700' :
          state === 'error' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-400'
        }`}>
          {connected ? '● Activo' : state === 'requesting' ? 'Conectando…' : '○ Inactivo'}
        </span>
      </div>

      {!connected && (
        <div className="space-y-2 mb-3">
          {devices.length > 0 && (
            <select
              value={selectedDeviceId ?? ''}
              onChange={e => setSelectedDeviceId(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-400"
            >
              {devices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
              ))}
            </select>
          )}
          <button
            onClick={handleConnect}
            disabled={state === 'requesting'}
            className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {state === 'requesting' ? 'Solicitando permiso…' : 'Conectar interfaz de audio'}
          </button>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <p className="text-xs text-gray-400 text-center">
            Conecta la salida del Minilogue a tu interfaz de audio
          </p>
        </div>
      )}

      {connected && (
        <div className="space-y-3">
          <SignalMeter rms={rms} clipping={clipping} />
          {clipping && (
            <p className="text-xs text-red-600 font-medium">⚠️ Señal demasiado fuerte — baja el volumen de la interfaz</p>
          )}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-400">RMS</p>
              <p className="font-bold text-gray-700">{(rms * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-400">Centroide</p>
              <p className="font-bold text-gray-700">
                {centroid < 1000 ? `${Math.round(centroid)} Hz` : `${(centroid / 1000).toFixed(1)} kHz`}
              </p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-400">Brillo</p>
              <p className="font-bold text-gray-700">
                {centroid < 800 ? 'Oscuro' : centroid < 2000 ? 'Medio' : 'Brillante'}
              </p>
            </div>
          </div>
          <button onClick={handleDisconnect}
            className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">
            Desconectar
          </button>
        </div>
      )}
    </div>
  );
}
