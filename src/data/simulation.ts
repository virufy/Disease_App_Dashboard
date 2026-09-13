/**
 * SIMULATED surveillance engine for the Disease Map demo.
 *
 * Deterministic (seeded) so the demo is stable on reload, yet reactive to the
 * timeline, season and what-if scenarios. Values are epidemiologically shaped —
 * mass-gathering peaks (Hajj/Umrah in Mecca & Madinah), dust-season respiratory
 * spikes, winter waves, and plausible inter-city correlation via transit.
 *
 * Everything is produced behind typed interfaces (see ./types) so real Virufy
 * cough-screening data, partner-clinic confirmations and environmental feeds
 * can replace it without any UI change.
 */

import {
  Alert,
  HeadlineMetrics,
  ModelMetric,
  NodeFrame,
  ScenarioKey,
  SeasonKey,
  SensorReadings,
  TimeFrame,
} from "./types";
import { CITIES, NODES, NODE_MAP, tierForValue } from "./geo";

export const TIMELINE_STEPS = 56;

// ── seeded PRNG ────────────────────────────────────────────────
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Build day labels starting from a fixed base so demo is reproducible. */
const buildLabels = (): string[] => {
  const labels: string[] = [];
  // fixed base date: 1 May
  let day = 1;
  let month = 4; // May (0-indexed)
  for (let i = 0; i < TIMELINE_STEPS; i++) {
    labels.push(`${day} ${MONTHS[month]}`);
    day++;
    if (day > 30) {
      day = 1;
      month = (month + 1) % 12;
    }
  }
  return labels;
};

const isHoly = (cityId: string) => cityId === "mecca" || cityId === "madinah";
const isRegion = (cityId: string) =>
  isHoly(cityId) || cityId === "dubai" || cityId === "jeddah"; // Gulf/Hijaz

// Season shifts the modeled baseline; mass-gathering & dust hit the region,
// winter is a global respiratory season (so Silicon Valley reacts too).
const seasonFactor = (season: SeasonKey, cityId: string): number => {
  const holy = isHoly(cityId);
  const region = isRegion(cityId);
  switch (season) {
    case "hajj":
      return holy ? 2.1 : region ? 1.25 : 1.05;
    case "umrah":
      return holy ? 1.55 : region ? 1.1 : 1.02;
    case "dust":
      return region ? 1.4 : 1.05; // dust is a Gulf/Hijaz driver
    case "winter":
      return 1.3; // global respiratory season
    default:
      return 1;
  }
};

// What-if scenarios add a live surge on top of the season baseline.
const scenarioFactor = (scenario: ScenarioKey, cityId: string): number => {
  const holy = isHoly(cityId);
  const region = isRegion(cityId);
  switch (scenario) {
    case "hajjInflux":
      return holy ? 1.8 : region ? 1.2 : 1.0;
    case "dustStorm":
      return region ? 1.5 : 1.0;
    case "newVariant":
      return 1.65; // variants spread globally
    default:
      return 1;
  }
};

// Base caseload per node (cases/100k), before season/scenario/wave/noise.
const nodeBase = (nodeId: string): number => {
  const n = NODE_MAP[nodeId];
  const cityBase: Record<string, number> = {
    siliconValley: 38,
    dubai: 42,
    madinah: 58,
    mecca: 66,
    jeddah: 50,
  };
  const base = cityBase[n.cityId] ?? 45;
  return base * (0.6 + n.weight * 0.6);
};

export interface Simulation {
  frames: TimeFrame[];
  labels: string[];
  season: SeasonKey;
  scenario: ScenarioKey;
}

/** A smooth epidemic wave over the timeline, peaking ~60% through. */
const wave = (i: number, phase: number): number => {
  const x = (i / (TIMELINE_STEPS - 1)) * Math.PI - phase;
  const w = Math.sin(x);
  return 0.55 + 0.75 * Math.max(0, w); // 0.55 baseline .. 1.3 peak
};

