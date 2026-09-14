import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { headline } from "../../data/derive";
import { FOCUS_LOCATIONS } from "../../data/submissions";
import { NODE_MAP } from "../../data/geo";
import { AIR_QUALITY_API } from "../../data/config";
import { Panel, PanelHead, PanelTitle, LiveDot } from "../../styles/cc";

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 4px 14px 14px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
const Tile = styled.div`
  padding: 11px 12px;
  border-radius: 12px;
  background: rgba(9, 12, 20, 0.5);
  border: 1px solid var(--line);
  .lbl {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .val {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 22px;
    font-weight: 700;
    margin-top: 4px;
  }
  .sub {
    font-size: 10px;
    color: var(--faint);
    margin-top: 2px;
  }
`;
const Tag = styled.span`
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 1px 5px;
`;

interface Air {
  pm25: number;
  dust: number;
  ok: boolean;
}

const SensorStrip: React.FC = () => {
  const { t } = useTranslation();
  const { filtered } = useDisease();
  const m = headline(filtered);
  const sick = filtered.filter((s) => s.sick).length;
  const [air, setAir] = useState<Air | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const lats = FOCUS_LOCATIONS.map((id) => NODE_MAP[id].lat).join(",");
    const lons = FOCUS_LOCATIONS.map((id) => NODE_MAP[id].lon).join(",");
    fetch(`${AIR_QUALITY_API}?latitude=${lats}&longitude=${lons}&current=pm2_5,dust`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d) ? d : [d];
        const pm = arr.map((x) => x?.current?.pm2_5).filter((n) => typeof n === "number");
        const du = arr.map((x) => x?.current?.dust).filter((n) => typeof n === "number");
        if (pm.length) {
          setAir({
            pm25: Math.round(pm.reduce((a, b) => a + b, 0) / pm.length),
            dust: du.length ? Math.round(du.reduce((a, b) => a + b, 0) / du.length) : 0,
            ok: true,
          });
        } else setAir({ pm25: 0, dust: 0, ok: false });
      })
      .catch(() => setAir({ pm25: 0, dust: 0, ok: false }));
    return () => ctrl.abort();
  }, []);

  const pmHot = air?.ok && air.pm25 > 35;

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>
          <LiveDot /> {t("dm.sensor.title")}
        </PanelTitle>
      </PanelHead>
      <Strip>
        <Tile>
          <div className="lbl">{t("dm.sensor.cough")}</div>
          <div className="val">{m.screenings.toLocaleString()}</div>
          <div className="sub">{t("dm.sensor.coughSub")}</div>
        </Tile>

        <Tile>
          <div className="lbl">{t("dm.sensor.symptomatic")}</div>
          <div className="val">{sick.toLocaleString()}</div>
          <div className="sub">
            {m.screenings ? Math.round((sick / m.screenings) * 100) : 0}% {t("dm.sensor.ofSubs")}
          </div>
        </Tile>

        <Tile>
          <div className="lbl">
            {t("dm.sensor.highRisk")}
            <Tag style={{ color: "#fcd34d", background: "rgba(251,191,36,0.14)" }}>{t("dm.tag.preview")}</Tag>
          </div>
          <div className="val" style={{ color: "var(--tier-high)" }}>{m.highRisk.toLocaleString()}</div>
          <div className="sub">{t("dm.sensor.highRiskSub")}</div>
        </Tile>

        <Tile>
          <div className="lbl">{t("dm.sensor.air")}</div>
          {air === null ? (
            <div className="val" style={{ color: "var(--faint)" }}>…</div>
          ) : air.ok ? (
            <>
              <div className="val" style={{ color: pmHot ? "var(--tier-elevated)" : undefined }}>
                {air.pm25} <span style={{ fontSize: 11, color: "var(--faint)" }}>PM2.5</span>
              </div>
              <div className="sub">
                {t("dm.sensor.dust")} {air.dust} · {t("dm.sensor.airSource")}
              </div>
            </>
          ) : (
            <>
              <div className="val" style={{ color: "var(--faint)" }}>n/a</div>
              <div className="sub">{t("dm.sensor.airUnavailable")}</div>
            </>
          )}
        </Tile>
      </Strip>
    </Panel>
  );
};

export default SensorStrip;
