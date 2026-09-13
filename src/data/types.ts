/**
 * Disease Map — typed data model.
 *
 * All positions here are REAL. All time-series / feed values are SIMULATED for
 * demonstration and are produced behind these interfaces so that real Virufy
 * cough-screening data, partner-clinic confirmations and environmental APIs can
 * be dropped in later without touching the UI.
 */

export type RiskTier = "low" | "moderate" | "elevated" | "high" | "critical";

export interface RiskTierMeta {
  key: RiskTier;
  color: string; // saturated accent — the only meaningful colors in the UI
  glow: string; // translucent version for halos/fills
  /** lower bound (cases per 100k) for this tier */
  min: number;
}

export type NodeKind = "city" | "site" | "gateway";

export interface MapNode {
  id: string;
  cityId: string;
  /** English display name; Arabic served via i18n key `nodes.<id>` */
  name: string;
  kind: NodeKind;
  lat: number;
  lon: number;
  /** relative weight — bigger sites carry more of the city's caseload */
  weight: number;
}

export interface Corridor {
  id: string;
  from: string; // node id
  to: string; // node id
  mode: "air" | "road";
  /** high = active high-risk transmission pathway, alternate = lower-risk */
  risk: "high" | "alternate";
}

export type SeasonKey = "baseline" | "hajj" | "umrah" | "dust" | "winter";
export type ScenarioKey = "none" | "hajjInflux" | "dustStorm" | "newVariant";

/** Per-node state at a single point on the timeline. */
export interface NodeFrame {
  nodeId: string;
  /** detected / confirmed respiratory cases per 100k */
  actual: number;
  /** model-forecast cases per 100k */
  predicted: number;
  tier: RiskTier;
  /** days of early warning the forecast provides at this node */
  leadTimeDays: number;
  /** model has flagged a rising cluster here */
  emerging: boolean;
  /** short recent trend for the popover sparkline */
  trend: number[];
}

/** The whole dashboard state at one timeline index. */
export interface TimeFrame {
  index: number;
  /** ISO-ish label for the timeline + "last updated" */
  label: string;
  nodes: Record<string, NodeFrame>;
}

export type AlertType = "capacity" | "outbreak" | "air";

export interface Alert {
  id: string;
  type: AlertType;
  severity: RiskTier;
  cityId: string;
  /** already-localized title */
  title: string;
  /** already-localized detail line */
  detail: string;
  /** timeline label when it fired */
  time: string;
}

export interface SensorReadings {
  /** Virufy cough-audio submissions today across nodes */
  coughSubmissions: number;
  /** recordings analyzed by the screening model */
  aiThroughput: number;
  /** ground-truth positives confirmed by partner clinics */
  clinicalConfirmations: number;
  /** respiratory-ward occupancy %, averaged across cities */
  wardOccupancy: number;
  /** environment */
  tempC: number;
  humidity: number;
  pm25: number;
  dustIndex: number;
}

export interface HeadlineMetrics {
  screenings: number; // period total
  highRiskFlagged: number;
  positivityRate: number; // %
  undetectedEstimate: number; // detection-gap headline
  avgLeadTimeDays: number;
}

export interface ModelMetric {
  key: "auc" | "sensitivity" | "specificity";
  inSample: number;
  heldOut: number;
}

export interface CityMeta {
  id: string;
  name: string;
  country: string;
  /** population used to scale rates → absolute counts */
  population: number;
}
