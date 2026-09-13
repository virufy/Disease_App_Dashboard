import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FiMapPin } from "react-icons/fi";
import { useDisease } from "../../state/DiseaseContext";
import { aggregateByLocation } from "../../data/derive";
import { FOCUS_LOCATIONS } from "../../data/submissions";
import { RISK_TIER_MAP } from "../../data/geo";
import { Panel, PanelHead, PanelTitle, Chip } from "../../styles/cc";

const Scroll = styled.div`
  padding: 0 8px 10px;
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  th {
    text-align: start;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--faint);
    padding: 6px 10px;
  }
  td {
    padding: 8px 10px;
    border-top: 1px solid var(--line);
    color: var(--ink);
    white-space: nowrap;
  }
  .num {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
  }
  .muted {
    color: var(--muted);
  }
  tr:hover td {
    background: rgba(148, 163, 184, 0.05);
  }
`;
const Tier = styled.span<{ $c: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 700;
  color: ${({ $c }) => $c};
  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $c }) => $c};
    display: inline-block;
  }
`;

const NodeTable: React.FC = () => {
  const { t } = useTranslation();
  const { filtered } = useDisease();
  const agg = aggregateByLocation(filtered);
  const total = filtered.length;

  const rows = FOCUS_LOCATIONS.map((id) => agg[id]).filter(Boolean).sort((a, b) => b.count - a.count);

  return (
    <Panel>
      <PanelHead>
        <PanelTitle><FiMapPin size={13} /> {t("dm.table.title")}</PanelTitle>
        <Chip $tone="#fcd34d">{t("dm.tag.riskPreview")}</Chip>
      </PanelHead>
      <Scroll>
        <Table>
          <thead>
            <tr>
              <th>{t("dm.table.location")}</th>
              <th>{t("dm.table.submissions")}</th>
              <th>{t("dm.table.symptomatic")}</th>
              <th>{t("dm.table.tier")}</th>
              <th>{t("dm.table.share")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const tier = RISK_TIER_MAP[r.tier];
              return (
                <tr key={r.id}>
                  <td>{t(`nodes.${r.id}`, { defaultValue: r.id })}</td>
                  <td className="num">{r.count.toLocaleString()}</td>
                  <td className="num muted">{Math.round(r.sickRate * 100)}%</td>
                  <td>
                    <Tier $c={tier.color}>
                      <i />
                      {t(`dm.tier.${r.tier}`)}
                    </Tier>
                  </td>
                  <td className="num muted">{total ? Math.round((r.count / total) * 100) : 0}%</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="muted" style={{ textAlign: "center", padding: 20 }}>
                  {t("dm.table.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Scroll>
    </Panel>
  );
};

export default NodeTable;
