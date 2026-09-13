/**
 * Normalized submission model + helpers.
 *
 * A `Submission` is derived from a REAL record delivered over the WebSocket
 * pipeline (audio in S3 + metadata in DB upstream). Submission volume, location
 * (real lat/lon), symptoms, sex and age are REAL. There is no timestamp or id in
 * the feed, so we synthesize a stable id and use arrival order as the session
 * timeline (labeled in the UI). Risk is NOT here — it comes from the isolated
 * placeholder in ./risk until the model ships.
 */
import { NODE_MAP } from "./geo";

export interface RawRecord {
  DistanceMetric: string | number;
  latitude: number;
  longitude: number;
  Symptoms: string[];
  AgeGroup: string;
  Sex: string;
}

export interface Submission {
  id: string;
  lat: number;
  lon: number;
  symptoms: string[];
  sex: string;
  ageGroup: string;
  distanceMetric: number | null;
  /** nearest focus city id, or "other" if far from all four */
  locationId: string;
  /** order received over the socket — our session timeline */
  arrivalIndex: number;
  /** derived: reported any symptom other than "none" */
  sick: boolean;
}

/** Focus locations submissions are bucketed to (nearest within radius). */
export const FOCUS_LOCATIONS = ["siliconValley", "dubai", "madinah", "mecca"] as const;
export type FocusLocationId = (typeof FOCUS_LOCATIONS)[number] | "other";

const R = 6371; // km
const haversine = (aLat: number, aLon: number, bLat: number, bLon: number): number => {
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
};

const NEAREST_RADIUS_KM = 450;

export const nearestLocation = (lat: number, lon: number): FocusLocationId => {
  let best: FocusLocationId = "other";
  let bestD = NEAREST_RADIUS_KM;
  for (const id of FOCUS_LOCATIONS) {
    const n = NODE_MAP[id];
    const d = haversine(lat, lon, n.lat, n.lon);
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
};

// small, stable string hash (djb2) → hex; used to synthesize a submission id
const hash = (s: string): string => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
};

const parseDistance = (d: string | number): number | null => {
  if (typeof d === "number") return Number.isFinite(d) ? d : null;
  const n = parseFloat(d);
  return Number.isFinite(n) ? n : null;
};

export const normalizeRecord = (raw: RawRecord, arrivalIndex: number): Submission | null => {
  if (typeof raw?.latitude !== "number" || typeof raw?.longitude !== "number") return null;
  const symptoms = (raw.Symptoms || [])
    .map((s) => String(s).toLowerCase().trim())
    .filter(Boolean);
  const sick = symptoms.some((s) => s !== "none");
  const contentKey = `${raw.latitude},${raw.longitude},${symptoms.join("|")},${raw.Sex},${raw.AgeGroup},${raw.DistanceMetric}`;
  return {
    id: `${hash(contentKey)}-${arrivalIndex}`,
    lat: raw.latitude,
    lon: raw.longitude,
    symptoms,
    sex: raw.Sex || "unknown",
    ageGroup: raw.AgeGroup || "",
    distanceMetric: parseDistance(raw.DistanceMetric),
    locationId: nearestLocation(raw.latitude, raw.longitude),
    arrivalIndex,
    sick,
  };
};
