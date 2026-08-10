import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

export interface ClusterPoint {
  lat: number;
  lng: number;
  count: number;
  sickRate: number;
  topSymptom: string;
}

interface MapProps {
  lat: number;
  lon: number;
  zoom: number;
  points: Array<{ lat: number; lng: number; intensity: number }>;
  clusters: ClusterPoint[];
}

// Heatmap colour ramp — low density (brand teal) → medium (cyan) →
// approaching hot (amber) → peak (scarlet)
const HEAT_GRADIENT = {
  0.0: "rgba(13, 148, 136, 0)",  // transparent teal at 0
  0.25: "#0d9488",               // teal
  0.5:  "#06b6d4",               // cyan
  0.7:  "#fbbf24",               // amber
  0.88: "#ef4444",               // red
  1.0:  "#fef2f2",               // near-white at peak
};

// Sick-rate semantic colours (match the dashboard's data tokens)
const clusterColor = (sickRate: number) => {
  if (sickRate >= 67) return "#DC2626"; // danger
  if (sickRate >= 34) return "#F59E0B"; // warning
  return "#16A34A";                     // success
};

const MapComponent: React.FC<MapProps> = React.memo(
  ({ lat, lon, zoom, points, clusters }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const heatLayerRef = useRef<L.HeatLayer | null>(null);
    const clusterLayerRef = useRef<L.LayerGroup | null>(null);

    // ── 1. Initialise map once ─────────────────────────────────────────────
    useEffect(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      mapRef.current = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom,
        zoomControl: true,
      });

      // CartoDB Positron — clean light basemap, great heatmap contrast, no API key
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
            '&copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(mapRef.current);

      const handleResize = () => mapRef.current?.invalidateSize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        mapRef.current?.remove();
        mapRef.current = null;
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentional one-time init

    // ── 2. Pan/zoom when location chip changes ────────────────────────────
    useEffect(() => {
      if (mapRef.current) {
        mapRef.current.setView([lat, lon], zoom, { animate: true });
      }
    }, [lat, lon, zoom]);

    // ── 3. Rebuild heat layer when data changes ───────────────────────────
    useEffect(() => {
      if (!mapRef.current) return;

      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }

      heatLayerRef.current = L.heatLayer(
        points.map((p) => [p.lat, p.lng, p.intensity]),
        {
          radius: 38,
          blur: 28,
          maxZoom: 15,
          gradient: HEAT_GRADIENT,
        },
      );

      heatLayerRef.current.addTo(mapRef.current);
    }, [points]);

    // ── 4. Rebuild clickable cluster markers ──────────────────────────────
    useEffect(() => {
      if (!mapRef.current) return;

      if (clusterLayerRef.current) {
        mapRef.current.removeLayer(clusterLayerRef.current);
      }

      clusterLayerRef.current = L.layerGroup();

      clusters.forEach((cluster) => {
        // Scale marker radius logarithmically with case count
        const radius = Math.max(9, Math.min(26, 7 + Math.log(cluster.count + 1) * 3.5));
        const color = clusterColor(cluster.sickRate);

        const marker = L.circleMarker([cluster.lat, cluster.lng], {
          radius,
          fillColor: color,
          fillOpacity: 0.82,
          color: "#ffffff",
          weight: 2,
        });

        const symptomLabel =
          cluster.topSymptom && cluster.topSymptom !== "none"
            ? cluster.topSymptom
            : "Healthy";

        marker.bindPopup(
          `<div style="font-family:'Inter',sans-serif;padding:10px 14px;min-width:140px">
            <div style="font-weight:800;font-size:14px;color:#111827;margin-bottom:6px">
              ${cluster.count} case${cluster.count !== 1 ? "s" : ""}
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#6b7280;margin-bottom:3px">
              <span>Sick rate</span>
              <b style="color:${color}">${cluster.sickRate}%</b>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#6b7280">
              <span>Top symptom</span>
              <b style="color:#374151">${symptomLabel}</b>
            </div>
          </div>`,
        );

        clusterLayerRef.current!.addLayer(marker);
      });

      clusterLayerRef.current.addTo(mapRef.current);
    }, [clusters]);

    return (
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    );
  },
);

export default MapComponent;
