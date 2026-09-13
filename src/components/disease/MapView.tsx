import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { NODES, NODE_MAP, MAP_VIEW, RISK_TIER_MAP, RISK_TIERS } from "../../data/geo";
import { NodeFrame } from "../../data/types";
import FlowCanvas from "./FlowCanvas";
import {
  MapWrap,
  MapCanvas,
  Legend,
  LegendRow,
  PrevalenceToggle,
  FocusBar,
  FocusBtn,
} from "./MapView.styles";

const FOCUS_CITIES = ["siliconValley", "dubai", "madinah", "mecca"] as const;

const sparkline = (trend: number[], color: string): string => {
  if (!trend.length) return "";
  const w = 108;
  const h = 26;
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const span = max - min || 1;
  const pts = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};

const MapView: React.FC = () => {
  const { t } = useTranslation();
  const { frame, showPrevalence, setShowPrevalence, motionActive, dir } = useDisease();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const nodeLayerRef = useRef<L.LayerGroup | null>(null);
  const heatRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState<L.Map | null>(null);
  const [focus, setFocus] = useState<string | null>(null);

  const allBounds = L.latLngBounds(NODES.map((n) => [n.lat, n.lon] as [number, number]));

  const flyTo = (id: string | null) => {
    const map = mapRef.current;
    if (!map) return;
    setFocus(id);
    if (!id) {
      map.flyToBounds(allBounds, { padding: [60, 60], duration: 0.8, maxZoom: 7 });
    } else {
      const n = NODE_MAP[id];
      map.flyTo([n.lat, n.lon], 11, { duration: 0.8 });
    }
  };

  // init once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [MAP_VIEW.lat, MAP_VIEW.lon],
      zoom: MAP_VIEW.zoom,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · positions real, feeds simulated',
    }).addTo(map);
    // frame all three cities on first paint, regardless of screen size
    map.fitBounds(
      L.latLngBounds(NODES.map((n) => [n.lat, n.lon] as [number, number])),
      { padding: [60, 60], maxZoom: 7 },
    );
    nodeLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setMapReady(map);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // redraw nodes + heat when the frame / toggles / language change
  useEffect(() => {
    const map = mapRef.current;
    const layer = nodeLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    // prevalence heat field
    if (heatRef.current) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }
    if (showPrevalence) {
      const pts = NODES.filter((n) => n.kind !== "gateway").map((n) => {
        const nf = frame.nodes[n.id];
        return [n.lat, n.lon, Math.min(1, nf.actual / 200)] as [number, number, number];
      });
      heatRef.current = (L as any).heatLayer(pts, {
        radius: 55,
        blur: 40,
        maxZoom: 11,
        minOpacity: 0.28,
        gradient: {
          0.2: "#22d3ee",
          0.45: "#22c55e",
          0.65: "#eab308",
          0.82: "#f97316",
          1.0: "#ef4444",
        },
      });
      heatRef.current.addTo(map);
    }

    NODES.forEach((n) => {
      const nf: NodeFrame = frame.nodes[n.id];
      const tier = RISK_TIER_MAP[nf.tier];
      const coreD = Math.round(9 + Math.min(22, nf.actual / 9));
      const predD = Math.round(coreD + 8 + Math.min(18, nf.predicted / 12));
      const ringD = predD + (nf.emerging ? 14 : 6);

      const html = `
        <div class="dm-node" style="color:${tier.color};width:${ringD}px;height:${ringD}px">
          ${nf.emerging ? `<div class="dm-node__pulse" style="width:${predD}px;height:${predD}px"></div>` : ""}
          <div class="dm-node__ring" style="width:${predD}px;height:${predD}px"></div>
          <div class="dm-node__core" style="width:${coreD}px;height:${coreD}px;background:${tier.color}"></div>
        </div>`;

      const icon = L.divIcon({
        className: "dm-node-icon",
        html,
        iconSize: [ringD, ringD],
        iconAnchor: [ringD / 2, ringD / 2],
      });

      const marker = L.marker([n.lat, n.lon], { icon, riseOnHover: true });
      const name = t(`nodes.${n.id}`, { defaultValue: n.name });
      const popup = `
        <div style="min-width:180px;font-family:var(--font-ui);direction:${dir}">
          <div style="font-weight:800;font-size:13px;margin-bottom:2px">${name}</div>
          <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:8px">
            <span style="width:8px;height:8px;border-radius:50%;background:${tier.color};display:inline-block"></span>
            <span style="font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:${tier.color}">${t(`dm.tier.${nf.tier}`)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;gap:14px;font-size:11.5px;color:#97a4bd;margin:3px 0">
            <span>${t("dm.pop.actual")}</span><b style="color:#e8edf6;font-family:var(--font-num)">${nf.actual}/100k</b>
          </div>
          <div style="display:flex;justify-content:space-between;gap:14px;font-size:11.5px;color:#97a4bd;margin:3px 0">
            <span>${t("dm.pop.predicted")}</span><b style="color:${tier.color};font-family:var(--font-num)">${nf.predicted}/100k</b>
          </div>
          <div style="display:flex;justify-content:space-between;gap:14px;font-size:11.5px;color:#97a4bd;margin:3px 0 8px">
            <span>${t("dm.pop.lead")}</span><b style="color:#a5f3fc;font-family:var(--font-num)">${t("dm.pop.leadDays", { n: nf.leadTimeDays })}</b>
          </div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#64748b;margin-bottom:2px">${t("dm.pop.trend")}</div>
          ${sparkline(nf.trend, tier.color)}
        </div>`;
      marker.bindPopup(popup, { closeButton: false, offset: [0, -4] });
      marker.on("mouseover", () => marker.openPopup());
      layer.addLayer(marker);
    });
  }, [frame, showPrevalence, dir, t]);

  // flow intensity from current city risk
  const cityIds = ["dubai", "madinah", "mecca"];
  const intensity = Math.min(
    1,
    cityIds.reduce((s, id) => s + frame.nodes[id].actual, 0) / cityIds.length / 180,
  );

  return (
    <MapWrap>
      <MapCanvas ref={containerRef} aria-label={t("dm.map.title")} />
      <FlowCanvas map={mapReady} active={motionActive} intensity={intensity} />

      <FocusBar role="group" aria-label={t("dm.map.title")}>
        <FocusBtn $active={focus === null} onClick={() => flyTo(null)}>
          {t("dm.map.allCities")}
        </FocusBtn>
        {FOCUS_CITIES.map((id) => (
          <FocusBtn key={id} $active={focus === id} onClick={() => flyTo(id)}>
            {t(`nodes.${id}`, { defaultValue: id })}
          </FocusBtn>
        ))}
      </FocusBar>

      <PrevalenceToggle
        $active={showPrevalence}
        onClick={() => setShowPrevalence(!showPrevalence)}
        aria-pressed={showPrevalence}
      >
        <span className="dot" /> {t("dm.map.prevalence")}
      </PrevalenceToggle>

      <Legend dir={dir} aria-label={t("dm.legend.title")}>
        <div className="ttl">{t("dm.legend.title")}</div>
        <LegendRow><span className="fill" />{t("dm.legend.actual")}</LegendRow>
        <LegendRow><span className="ring" />{t("dm.legend.predicted")}</LegendRow>
        <LegendRow><span className="pulse" />{t("dm.legend.cluster")}</LegendRow>
        <LegendRow><span className="flow high" />{t("dm.legend.flowHigh")}</LegendRow>
        <LegendRow><span className="flow alt" />{t("dm.legend.flowAlt")}</LegendRow>
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
