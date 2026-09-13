import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { alertsForFrame } from "../../data/simulation";
import { RISK_TIER_MAP } from "../../data/geo";
import { Panel, PanelHead, PanelTitle, Chip, Num } from "../../styles/cc";

const List = styled.div`
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
`;

const Item = styled.div<{ $color: string }>`
  position: relative;
  padding: 9px 11px 9px 13px;
  border-radius: 11px;
  background: rgba(9, 12, 20, 0.5);
  border: 1px solid var(--line);
  animation: dm-rise 0.35s ease both;

  &::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    border-radius: 3px;
    background: ${({ $color }) => $color};
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 3px;
  }
  .ttl {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
  }
  .detail {
    font-size: 11px;
    color: var(--muted);
    line-height: 1.4;
  }
  .time {
    font-size: 9.5px;
    color: var(--faint);
    font-weight: 600;
    flex-shrink: 0;
  }
`;

const Empty = styled.div`
  padding: 22px 14px;
  text-align: center;
  color: var(--faint);
  font-size: 12px;
`;

const typeTone: Record<string, string> = {
  capacity: "#a5f3fc",
  outbreak: "#fca5a5",
  air: "#fcd34d",
};

const AlertsPanel: React.FC = () => {
  const { t } = useTranslation();
  const { sim, index } = useDisease();
  const alerts = alertsForFrame(sim, index);

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>⚠ {t("dm.alerts.title")}</PanelTitle>
        <Chip $tone="var(--muted)">
          <Num>{alerts.length}</Num>
        </Chip>
      </PanelHead>
      {alerts.length === 0 ? (
        <Empty>{t("dm.alerts.none")}</Empty>
      ) : (
        <List>
          {alerts.map((a) => {
            const city = t(`nodes.${a.cityId}`, { defaultValue: a.cityId });
            const color = RISK_TIER_MAP[a.severity].color;
            return (
              <Item key={a.id} $color={color}>
                <div className="top">
                  <Chip $tone={typeTone[a.type]}>{t(`dm.alerts.${a.type}`)}</Chip>
                  <span className="time">
                    <Num>{a.time}</Num>
                  </span>
                </div>
                <div className="ttl">{t(a.titleKey)}</div>
                <div className="detail">{t(a.detailKey, { ...a.params, city })}</div>
              </Item>
            );
          })}
        </List>
      )}
    </Panel>
  );
};

export default AlertsPanel;
