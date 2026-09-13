/**
 * Pure derivations from REAL submissions. Everything a panel shows about volume,
 * location and symptoms is computed here from actual records. Risk is pulled
 * through the isolated placeholder (labeled "preview" in the UI).
 */
import { Submission, FOCUS_LOCATIONS } from "./submissions";
import { getPlaceholderResult } from "./risk";
import { RiskTier, ScenarioKey, SeasonKey } from "./types";
import { RISK_TIER_MAP } from "./geo";

export interface LocationAgg {
  id: string;
  count: number;
  sick: number;
  sickRate: number;
  highRisk: number; // preview
  highRiskRate: number; // preview
  tier: RiskTier; // preview
  lastArrival: number;
  trend: number[];
}

const tierFromHighRate = (rate: number): RiskTier => {
  if (rate >= 0.4) return "critical";
  if (rate >= 0.28) return "high";
  if (rate >= 0.18) return "elevated";
  if (rate >= 0.08) return "moderate";
  return "low";
};

export const aggregateByLocation = (visible: Submission[]): Record<string, LocationAgg> => {
  const acc: Record<string, LocationAgg> = {};
  const ensure = (id: string): LocationAgg =>
    (acc[id] ??= {
      id,
      count: 0,
      sick: 0,
      sickRate: 0,
      highRisk: 0,
      highRiskRate: 0,
      tier: "low",
      lastArrival: -1,
      trend: [],
    });

  for (const s of visible) {
    const a = ensure(s.locationId);
    a.count += 1;
    if (s.sick) a.sick += 1;
    const r = getPlaceholderResult(s);
    if (r.riskTier === "high" || r.riskTier === "critical") a.highRisk += 1;
    a.lastArrival = Math.max(a.lastArrival, s.arrivalIndex);
  }
  Object.values(acc).forEach((a) => {
    a.sickRate = a.count ? a.sick / a.count : 0;
    a.highRiskRate = a.count ? a.highRisk / a.count : 0;
    a.tier = tierFromHighRate(a.highRiskRate);
  });
  return acc;
};

export interface Headline {
  screenings: number;
  recent: number; // most recent slice of arrivals (proxy for "last 24h")
  activeLocations: number;
  highRisk: number; // preview
  highRiskRate: number; // preview
}

export const headline = (visible: Submission[], recentWindow = 40): Headline => {
  let sick = 0;
  let highRisk = 0;
  for (const s of visible) {
    if (s.sick) sick += 1;
    const r = getPlaceholderResult(s);
    if (r.riskTier === "high" || r.riskTier === "critical") highRisk += 1;
  }
  const active = new Set(visible.filter((s) => s.locationId !== "other").map((s) => s.locationId));
  void sick;
  return {
    screenings: visible.length,
    recent: Math.min(recentWindow, visible.length),
    activeLocations: active.size,
    highRisk,
    highRiskRate: visible.length ? highRisk / visible.length : 0,
  };
};

export interface FeedRow {
  id: string;
  locationId: string;
  arrivalIndex: number;
  tier: RiskTier;
  tierColor: string;
  symptoms: string[];
  sick: boolean;
}

export const recentFeed = (visible: Submission[], n = 12): FeedRow[] =>
  visible
    .slice(-n)
    .reverse()
    .map((s) => {
      const r = getPlaceholderResult(s);
      return {
        id: s.id,
        locationId: s.locationId,
        arrivalIndex: s.arrivalIndex,
        tier: r.riskTier,
        tierColor: RISK_TIER_MAP[r.riskTier].color,
        symptoms: s.symptoms,
        sick: s.sick,
      };
    });

export interface VolumePoint {
  bucket: number;
  label: string;
  actual: number | null; // cumulative real submissions revealed so far
  modeled: number; // modeled projection (labeled) — season/scenario scaled
}

const seasonMult = (s: SeasonKey): number =>
  ({ baseline: 1, hajj: 1.9, umrah: 1.4, dust: 1.35, winter: 1.3 }[s] ?? 1);
const scenarioMult = (s: ScenarioKey): number =>
  ({ none: 1, hajjInflux: 1.7, dustStorm: 1.45, newVariant: 1.6 }[s] ?? 1);

/**
 * Cumulative submission volume across arrival-order buckets (real), plus a
 * modeled projection line (season/scenario scaled) drawn distinctly. `actual`
 * is null past the current visible position so the projection leads honestly.
 */
export const volumeSeries = (
  all: Submission[],
  visibleCount: number,
  season: SeasonKey,
  scenario: ScenarioKey,
  buckets = 24,
): VolumePoint[] => {
  const total = all.length || 1;
  const proj = seasonMult(season) * scenarioMult(scenario);
  const out: VolumePoint[] = [];
  for (let i = 0; i < buckets; i++) {
    const threshold = Math.round(((i + 1) / buckets) * total);
    const cumulative = threshold; // arrivals are ordered, so index == count
    const revealed = threshold <= visibleCount;
    out.push({
      bucket: i,
      label: `${Math.round(((i + 1) / buckets) * 100)}%`,
      actual: revealed ? cumulative : null,
      modeled: Math.round(cumulative * proj),
    });
  }
  return out;
};

export const projectionFactor = (season: SeasonKey, scenario: ScenarioKey): number =>
  seasonMult(season) * scenarioMult(scenario);

/**
 * Volume series for an arbitrary (filtered) subset, bucketed across the GLOBAL
 * arrival timeline so it stays aligned with the scrubber. `actual` is null past
 * the current visible position; `modeled` is the season/scenario projection.
 */
export const volumeSeriesFiltered = (
  filteredAll: Submission[],
  total: number,
  visibleCount: number,
  season: SeasonKey,
  scenario: ScenarioKey,
  buckets = 24,
): VolumePoint[] => {
  const proj = seasonMult(season) * scenarioMult(scenario);
  const span = total || 1;
  const idx = filteredAll.map((s) => s.arrivalIndex);
  const out: VolumePoint[] = [];
  for (let i = 0; i < buckets; i++) {
    const thr = ((i + 1) / buckets) * span;
    const cumulative = idx.filter((a) => a <= thr).length;
    const revealed = thr <= visibleCount;
    out.push({
      bucket: i,
      label: `${Math.round(((i + 1) / buckets) * 100)}%`,
      actual: revealed ? cumulative : null,
      modeled: Math.round(cumulative * proj),
    });
  }
  return out;
};

export const FOCUS = FOCUS_LOCATIONS;
