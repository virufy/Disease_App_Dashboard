/**
 * PLACEHOLDER risk scoring — there is no AI model yet.
 *
 * Every risk value in the app flows through getPlaceholderResult() so the real
 * Virufy screening model drops in behind this one interface with zero UI change.
 * The score is DETERMINISTIC (seeded from the submission id), so a given record
 * always shows the same tier and the demo never flickers on reload.
 *
 * This is labeled "preview" everywhere it surfaces in the UI. It is NOT a
 * clinical result.
 */
import { RiskTier } from "./types";
import { Submission } from "./submissions";

export interface ScreeningResult {
  submissionId: string;
  riskScore: number; // 0..1
  riskTier: RiskTier;
}

// deterministic 0..1 from a string seed (mulberry-ish)
const seededUnit = (seed: string): number => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
};

const tierForScore = (score: number): RiskTier => {
  if (score >= 0.85) return "critical";
  if (score >= 0.68) return "high";
  if (score >= 0.48) return "elevated";
  if (score >= 0.26) return "moderate";
  return "low";
};

/**
 * TODO: replace with real model output.
 * Placeholder only — biased slightly by reported symptoms so it looks plausible
 * in the demo, but it is not a clinical inference.
 */
export const getPlaceholderResult = (submission: Submission): ScreeningResult => {
  const base = seededUnit(submission.id);
  const symptomBias = Math.min(0.35, submission.symptoms.filter((s) => s !== "none").length * 0.12);
  const riskScore = Math.min(0.99, submission.sick ? base * 0.65 + symptomBias + 0.15 : base * 0.5);
  return {
    submissionId: submission.id,
    riskScore,
    riskTier: tierForScore(riskScore),
  };
};
