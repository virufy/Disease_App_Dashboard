import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { MapContainer } from "./DashboardStyles";

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
				zoom
			});

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "© OpenStreetMap contributors"
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
					animate: true
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
					radius: 30,
					blur: 15,
					maxZoom: 15,
					gradient: { 0.4: "blue", 0.65: "lime", 1: "red" }
				}
			);

			heatLayerRef.current.addTo(mapRef.current);
		}, [points]);

		return <MapContainer ref={mapContainerRef} />;
	}
);

export default MapComponent;
