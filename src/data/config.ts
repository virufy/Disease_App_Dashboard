/**
 * Single source of truth for data-mode.
 *
 * The whole app is currently a stakeholder DEMO running on TEST data that flows
 * through the real submission pipeline. `DATA_MODE` drives the one "Test data"
 * indicator across the UI, so flipping it to "live" (via env) removes the label
 * everywhere at once when real user submissions are flowing.
 */
export type DataMode = "test" | "live";

export const DATA_MODE: DataMode =
  (process.env.REACT_APP_DATA_MODE as DataMode) === "live" ? "live" : "test";

export const IS_TEST_DATA = DATA_MODE !== "live";

export const WS_URL = process.env.REACT_APP_WEBSOCKET_URL?.trim() || "";

/**
 * Public link to the Virufy disease/cough-screening app that the QR code opens.
 * Must match the URL encoded in the QR image (src/assets/images/disease-app-qr.png).
 * Override per-environment with REACT_APP_APP_URL in .env.
 */
export const APP_URL =
  process.env.REACT_APP_APP_URL?.trim() || "https://virufy.org/disease-app";

/** Open-Meteo — free, keyless environmental data (labeled with source in UI). */
export const AIR_QUALITY_API = "https://air-quality-api.open-meteo.com/v1/air-quality";
export const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

/*
 * Basemap. Defaults to keyless OSM (inverted to dark via CSS). To upgrade to a
 * crisp native-dark basemap, set these env vars (e.g. Stadia Alidade Smooth Dark
 * or CARTO dark matter with a free key) plus REACT_APP_MAP_DARK=true so the CSS
 * inversion is skipped:
 *   REACT_APP_MAP_TILES=https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=YOUR_KEY
 *   REACT_APP_MAP_ATTR=(c) Stadia Maps (c) OpenStreetMap
 *   REACT_APP_MAP_DARK=true
 */
export const MAP_TILES =
  process.env.REACT_APP_MAP_TILES?.trim() ||
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_ATTR =
  process.env.REACT_APP_MAP_ATTR?.trim() ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · positions real, dataset is test data';
export const MAP_NATIVE_DARK = process.env.REACT_APP_MAP_DARK === "true";
