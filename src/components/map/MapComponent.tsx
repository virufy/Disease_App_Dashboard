import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { MapContainer } from "../../styles/DashboardStyles";

interface MapProps {
  lat: number;
  lon: number;
  zoom: number;
  points: Array<{ lat: number; lng: number; intensity: number }>;
}

const MapComponent: React.FC<MapProps> = React.memo(
  ({ lat, lon, zoom, points }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const heatLayerRef = useRef<L.HeatLayer | null>(null);

    // ✅ 1. Initialize map ONCE
    useEffect(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      mapRef.current = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom,
      });

      // OSM tiles (no API key) — desaturated to a professional light-gray
      // look via the .leaflet-tile-pane CSS filter in index.css
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      const handleResize = () => {
        mapRef.current?.invalidateSize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        mapRef.current?.remove();
        mapRef.current = null;
      };
    }, []); // 👈 RUN ONCE

    // ✅ 2. Move map when location changes
    useEffect(() => {
      if (mapRef.current) {
        mapRef.current.setView([lat, lon], zoom, {
          animate: true,
        });
      }
    }, [lat, lon, zoom]);

    // ✅ 3. Update heat layer when points change
    useEffect(() => {
      if (!mapRef.current) return;

      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }

      heatLayerRef.current = L.heatLayer(
        points.map((p) => [p.lat, p.lng, p.intensity]),
        {
          radius: 34,
          blur: 22,
          maxZoom: 15,
          minOpacity: 0.35,
          gradient: {
            0.2: "#22d3ee",
            0.45: "#84cc16",
            0.7: "#f59e0b",
            1.0: "#ef4444",
          },
        },
      );

      heatLayerRef.current.addTo(mapRef.current);
    }, [points]);

    return (
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    );
  },
);

export default MapComponent;
