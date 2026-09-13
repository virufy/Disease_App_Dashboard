import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle } from "react-icons/fi";
import { useDisease } from "../../state/DiseaseContext";
import { aggregateByLocation, projectionFactor } from "../../data/derive";
import { FOCUS_LOCATIONS } from "../../data/submissions";
import { RISK_TIER_MAP } from "../../data/geo";
import { Panel, PanelHead, PanelTitle, Chip, Num } from "../../styles/cc";

const List = styled.div`
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
`;
const Item = styled.div`
  position: relative;
  padding: 10px 12px;
  border-radius: 11px;
  background: rgba(9, 12, 20, 0.5);
  border: 1px solid var(--line);
  animation: dm-rise 0.35s ease both;
  .top {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 3px;
  }
  .ttl {
    font-size: 12px;
    font-weight: 700;
  }
  .detail {
    font-size: 11px;
    color: var(--muted);
    line-height: 1.4;
  }
`;
const Empty = styled.div`
  padding: 22px 14px;
  text-align: center;
  color: var(--faint);
  font-size: 12px;
`;

interface Signal {
  id: string;
  kind: "capacity" | "cluster";
  tag: "modeled" | "preview";
  color: string;
  title: string;
  detail: string;
}

const AlertsPanel: React.FC = () => {
  const { t } = useTranslation();
  const { filtered, season, scenario } = useDisease();
  const agg = aggregateByLocation(filtered);
  const proj = projectionFactor(season, scenario);

  const signals: Signal[] = [];
  for (const id of FOCUS_LOCATIONS) {
    const a = agg[id];
    if (!a || a.count === 0) continue;
    const city = t(`nodes.${id}`, { defaultValue: id });

    // Capacity (MODELED): season/scenario projects a surge beyond current volume
    if (proj > 1.2) {
      const surgePct = Math.round((proj - 1) * 100);
      signals.push({
        id: `cap-${id}`,
        kind: "capacity",
        tag: "modeled",
        color: "#9dc0ff",
        title: t("dm.signal.capacity.title"),
        detail: t("dm.signal.capacity.detail", { city, pct: surgePct }),
      });
    }
    // Cluster (PREVIEW): elevated high-risk share from the placeholder model
    if (a.highRiskRate >= 0.2 && a.count >= 4) {
      signals.push({
        id: `clu-${id}`,
        kind: "cluster",
        tag: "preview",
        color: RISK_TIER_MAP[a.tier].color,
        title: t("dm.signal.cluster.title"),
        detail: t("dm.signal.cluster.detail", { city, pct: Math.round(a.highRiskRate * 100) }),
      });
    }
  }
  signals.sort((s) => (s.kind === "capacity" ? -1 : 1));

  return (
    <Panel>
      <PanelHead>
        <PanelTitle><FiAlertTriangle size={13} /> {t("dm.signal.title")}</PanelTitle>
        <Chip $tone="var(--muted)">
          <Num>{signals.length}</Num>
        </Chip>
      </PanelHead>
      {signals.length === 0 ? (
        <Empty>{t("dm.signal.none")}</Empty>
      ) : (
        <List>
          {signals.slice(0, 6).map((s) => (
            <Item key={s.id}>
              <div className="top">
                <Chip $tone={s.tag === "modeled" ? "#9dc0ff" : "#fcd34d"}>
                  {t(`dm.tag.${s.tag}`)}
                </Chip>
              </div>
              <div className="ttl">{s.title}</div>
              <div className="detail">{s.detail}</div>
            </Item>
          ))}
        </List>
      )}
    </Panel>
  );
};

export default AlertsPanel;
