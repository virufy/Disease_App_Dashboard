import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FiSliders } from "react-icons/fi";
import { useDisease } from "../../state/DiseaseContext";
import { ScenarioKey, SeasonKey } from "../../data/types";
import { Panel, PanelHead, PanelTitle, PanelBody, SegButton, Chip } from "../../styles/cc";

const Hint = styled.p`
  margin: 0 0 12px;
  font-size: 11px;
  color: var(--muted);
  line-height: 1.4;
`;
const Sub = styled.div`
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
  .lbl {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--faint);
    margin-bottom: 6px;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;
const WrapRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const scenarios: ScenarioKey[] = ["none", "hajjInflux", "dustStorm", "newVariant"];
const seasons: SeasonKey[] = ["baseline", "hajj", "umrah", "dust", "winter"];

/** Combined modeled-layer control: what-if scenarios + seasonal baseline. */
export const ModeledPanel: React.FC = () => {
  const { t } = useTranslation();
  const { scenario, setScenario, season, setSeason } = useDisease();
  return (
    <Panel>
      <PanelHead>
        <PanelTitle>
          <FiSliders size={13} /> {t("dm.modeled.title")}
        </PanelTitle>
        <Chip $tone="#9dc0ff">{t("dm.tag.modeled")}</Chip>
      </PanelHead>
      <PanelBody>
        <Hint>{t("dm.forecast.hint")}</Hint>

        <Sub>
          <div className="lbl">{t("dm.forecast.title")}</div>
          <Grid role="group" aria-label={t("dm.forecast.title")}>
            {scenarios.map((s) => (
              <SegButton key={s} $active={scenario === s} onClick={() => setScenario(s)} style={{ width: "100%" }}>
                {t(`dm.scenario.${s}`)}
              </SegButton>
            ))}
          </Grid>
        </Sub>

        <Sub>
          <div className="lbl">{t("dm.season.title")}</div>
          <WrapRow role="group" aria-label={t("dm.season.title")}>
            {seasons.map((s) => (
              <SegButton key={s} $active={season === s} onClick={() => setSeason(s)}>
                {t(`dm.season.${s}`)}
              </SegButton>
            ))}
          </WrapRow>
        </Sub>
      </PanelBody>
    </Panel>
  );
};
