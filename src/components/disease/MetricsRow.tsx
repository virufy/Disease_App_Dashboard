import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { headlineMetrics } from "../../data/simulation";

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

const Card = styled.div<{ $accent: string }>`
  position: relative;
  overflow: hidden;
  padding: 13px 15px 14px;
  border-radius: var(--radius);
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);

  &::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${({ $accent }) => $accent};
  }
  .lbl {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .val {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    font-size: 27px;
    letter-spacing: -0.5px;
    color: var(--ink);
    margin-top: 5px;
    line-height: 1.05;
  }
  .sub {
    font-size: 10.5px;
    font-weight: 600;
    color: var(--faint);
    margin-top: 3px;
  }
`;

const compact = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${Math.round(n)}`;
};

const MetricsRow: React.FC = () => {
  const { t } = useTranslation();
  const { sim, index } = useDisease();
  const m = headlineMetrics(sim, index);

  const cards = [
    { lbl: t("dm.metrics.screenings"), val: compact(m.screenings), sub: t("dm.metrics.period"), accent: "var(--signal)" },
    { lbl: t("dm.metrics.highRisk"), val: compact(m.highRiskFlagged), sub: t("dm.metrics.period"), accent: "var(--tier-high)" },
    { lbl: t("dm.metrics.positivity"), val: `${m.positivityRate}%`, sub: t("dm.metrics.period"), accent: "var(--tier-elevated)" },
    { lbl: t("dm.metrics.undetected"), val: compact(m.undetectedEstimate), sub: t("dm.metrics.undetectedHint"), accent: "var(--tier-critical)" },
    { lbl: t("dm.metrics.leadTime"), val: `${m.avgLeadTimeDays}`, sub: t("dm.metrics.days"), accent: "var(--tier-low)" },
  ];

  return (
    <Row>
      {cards.map((c) => (
        <Card key={c.lbl} $accent={c.accent}>
          <div className="lbl">{c.lbl}</div>
          <div className="val">{c.val}</div>
          <div className="sub">{c.sub}</div>
        </Card>
      ))}
    </Row>
  );
};

export default MetricsRow;
