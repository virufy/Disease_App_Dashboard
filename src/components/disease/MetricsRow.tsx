import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { headline } from "../../data/derive";

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  padding: 18px 20px 19px;
  border-radius: var(--radius);
  /* subtle "lit from above" surface — reads crafted, not flat-generated */
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0) 42%),
    var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--line-strong);
    transform: translateY(-1px);
  }

  .lbl {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .val {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: 38px;
    letter-spacing: -1.4px;
    color: var(--ink);
    margin-top: 12px;
    line-height: 1;
  }
  .sub {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--faint);
    margin-top: 9px;
    padding-top: 9px;
    border-top: 1px solid var(--line);
  }
`;

const Tag = styled.span`
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #fcd34d;
  background: rgba(251, 191, 36, 0.14);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 999px;
  padding: 1px 6px;
`;

const MetricsRow: React.FC = () => {
  const { t } = useTranslation();
  const { filtered } = useDisease();
  const m = headline(filtered);

  const cards = [
    { lbl: t("dm.metrics.screenings"), val: m.screenings.toLocaleString(), sub: t("dm.metrics.allLocations"), preview: false },
    { lbl: t("dm.metrics.recent"), val: m.recent.toLocaleString(), sub: t("dm.metrics.recentSub"), preview: false },
    { lbl: t("dm.metrics.locations"), val: `${m.activeLocations}`, sub: t("dm.metrics.locationsSub"), preview: false },
    { lbl: t("dm.metrics.highRisk"), val: m.highRisk.toLocaleString(), sub: t("dm.metrics.previewSub"), preview: true },
    { lbl: t("dm.metrics.positivity"), val: `${Math.round(m.highRiskRate * 100)}%`, sub: t("dm.metrics.previewSub"), preview: true },
  ];

  return (
    <Row>
      {cards.map((c) => (
        <Card key={c.lbl}>
          <div className="lbl">
            {c.lbl}
            {c.preview && <Tag>{t("dm.tag.preview")}</Tag>}
          </div>
          <div className="val">{c.val}</div>
          <div className="sub">{c.sub}</div>
        </Card>
      ))}
    </Row>
  );
};

export default MetricsRow;
