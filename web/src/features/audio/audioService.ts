import {
  computeRms,
  computeSpectralCentroid,
  computeSpectralRolloff,
  computeSpectralFlatness,
  computeBandEnergy,
  estimateModulationRate,
} from './featureExtraction';
import type { AudioDevice, AudioFeatures } from './audioTypes';

const FFT_SIZE = 2048;
const SAMPLE_INTERVAL_MS = 50; // 20 Hz de muestreo de features
const HISTORY_SIZE = 200;      // ~10 segundos

type FeaturesCallback = (f: AudioFeatures) => void;

class AudioService {
  private ctx: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private callbacks: FeaturesCallback[] = [];

  private rmsHistory: number[] = [];
  private centroidHistory: number[] = [];

  isSupported(): boolean {
    return !!(navigator.mediaDevices?.getUserMedia);
  }

  async listInputs(): Promise<AudioDevice[]> {
    // Necesitamos permisos primero para ver labels
    await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop()));
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter(d => d.kind === 'audioinput')
      .map(d => ({ deviceId: d.deviceId, label: d.label || `Micrófono ${d.deviceId.slice(0, 6)}` }));
  }

  async connect(deviceId?: string): Promise<boolean> {
    try {
      this.disconnect();
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.ctx = new AudioContext();
      this.source = this.ctx.createMediaStreamSource(this.stream);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = FFT_SIZE;
      this.analyser.smoothingTimeConstant = 0.6;
      this.source.connect(this.analyser);

      this.startExtractionLoop();
      return true;
    } catch {
      return false;
    }
  }

  disconnect(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.stream?.getTracks().forEach(t => t.stop());
    this.source?.disconnect();
    this.ctx?.close();
    this.ctx = null;
    this.source = null;
    this.analyser = null;
    this.stream = null;
    this.rmsHistory = [];
    this.centroidHistory = [];
  }

  onFeatures(cb: FeaturesCallback): () => void {
    this.callbacks.push(cb);
    return () => { this.callbacks = this.callbacks.filter(c => c !== cb); };
  }

  getLatestFeatures(): AudioFeatures | null {
    return this._lastFeatures;
  }

  private _lastFeatures: AudioFeatures | null = null;

  private startExtractionLoop(): void {
    if (!this.analyser || !this.ctx) return;
    const freqData = new Float32Array(this.analyser.frequencyBinCount);
    const timeData = new Float32Array(this.analyser.fftSize);

    this.intervalId = setInterval(() => {
      if (!this.analyser || !this.ctx) return;
      this.analyser.getFloatFrequencyData(freqData);
      this.analyser.getFloatTimeDomainData(timeData);

      const sr = this.ctx.sampleRate;
      const rms = computeRms(timeData);
      const centroid = computeSpectralCentroid(freqData, sr);
      const rolloff = computeSpectralRolloff(freqData, sr);
      const flatness = computeSpectralFlatness(freqData);
      const bands = computeBandEnergy(freqData, sr);

      this.rmsHistory = [...this.rmsHistory, rms].slice(-HISTORY_SIZE);
      this.centroidHistory = [...this.centroidHistory, centroid].slice(-HISTORY_SIZE);

      const rmsModulation = estimateModulationRate(this.rmsHistory, SAMPLE_INTERVAL_MS);
      const centroidModulation = estimateModulationRate(this.centroidHistory, SAMPLE_INTERVAL_MS);

      const features: AudioFeatures = {
        tsStartMs: performance.now(),
        windowMs: SAMPLE_INTERVAL_MS,
        sampleRate: sr,
        level: {
          rmsAvg: rms,
          rmsPeak: Math.max(...Array.from(timeData).map(Math.abs)),
          clippingDetected: rms > 0.95,
          noiseFloorEstimate: 0.01,
        },
        timbre: {
          spectralCentroidHz: centroid,
          spectralRolloffHz: rolloff,
          spectralFlatness: flatness,
          bandEnergy: bands,
        },
        envelope: {},
        modulation: {
          rmsModRateHz: rmsModulation.rateHz,
          rmsModDepth: rmsModulation.depth,
          centroidModRateHz: centroidModulation.rateHz,
          centroidModDepth: centroidModulation.depth,
        },
      };

      this._lastFeatures = features;
      this.callbacks.forEach(cb => cb(features));
    }, SAMPLE_INTERVAL_MS);
  }
}

export const audioService = new AudioService();
