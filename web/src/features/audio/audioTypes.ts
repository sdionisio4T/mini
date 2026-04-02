export interface AudioDevice {
  deviceId: string;
  label: string;
}

export type AudioConnectionState = 'idle' | 'requesting' | 'connected' | 'error' | 'unsupported';

export interface AudioFeatures {
  tsStartMs: number;
  windowMs: number;
  sampleRate: number;

  level: {
    rmsAvg: number;
    rmsPeak: number;
    clippingDetected: boolean;
    noiseFloorEstimate: number;
  };

  timbre: {
    spectralCentroidHz: number;
    spectralRolloffHz: number;
    spectralFlatness: number;
    bandEnergy: { low: number; mid: number; high: number };
  };

  envelope: {
    attackMs?: number;
    sustainLevel?: number;
    releaseMs?: number;
  };

  modulation: {
    rmsModRateHz?: number;
    rmsModDepth?: number;
    centroidModRateHz?: number;
    centroidModDepth?: number;
  };
}
