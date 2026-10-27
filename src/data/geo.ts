/**
 * REAL geography for the Disease Map (Saudi Arabia / KSA focus).
 *
 * Coordinates are accurate. Cities: Madinah & Mecca (KSA mass-gathering sites).
 * Jeddah is included as the air/road GATEWAY that feeds pilgrims into Mecca and
 * Madinah. Sites are real hospitals / screening locations near each city center.
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
  { id: "madinah", name: "Madinah", country: "KSA", population: 1500000 },
  { id: "mecca", name: "Mecca", country: "KSA", population: 2000000 },
  { id: "jeddah", name: "Jeddah", country: "KSA", population: 4700000 },
];

export const NODES: MapNode[] = [
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
];

/** Center + zoom that frames Madinah, Mecca and Jeddah on first paint. */
export const MAP_VIEW = { lat: 22.9, lon: 39.5, zoom: 7 };
