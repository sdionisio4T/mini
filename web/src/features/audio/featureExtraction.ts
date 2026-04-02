/**
 * Funciones puras de extracción de features de audio.
 * Operan sobre datos del AnalyserNode de Web Audio API.
 */

export function computeRms(timeDomain: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < timeDomain.length; i++) {
    sum += timeDomain[i] * timeDomain[i];
  }
  return Math.sqrt(sum / timeDomain.length);
}

export function computeSpectralCentroid(
  freqData: Float32Array,
  sampleRate: number
): number {
  const binCount = freqData.length;
  const nyquist = sampleRate / 2;
  let weightedSum = 0;
  let totalMag = 0;

  for (let i = 0; i < binCount; i++) {
    const mag = Math.pow(10, freqData[i] / 20); // dB -> lineal
    const freq = (i / binCount) * nyquist;
    weightedSum += freq * mag;
    totalMag += mag;
  }

  return totalMag > 0 ? weightedSum / totalMag : 0;
}

export function computeSpectralRolloff(
  freqData: Float32Array,
  sampleRate: number,
  threshold = 0.85
): number {
  const binCount = freqData.length;
  const nyquist = sampleRate / 2;
  const mags = Array.from(freqData).map(db => Math.pow(10, db / 20));
  const total = mags.reduce((s, v) => s + v, 0);
  const target = total * threshold;
  let cumSum = 0;
  for (let i = 0; i < binCount; i++) {
    cumSum += mags[i];
    if (cumSum >= target) return (i / binCount) * nyquist;
  }
  return nyquist;
}

export function computeSpectralFlatness(freqData: Float32Array): number {
  const mags = Array.from(freqData).map(db => Math.max(1e-10, Math.pow(10, db / 20)));
  const n = mags.length;
  const geometricMean = Math.exp(mags.reduce((s, v) => s + Math.log(v), 0) / n);
  const arithmeticMean = mags.reduce((s, v) => s + v, 0) / n;
  return arithmeticMean > 0 ? geometricMean / arithmeticMean : 0;
}

export function computeBandEnergy(
  freqData: Float32Array,
  sampleRate: number
): { low: number; mid: number; high: number } {
  const nyquist = sampleRate / 2;
  const binCount = freqData.length;
  const toIdx = (hz: number) => Math.round((hz / nyquist) * binCount);

  const lowEnd = toIdx(300);
  const midEnd = toIdx(3000);

  let low = 0, mid = 0, high = 0;
  for (let i = 0; i < binCount; i++) {
    const mag = Math.pow(10, freqData[i] / 20);
    if (i < lowEnd) low += mag;
    else if (i < midEnd) mid += mag;
    else high += mag;
  }
  const total = low + mid + high || 1;
  return { low: low / total, mid: mid / total, high: high / total };
}

/** Estima frecuencia de modulación en series de RMS (0.1–20 Hz aprox.) */
export function estimateModulationRate(
  series: number[],
  sampleIntervalMs: number
): { rateHz: number; depth: number } {
  if (series.length < 10) return { rateHz: 0, depth: 0 };

  const mean = series.reduce((s, v) => s + v, 0) / series.length;
  const centered = series.map(v => v - mean);

  // Autocorrelación simple para encontrar el periodo dominante
  let bestLag = 0;
  let bestCorr = -Infinity;
  const maxLag = Math.floor(series.length / 2);

  for (let lag = 2; lag < maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < series.length - lag; i++) {
      corr += centered[i] * centered[i + lag];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  const periodMs = bestLag * sampleIntervalMs;
  const rateHz = periodMs > 0 ? 1000 / periodMs : 0;
  const depth = Math.max(...series) - Math.min(...series);

  return { rateHz, depth };
}
