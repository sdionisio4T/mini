import { CC_TOLERANCE } from './patchTypes';
import type { PatchSpec, CCTarget } from './patchTypes';

export interface Mismatch {
  controlId: string;
  expected: number;
  got: number;
  diff: number;
  required: boolean;
  hint: string;
}

export interface EvaluationResult {
  score: number;           // 0–100
  verdict: 'PASS' | 'NEEDS_WORK';
  mismatches: Mismatch[];
  matched: CCTarget[];
  totalTargets: number;
}

const CONTROL_HINTS: Record<string, string> = {
  CUTOFF:     'Ajusta el knob CUTOFF en la sección FILTER',
  RESONANCE:  'Ajusta el knob RESONANCE en la sección FILTER',
  EG_INT:     'Ajusta EG INT — está encima del CUTOFF',
  LFO_RATE:   'Ajusta LFO RATE en la sección LFO',
  LFO_INT:    'Ajusta LFO INTENSITY en la sección LFO',
  VCO1_SHAPE: 'Ajusta el knob SHAPE de VCO1',
  VCO2_SHAPE: 'Ajusta el knob SHAPE de VCO2',
  FX_TIME:    'Ajusta FX TIME en la sección FX',
  FX_DEPTH:   'Ajusta FX DEPTH en la sección FX',
};

export function evaluatePatch(
  spec: PatchSpec,
  ccValues: Record<string, number>
): EvaluationResult {
  const mismatches: Mismatch[] = [];
  const matched: CCTarget[] = [];
  let requiredTotal = 0;
  let requiredPassed = 0;

  for (const target of spec.targets) {
    const got = ccValues[target.controlId] ?? 64;
    const tolerance = target.tolerance ?? CC_TOLERANCE;
    const diff = Math.abs(got - target.value);
    const pass = diff <= tolerance;

    if (target.required) {
      requiredTotal++;
      if (pass) requiredPassed++;
    }

    if (pass) {
      matched.push(target);
    } else {
      const dir = got < target.value ? 'Súbelo' : 'Bájalo';
      mismatches.push({
        controlId: target.controlId,
        expected: target.value,
        got,
        diff,
        required: target.required,
        hint: `${CONTROL_HINTS[target.controlId] ?? target.controlId} — ${dir} (actual: ${got}, objetivo: ${target.value})`,
      });
    }
  }

  // Score: peso doble a requeridos
  const allTargets = spec.targets.length;
  const optionalPassed = matched.filter(t => !t.required).length;
  const optionalTotal = allTargets - requiredTotal;

  const score = allTargets === 0 ? 100 : Math.round(
    (requiredPassed * 0.7 / Math.max(requiredTotal, 1) +
     optionalPassed * 0.3 / Math.max(optionalTotal, 1)) * 100
  );

  return {
    score,
    verdict: score >= 80 && requiredPassed === requiredTotal ? 'PASS' : 'NEEDS_WORK',
    mismatches,
    matched,
    totalTargets: allTargets,
  };
}
