import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { sensorReadings } from "../../data/simulation";
import { Panel, PanelHead, PanelTitle, LiveDot } from "../../styles/cc";

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding: 4px 14px 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
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
  }
  .val {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    margin-top: 4px;
  }
  .sub {
    font-size: 10px;
    color: var(--faint);
    margin-top: 2px;
  }
  .env {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 5px;
    font-size: 10.5px;
    color: var(--muted);
    b {
      color: var(--ink);
      font-family: var(--font-num);
    }
  }
`;

const Sk = styled.div`
  height: 22px;
  margin-top: 6px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(148, 163, 184, 0.08) 25%,
    rgba(148, 163, 184, 0.18) 37%,
    rgba(148, 163, 184, 0.08) 63%
  );
  background-size: 400px 100%;
  animation: dm-shimmer 1.2s infinite linear;
`;

const SensorStrip: React.FC = () => {
  const { t } = useTranslation();
  const { sim, index, tick } = useDisease();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setLoaded(true), 700);
    return () => window.clearTimeout(id);
  }, []);

  const s = sensorReadings(sim, index, tick);
  const pmHot = s.pm25 > 90;

  const tiles = [
    { lbl: t("dm.sensor.cough"), val: s.coughSubmissions.toLocaleString(), sub: t("dm.sensor.perDay") },
    { lbl: t("dm.sensor.ai"), val: s.aiThroughput.toLocaleString(), sub: t("dm.sensor.analyzed") },
    { lbl: t("dm.sensor.clinical"), val: s.clinicalConfirmations.toLocaleString(), sub: t("dm.sensor.confirmed") },
    { lbl: t("dm.sensor.ward"), val: `${s.wardOccupancy}%`, sub: t("dm.sensor.occupancy") },
  ];

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>
          <LiveDot /> {t("dm.sensor.title")}
        </PanelTitle>
      </PanelHead>
      <Strip>
        {tiles.map((tile) => (
          <Tile key={tile.lbl}>
            <div className="lbl">{tile.lbl}</div>
            {loaded ? <div className="val">{tile.val}</div> : <Sk />}
            {loaded && <div className="sub">{tile.sub}</div>}
          </Tile>
        ))}
        <Tile>
          <div className="lbl">{t("dm.sensor.env")}</div>
          {loaded ? (
            <>
              <div className="val" style={{ color: pmHot ? "var(--tier-elevated)" : undefined }}>
                {s.pm25} <span style={{ fontSize: 11, color: "var(--faint)" }}>PM2.5</span>
              </div>
              <div className="env">
                <span>Dust <b>{s.dustIndex}</b></span>
                <span>{s.tempC}°C</span>
                <span>{s.humidity}%</span>
              </div>
            </>
          ) : (
            <Sk />
          )}
        </Tile>
      </Strip>
    </Panel>
  );
};

export default SensorStrip;
