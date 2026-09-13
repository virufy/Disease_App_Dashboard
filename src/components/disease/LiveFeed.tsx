import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { recentFeed } from "../../data/derive";
import { Panel, PanelHead, PanelTitle, LiveDot, Chip } from "../../styles/cc";

const CountLine = styled.div`
  margin: 0 12px 8px;
  padding: 9px 12px;
  border-radius: 11px;
  background: rgba(77, 141, 246, 0.08);
  border: 1px solid var(--line);
  display: flex;
  align-items: baseline;
  gap: 8px;
  .n {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
  }
  .l {
    font-size: 11.5px;
    color: var(--muted);
  }
`;
const List = styled.div`
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 10px;
  background: rgba(9, 12, 20, 0.5);
  border: 1px solid var(--line);
  animation: dm-rise 0.3s ease both;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .loc {
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .sym {
    font-size: 11px;
    color: var(--muted);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .idx {
    font-family: var(--font-num);
    font-size: 10.5px;
    color: var(--faint);
    flex-shrink: 0;
  }
`;
const Empty = styled.div`
  padding: 18px 14px;
  text-align: center;
  color: var(--faint);
  font-size: 12px;
`;

const LiveFeed: React.FC = () => {
  const { t } = useTranslation();
  const { filtered, locations, symptoms } = useDisease();
  const rows = recentFeed(filtered, 16);

  const locLabel =
    locations.length === 0
      ? t("dm.filter.all")
      : locations.map((id) => t(`nodes.${id}`, { defaultValue: id })).join(", ");
  const symLabel =
    symptoms.length === 0
      ? null
      : symptoms.map((id) => t(`symptoms.${id}`, { defaultValue: id })).join(", ");

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>
          <LiveDot /> {t("dm.feed.title")}
        </PanelTitle>
        <Chip $tone="#fcd34d">{t("dm.tag.riskPreview")}</Chip>
      </PanelHead>

      <CountLine>
        <span className="n">{filtered.length.toLocaleString()}</span>
        <span className="l">
          {symLabel ? `${symLabel} · ${locLabel}` : locLabel} · {t("dm.feed.count")}
        </span>
      </CountLine>

      {rows.length === 0 ? (
        <Empty>{t("dm.feed.empty")}</Empty>
      ) : (
        <List>
          {rows.map((r) => (
            <Row key={r.id}>
              <span className="dot" style={{ background: r.tierColor }} />
              <span className="loc">{t(`nodes.${r.locationId}`, { defaultValue: t("nodes.other") })}</span>
              <span className="sym">
                {r.sick
                  ? r.symptoms.filter((s) => s !== "none").map((s) => t(`symptoms.${s}`, { defaultValue: s })).join(", ")
                  : t("dm.feed.asymptomatic")}
              </span>
              <span className="idx">#{r.arrivalIndex + 1}</span>
            </Row>
          ))}
        </List>
      )}
    </Panel>
  );
};

export default LiveFeed;
