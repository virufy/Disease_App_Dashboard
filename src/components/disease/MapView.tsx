import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { NODE_MAP, MAP_VIEW, RISK_TIER_MAP, RISK_TIERS } from "../../data/geo";
import { MAP_TILES, MAP_ATTR, MAP_NATIVE_DARK } from "../../data/config";
import { FOCUS_LOCATIONS } from "../../data/submissions";
import { aggregateByLocation } from "../../data/derive";
import FlowCanvas from "./FlowCanvas";
import { MapWrap, MapCanvas, Legend, LegendRow, PrevalenceToggle } from "./MapView.styles";

const sparkline = (trend: number[], color: string): string => {
  if (trend.length < 2) return "";
  const w = 108, h = 26;
  const min = Math.min(...trend), max = Math.max(...trend);
  const span = max - min || 1;
  const pts = trend
    .map((v, i) => `${((i / (trend.length - 1)) * w).toFixed(1)},${(h - ((v - min) / span) * h).toFixed(1)}`)
    .join(" ");
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};

const MapView: React.FC = () => {
  const { t } = useTranslation();
  const { filtered, total, showPrevalence, setShowPrevalence, motionActive, follow, dir, locations } = useDisease();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const nodeLayerRef = useRef<L.LayerGroup | null>(null);
  const pulseLayerRef = useRef<L.LayerGroup | null>(null);
  const heatRef = useRef<any>(null);
  const prevLenRef = useRef(0);
  const [mapReady, setMapReady] = useState<L.Map | null>(null);

  // default framing = the populated Gulf/Hijaz cluster (Dubai, Madinah, Mecca);
  // Silicon Valley is far away and reachable by selecting it in the filter bar.
  const allBounds = L.latLngBounds(
    ["dubai", "madinah", "mecca"].map((id) => [NODE_MAP[id].lat, NODE_MAP[id].lon] as [number, number]),
  );

  // init once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [MAP_VIEW.lat, MAP_VIEW.lon],
      zoom: MAP_VIEW.zoom,
      preferCanvas: true,
    });
    L.tileLayer(MAP_TILES, { maxZoom: 19, attribution: MAP_ATTR }).addTo(map);
    map.fitBounds(allBounds, { padding: [60, 60], maxZoom: 7 });
    nodeLayerRef.current = L.layerGroup().addTo(map);
    pulseLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setMapReady(map);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fly the map to match the top location filter (single shared control)
  const didInitFly = useRef(false);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!didInitFly.current) {
      didInitFly.current = true; // init already framed all cities
      return;
    }
    if (locations.length === 0) {
      map.flyToBounds(allBounds, { padding: [60, 60], duration: 0.8, maxZoom: 7 });
    } else if (locations.length === 1) {
      const n = NODE_MAP[locations[0]];
      map.flyTo([n.lat, n.lon], 10, { duration: 0.8 });
    } else {
      const b = L.latLngBounds(
        locations.map((id) => [NODE_MAP[id].lat, NODE_MAP[id].lon] as [number, number]),
      );
      map.flyToBounds(b, { padding: [70, 70], duration: 0.8, maxZoom: 9 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  // redraw density + city nodes when the visible set changes
  useEffect(() => {
    const map = mapRef.current;
    const layer = nodeLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    if (heatRef.current) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }
    if (showPrevalence && filtered.length) {
      heatRef.current = (L as any).heatLayer(
        filtered.map((s) => [s.lat, s.lon, s.sick ? 1 : 0.5]),
        {
          radius: 26,
          blur: 22,
          maxZoom: 11,
          minOpacity: 0.25,
          gradient: { 0.2: "#4d8df6", 0.45: "#22c55e", 0.65: "#eab308", 0.82: "#f97316", 1.0: "#ef4444" },
        },
      );
      heatRef.current.addTo(map);
    }

    const agg = aggregateByLocation(filtered);
    FOCUS_LOCATIONS.forEach((id) => {
      const n = NODE_MAP[id];
      const a = agg[id];
      const count = a?.count ?? 0;
      const tier = RISK_TIER_MAP[a?.tier ?? "low"];
      const coreD = Math.round(12 + Math.min(28, Math.log2(count + 1) * 6));
      const ringD = coreD + 8;
      const html = `
        <div class="dm-node" style="color:${tier.color};width:${ringD}px;height:${ringD}px">
          <div class="dm-node__core" style="width:${coreD}px;height:${coreD}px;background:${tier.color}22;border-color:${tier.color};box-shadow:0 0 0 2px ${tier.color}"></div>
          <div style="position:absolute;font-size:10px;font-weight:800;color:#fff;font-family:var(--font-num)">${count > 999 ? (count / 1000).toFixed(1) + "k" : count}</div>
        </div>`;
      const icon = L.divIcon({ className: "dm-node-icon", html, iconSize: [ringD, ringD], iconAnchor: [ringD / 2, ringD / 2] });
      const marker = L.marker([n.lat, n.lon], { icon, riseOnHover: true });

      const name = t(`nodes.${id}`, { defaultValue: n.name });
      const locSubs = filtered.filter((s) => s.locationId === id);
      const trend = Array.from({ length: 8 }, (_, b) => {
        const thr = ((b + 1) / 8) * (total || 1);
        return locSubs.filter((s) => s.arrivalIndex <= thr).length;
      });
      const popup = `
        <div style="min-width:184px;font-family:var(--font-ui);direction:${dir}">
          <div style="font-weight:800;font-size:13px;margin-bottom:6px">${name}</div>
          <div style="display:flex;justify-content:space-between;gap:14px;font-size:11.5px;color:#97a4bd;margin:3px 0">
            <span>${t("dm.pop.submissions")}</span><b style="color:#e8edf6;font-family:var(--font-num)">${count}</b>
          </div>
          <div style="display:flex;justify-content:space-between;gap:14px;font-size:11.5px;color:#97a4bd;margin:3px 0">
            <span>${t("dm.pop.symptomatic")}</span><b style="color:#e8edf6;font-family:var(--font-num)">${Math.round((a?.sickRate ?? 0) * 100)}%</b>
          </div>
          <div style="display:flex;justify-content:space-between;gap:14px;font-size:11.5px;color:#97a4bd;margin:3px 0 8px">
            <span>${t("dm.pop.risk")}</span><b style="color:${tier.color}">${t(`dm.tier.${a?.tier ?? "low"}`)} · ${t("dm.tag.preview")}</b>
          </div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#64748b;margin-bottom:2px">${t("dm.pop.trend")}</div>
          ${sparkline(trend, tier.color)}
        </div>`;
      marker.bindPopup(popup, { closeButton: false, offset: [0, -4] });
      marker.on("mouseover", () => marker.openPopup());
      layer.addLayer(marker);
    });
  }, [filtered, showPrevalence, dir, t, total]);

  // new-submission pulse (live edge)
  useEffect(() => {
    const map = mapRef.current;
    const pulseLayer = pulseLayerRef.current;
    if (!map || !pulseLayer) return;
    const grew = filtered.length > prevLenRef.current;
    prevLenRef.current = filtered.length;
    if (!grew || !follow || !motionActive || !filtered.length) return;

    const latest = filtered[filtered.length - 1];
    const icon = L.divIcon({
      className: "dm-node-icon",
      html: `<div class="dm-node" style="width:28px;height:28px"><div class="dm-node__pulse" style="width:22px;height:22px"></div></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const m = L.marker([latest.lat, latest.lon], { icon, interactive: false });
    pulseLayer.addLayer(m);
    const id = window.setTimeout(() => pulseLayer.removeLayer(m), 2000);
    return () => window.clearTimeout(id);
  }, [filtered, follow, motionActive]);

  const agg = aggregateByLocation(filtered);
  const intensity = Math.min(
    1,
    ["dubai", "madinah", "mecca"].reduce((s, id) => s + (agg[id]?.count ?? 0), 0) / 120,
  );

  return (
    <MapWrap>
      <MapCanvas
        ref={containerRef}
        className={MAP_NATIVE_DARK ? undefined : "dm-osm"}
        aria-label={t("dm.map.title")}
      />
      <FlowCanvas map={mapReady} active={motionActive} intensity={intensity} />

      <PrevalenceToggle $active={showPrevalence} onClick={() => setShowPrevalence(!showPrevalence)} aria-pressed={showPrevalence}>
        <span className="dot" /> {t("dm.map.prevalence")}
      </PrevalenceToggle>

      <Legend dir={dir} aria-label={t("dm.legend.title")}>
        <div className="ttl">{t("dm.legend.title")}</div>
        <LegendRow><span className="fill" />{t("dm.legend.node")}</LegendRow>
        <LegendRow><span className="pulse" />{t("dm.legend.newSubmission")}</LegendRow>
        <LegendRow><span className="flow high" />{t("dm.legend.flowHigh")}</LegendRow>
        <div className="tiers">
          {RISK_TIERS.map((tr) => (
            <span key={tr.key} title={t(`dm.tier.${tr.key}`)}>
              <i style={{ background: tr.color }} />
              {t(`dm.tier.${tr.key}`)}
            </span>
          ))}
        </div>
      </Legend>
    </MapWrap>
  );
};

export default MapView;
