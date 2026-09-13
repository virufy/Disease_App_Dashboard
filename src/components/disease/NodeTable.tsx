import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { NODES, CITIES, RISK_TIER_MAP } from "../../data/geo";
import { Panel, PanelHead, PanelTitle } from "../../styles/cc";

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
    position: sticky;
    top: 0;
  }
  td {
    padding: 7px 10px;
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

const sevRank: Record<string, number> = { critical: 0, high: 1, elevated: 2, moderate: 3, low: 4 };

const NodeTable: React.FC = () => {
  const { t } = useTranslation();
  const { frame } = useDisease();

  const rows = [...NODES].sort(
    (a, b) => sevRank[frame.nodes[a.id].tier] - sevRank[frame.nodes[b.id].tier],
  );

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>▦ {t("dm.table.title")}</PanelTitle>
      </PanelHead>
      <Scroll>
        <Table>
          <thead>
            <tr>
              <th>{t("dm.table.node")}</th>
              <th>{t("dm.table.city")}</th>
              <th>{t("dm.table.actual")}</th>
              <th>{t("dm.table.predicted")}</th>
              <th>{t("dm.table.tier")}</th>
              <th>{t("dm.table.lead")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n) => {
              const nf = frame.nodes[n.id];
              const tier = RISK_TIER_MAP[nf.tier];
              const city = CITIES.find((c) => c.id === n.cityId);
              return (
                <tr key={n.id}>
                  <td>{t(`nodes.${n.id}`, { defaultValue: n.name })}</td>
                  <td className="muted">{t(`nodes.${n.cityId}`, { defaultValue: city?.name })}</td>
                  <td className="num">{nf.actual}</td>
                  <td className="num" style={{ color: tier.color }}>{nf.predicted}</td>
                  <td>
                    <Tier $c={tier.color}>
                      <i />
                      {t(`dm.tier.${nf.tier}`)}
                    </Tier>
                  </td>
                  <td className="num muted">{nf.leadTimeDays}{t("dm.metrics.days") ? "d" : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Scroll>
    </Panel>
  );
};

export default NodeTable;
