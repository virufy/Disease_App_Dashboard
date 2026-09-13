/**
 * REAL geography for the Disease Map.
 *
 * Coordinates are accurate. Cities: Dubai (UAE), Madinah & Mecca (KSA).
 * Jeddah is included as the air/road GATEWAY that feeds pilgrims into Mecca and
 * Madinah; Dubai is the regional transit hub. Sites are real hospitals /
 * screening locations near each city center.
 */

import { CityMeta, Corridor, MapNode, RiskTierMeta, RiskTier } from "./types";

export const RISK_TIERS: RiskTierMeta[] = [
  { key: "low", color: "#22c55e", glow: "rgba(34,197,94,0.35)", min: 0 },
  { key: "moderate", color: "#eab308", glow: "rgba(234,179,8,0.35)", min: 45 },
  { key: "elevated", color: "#f97316", glow: "rgba(249,115,22,0.35)", min: 80 },
  { key: "high", color: "#ef4444", glow: "rgba(239,68,68,0.38)", min: 120 },
  { key: "critical", color: "#d946ef", glow: "rgba(217,70,239,0.4)", min: 170 },
];

export const RISK_TIER_MAP: Record<RiskTier, RiskTierMeta> = RISK_TIERS.reduce(
  (acc, t) => {
    acc[t.key] = t;
    return acc;
  },
  {} as Record<RiskTier, RiskTierMeta>,
);

export const tierForValue = (value: number): RiskTier => {
  let tier: RiskTier = "low";
  for (const t of RISK_TIERS) if (value >= t.min) tier = t.key;
  return tier;
};

export const CITIES: CityMeta[] = [
  { id: "siliconValley", name: "Silicon Valley", country: "USA", population: 2000000 },
  { id: "dubai", name: "Dubai", country: "UAE", population: 3600000 },
  { id: "madinah", name: "Madinah", country: "KSA", population: 1500000 },
  { id: "mecca", name: "Mecca", country: "KSA", population: 2000000 },
  { id: "jeddah", name: "Jeddah", country: "KSA", population: 4700000 },
];

export const NODES: MapNode[] = [
  // ── Silicon Valley (USA — Virufy's home base) ────────────────
  { id: "siliconValley", cityId: "siliconValley", name: "Silicon Valley", kind: "city", lat: 37.3382, lon: -121.8863, weight: 1 },
  { id: "sv-stanford", cityId: "siliconValley", name: "Stanford Health Care", kind: "site", lat: 37.4331, lon: -122.1754, weight: 0.75 },
  { id: "sv-scvmc", cityId: "siliconValley", name: "Santa Clara Valley Med Center", kind: "site", lat: 37.3126, lon: -121.9757, weight: 0.7 },
  { id: "sv-sjc", cityId: "siliconValley", name: "San José Airport (SJC)", kind: "gateway", lat: 37.3639, lon: -121.9289, weight: 0.7 },

  // ── Dubai (regional transit hub) ─────────────────────────────
  { id: "dubai", cityId: "dubai", name: "Dubai", kind: "city", lat: 25.2048, lon: 55.2708, weight: 1 },
  { id: "dubai-dxb", cityId: "dubai", name: "Dubai Intl Airport (DXB)", kind: "gateway", lat: 25.2532, lon: 55.3657, weight: 0.9 },
  { id: "dubai-rashid", cityId: "dubai", name: "Rashid Hospital", kind: "site", lat: 25.235, lon: 55.327, weight: 0.7 },
  { id: "dubai-mediclinic", cityId: "dubai", name: "Mediclinic City Hospital", kind: "site", lat: 25.232, lon: 55.323, weight: 0.6 },

  // ── Madinah (mass-gathering: Umrah/Hajj) ─────────────────────
  { id: "madinah", cityId: "madinah", name: "Madinah", kind: "city", lat: 24.4686, lon: 39.6142, weight: 1 },
  { id: "madinah-mosque", cityId: "madinah", name: "Al-Masjid an-Nabawi", kind: "site", lat: 24.4672, lon: 39.6111, weight: 0.95 },
  { id: "madinah-kfh", cityId: "madinah", name: "King Fahd Hospital", kind: "site", lat: 24.483, lon: 39.612, weight: 0.7 },
  { id: "madinah-airport", cityId: "madinah", name: "Prince Mohammad Airport (MED)", kind: "gateway", lat: 24.5535, lon: 39.7051, weight: 0.8 },

  // ── Mecca (largest mass-gathering) ───────────────────────────
  { id: "mecca", cityId: "mecca", name: "Mecca", kind: "city", lat: 21.3891, lon: 39.8579, weight: 1 },
  { id: "mecca-haram", cityId: "mecca", name: "Masjid al-Haram", kind: "site", lat: 21.4225, lon: 39.8262, weight: 1 },
  { id: "mecca-ajyad", cityId: "mecca", name: "Ajyad Emergency Hospital", kind: "site", lat: 21.419, lon: 39.829, weight: 0.75 },
  { id: "mecca-mina", cityId: "mecca", name: "Mina Screening Camp", kind: "site", lat: 21.413, lon: 39.893, weight: 0.85 },

  // ── Jeddah (gateway feeding Mecca & Madinah) ─────────────────
  { id: "jeddah", cityId: "jeddah", name: "Jeddah (Gateway)", kind: "gateway", lat: 21.4858, lon: 39.1925, weight: 0.9 },
  { id: "jeddah-jed", cityId: "jeddah", name: "King Abdulaziz Airport (JED)", kind: "gateway", lat: 21.6805, lon: 39.1565, weight: 0.9 },
];

export const NODE_MAP: Record<string, MapNode> = NODES.reduce(
  (acc, n) => {
    acc[n.id] = n;
    return acc;
  },
  {} as Record<string, MapNode>,
);

/** Inter-city transmission pathways (pilgrim + transit flows). */
export const CORRIDORS: Corridor[] = [
  // Jeddah gateway → the two holy cities (primary pilgrim corridors)
  { id: "jed-mecca", from: "jeddah-jed", to: "mecca", mode: "road", risk: "high" },
  { id: "jed-madinah", from: "jeddah-jed", to: "madinah", mode: "road", risk: "high" },
  // Mecca ↔ Madinah (pilgrims move between both)
  { id: "mecca-madinah", from: "mecca", to: "madinah", mode: "road", risk: "high" },
  // Dubai transit hub → gateways
  { id: "dubai-jed", from: "dubai-dxb", to: "jeddah-jed", mode: "air", risk: "high" },
  { id: "dubai-madinah", from: "dubai-dxb", to: "madinah-airport", mode: "air", risk: "alternate" },
  // Silicon Valley ↔ Dubai (long-haul transit link)
  { id: "sv-dubai", from: "sv-sjc", to: "dubai-dxb", mode: "air", risk: "alternate" },
];

/** Center + zoom that frames all three cities on first paint. */
export const MAP_VIEW = { lat: 23.4, lon: 45.5, zoom: 6 };
