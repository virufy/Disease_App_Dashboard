import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { MODEL_METRICS } from "../../data/simulation";
import { Panel, PanelHead, PanelTitle, PanelBody } from "../../styles/cc";

const Metric = styled.div`
  margin-bottom: 13px;
  &:last-child {
    margin-bottom: 0;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 5px;
  }
  .name {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
  }
  .vals {
    font-family: var(--font-num);
    font-size: 12px;
    display: flex;
    gap: 12px;
  }
  .vals .in {
    color: var(--signal);
  }
  .vals .out {
    color: var(--muted);
  }
`;

const Track = styled.div`
  position: relative;
  height: 7px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  overflow: hidden;
`;
const Fill = styled.div<{ $w: number; $c: string }>`
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: ${({ $w }) => $w}%;
  background: ${({ $c }) => $c};
  border-radius: 999px;
  transition: width 0.5s ease;
`;

const Note = styled.p`
  margin: 12px 0 0;
  font-size: 10px;
  color: var(--faint);
  line-height: 1.4;
`;

const ModelPerf: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Panel>
      <PanelHead>
        <PanelTitle>🧠 {t("dm.model.title")}</PanelTitle>
      </PanelHead>
      <PanelBody>
        {MODEL_METRICS.map((m) => (
          <Metric key={m.key}>
            <div className="top">
              <span className="name">{t(`dm.model.${m.key}`)}</span>
              <span className="vals">
                <span className="in">{m.inSample.toFixed(2)} {t("dm.model.inSample")}</span>
                <span className="out">{m.heldOut.toFixed(2)} {t("dm.model.heldOut")}</span>
              </span>
            </div>
            <Track>
              <Fill $w={m.inSample * 100} $c="rgba(34,211,238,0.35)" />
              <Fill $w={m.heldOut * 100} $c="var(--signal)" />
            </Track>
          </Metric>
        ))}
        <Note>{t("dm.model.note")}</Note>
      </PanelBody>
    </Panel>
  );
};

export default ModelPerf;