export const buildSimulation = (
  season: SeasonKey,
  scenario: ScenarioKey,
): Simulation => {
  const labels = buildLabels();
  const rand = mulberry32(1337);
  // per-node phase so peaks ripple across cities (transit correlation)
  const phase: Record<string, number> = {};
  NODES.forEach((n, idx) => {
    phase[n.id] = 0.15 * idx + (n.cityId === "dubai" ? 0.4 : 0);
  });

  const frames: TimeFrame[] = [];
  // keep a rolling history per node for trend sparklines
  const history: Record<string, number[]> = {};
  NODES.forEach((n) => (history[n.id] = []));

  for (let i = 0; i < TIMELINE_STEPS; i++) {
    const nodes: Record<string, NodeFrame> = {};
    for (const n of NODES) {
      const sf = seasonFactor(season, n.cityId);
      const cf = scenarioFactor(scenario, n.cityId);
      const noise = 0.9 + rand() * 0.2;
      const actual = Math.round(nodeBase(n.id) * wave(i, phase[n.id]) * sf * cf * noise);

      // forecast leads reality: predicted anticipates the next-step slope
      const slope = wave(i + 2, phase[n.id]) - wave(i, phase[n.id]);
      const leadBoost = 1 + Math.max(0, slope) * 0.9;
      const predicted = Math.round(actual * leadBoost * (0.98 + rand() * 0.06));

      const hist = history[n.id];
      hist.push(actual);
      const trend = hist.slice(-8);

      const rising = slope > 0.015;
      const tier = tierForValue(Math.max(actual, predicted));
      const emerging = rising && (tier === "high" || tier === "critical" || tier === "elevated");
      const leadTimeDays = Math.max(
        0,
        Math.round((rising ? 2 + slope * 40 : 1) * (scenario === "newVariant" ? 0.6 : 1)),
      );

      nodes[n.id] = { nodeId: n.id, actual, predicted, tier, leadTimeDays, emerging, trend };
    }
    frames.push({ index: i, label: labels[i], nodes });
  }

  return { frames, labels, season, scenario };
};

const CITY_NODE_IDS = ["siliconValley", "dubai", "madinah", "mecca", "jeddah"];

// ── derived, timeline-reactive aggregates ──────────────────────

export const sensorReadings = (
  sim: Simulation,
  index: number,
  tick: number,
): SensorReadings => {
  const frame = sim.frames[index];
  const avgActual =
    CITY_NODE_IDS.reduce((s, id) => s + frame.nodes[id].actual, 0) / CITY_NODE_IDS.length;
  // small live jitter driven by tick so tiles feel alive without lying
  const j = (amp: number) => 1 + Math.sin(tick / 3 + amp) * 0.02;

  const dusty = sim.season === "dust" || sim.scenario === "dustStorm";
  return {
    coughSubmissions: Math.round(avgActual * 62 * j(1)),
    aiThroughput: Math.round(avgActual * 78 * j(2)),
    clinicalConfirmations: Math.round(avgActual * 4.1 * j(3)),
    wardOccupancy: Math.min(98, Math.round(38 + avgActual * 0.32)),
    tempC: Math.round((sim.season === "winter" ? 22 : 39) + Math.sin(tick / 4) * 2),
    humidity: Math.round(28 + Math.sin(tick / 5) * 6),
    pm25: Math.round((dusty ? 145 : 48) * j(4)),
    dustIndex: Math.min(100, Math.round((dusty ? 82 : 24) * j(5))),
  };
};

export const headlineMetrics = (sim: Simulation, index: number): HeadlineMetrics => {
  let screenings = 0;
  let highRiskFlagged = 0;
  let undetectedEstimate = 0;
  for (let i = 0; i <= index; i++) {
    const f = sim.frames[i];
    for (const id of CITY_NODE_IDS) {
      const city = CITIES.find((c) => c.id === id)!;
      const nf = f.nodes[id];
      const per = city.population / 100000;
      screenings += Math.round(nf.actual * 62); // ~ daily cough submissions
      highRiskFlagged += Math.round(Math.max(0, nf.actual - 80) * per * 0.02);
      // detection gap: forecast minus detected, floored at 0, scaled to people
      undetectedEstimate += Math.max(0, nf.predicted - nf.actual) * per * 0.6;
    }
  }
  const cur = sim.frames[index];
  const avgActual =
    CITY_NODE_IDS.reduce((s, id) => s + cur.nodes[id].actual, 0) / CITY_NODE_IDS.length;
  const avgLead =
    CITY_NODE_IDS.reduce((s, id) => s + cur.nodes[id].leadTimeDays, 0) / CITY_NODE_IDS.length;

  return {
    screenings,
    highRiskFlagged,
    positivityRate: Math.min(38, Math.round((avgActual / 6) * 10) / 10),
    undetectedEstimate: Math.round(undetectedEstimate),
    avgLeadTimeDays: Math.round(avgLead * 10) / 10,
  };
};

export interface AlertDescriptor {
  id: string;
  type: Alert["type"];
  severity: Alert["severity"];
  cityId: string;
  titleKey: string;
  detailKey: string;
  params: Record<string, string | number>;
  time: string;
}

/** Alerts auto-generated from the current frame; capacity feed leads. */
export const alertsForFrame = (sim: Simulation, index: number): AlertDescriptor[] => {
  const frame = sim.frames[index];
  const out: AlertDescriptor[] = [];
  const dusty = sim.season === "dust" || sim.scenario === "dustStorm";

  for (const id of ["mecca", "madinah", "dubai", "jeddah", "siliconValley"]) {
    const nf = frame.nodes[id];
    // Capacity: forecast surge outruns detected screenings → lead time to act
    if (nf.predicted > nf.actual * 1.15 && (nf.tier === "elevated" || nf.tier === "high" || nf.tier === "critical")) {
      out.push({
        id: `cap-${id}-${index}`,
        type: "capacity",
        severity: nf.tier,
        cityId: id,
        titleKey: "alerts.capacity.title",
        detailKey: "alerts.capacity.detail",
        params: { city: id, lead: nf.leadTimeDays, gap: Math.round(nf.predicted - nf.actual) },
        time: frame.label,
      });
    }
    // Outbreak / rising cluster
    if (nf.emerging && (nf.tier === "high" || nf.tier === "critical")) {
      out.push({
        id: `out-${id}-${index}`,
        type: "outbreak",
        severity: nf.tier,
        cityId: id,
        titleKey: "alerts.outbreak.title",
        detailKey: "alerts.outbreak.detail",
        params: { city: id, rate: nf.actual },
        time: frame.label,
      });
    }
  }
  // Air quality (city-agnostic when dust is active)
  if (dusty) {
    for (const id of ["mecca", "madinah"]) {
      out.push({
        id: `air-${id}-${index}`,
        type: "air",
        severity: "elevated",
        cityId: id,
        titleKey: "alerts.air.title",
        detailKey: "alerts.air.detail",
        params: { city: id },
        time: frame.label,
      });
    }
  }

  // capacity first, then by severity
  const order = { capacity: 0, outbreak: 1, air: 2 } as const;
  const sevRank: Record<string, number> = { critical: 0, high: 1, elevated: 2, moderate: 3, low: 4 };
  return out
    .sort((a, b) => order[a.type] - order[b.type] || sevRank[a.severity] - sevRank[b.severity])
    .slice(0, 6);
};

export interface EvaPoint {
  label: string;
  predicted: number;
  actual: number | null;
}

/** Predicted (forecast) vs Actual (detected) averaged across the three cities. */
export const expectedVsActual = (sim: Simulation, index: number): EvaPoint[] => {
  const cities = ["siliconValley", "dubai", "madinah", "mecca"];
  return sim.frames.map((f, i) => {
    const predicted = Math.round(
      cities.reduce((s, id) => s + f.nodes[id].predicted, 0) / cities.length,
    );
    const actual =
      i <= index
        ? Math.round(cities.reduce((s, id) => s + f.nodes[id].actual, 0) / cities.length)
        : null;
    return { label: f.label, predicted, actual };
  });
};

// Plausible respiratory-AI model performance (NOT clinical guarantees).
export const MODEL_METRICS: ModelMetric[] = [
  { key: "auc", inSample: 0.91, heldOut: 0.86 },
  { key: "sensitivity", inSample: 0.89, heldOut: 0.83 },
  { key: "specificity", inSample: 0.9, heldOut: 0.85 },
];
