import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { ScenarioKey, SeasonKey } from "../../data/types";
import { Panel, PanelHead, PanelTitle, PanelBody, SegButton } from "../../styles/cc";

const Hint = styled.p`
  margin: 0 0 10px;
  font-size: 11px;
  color: var(--muted);
  line-height: 1.4;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

const scenarios: ScenarioKey[] = ["none", "hajjInflux", "dustStorm", "newVariant"];
const seasons: SeasonKey[] = ["baseline", "hajj", "umrah", "dust", "winter"];

export const ForecastPanel: React.FC = () => {
  const { t } = useTranslation();
  const { scenario, setScenario } = useDisease();
  return (
    <Panel>
      <PanelHead>
        <PanelTitle>🎛 {t("dm.forecast.title")}</PanelTitle>
      </PanelHead>
      <PanelBody>
        <Hint>{t("dm.forecast.hint")}</Hint>
        <Grid role="group" aria-label={t("dm.forecast.title")}>
          {scenarios.map((s) => (
            <SegButton
              key={s}
              $active={scenario === s}
              onClick={() => setScenario(s)}
              style={{ width: "100%" }}
            >
              {t(`dm.scenario.${s}`)}
            </SegButton>
          ))}
        </Grid>
      </PanelBody>
    </Panel>
  );
};

export const SeasonPanel: React.FC = () => {
  const { t } = useTranslation();
  const { season, setSeason } = useDisease();
  return (
    <Panel>
      <PanelHead>
        <PanelTitle>🗓 {t("dm.season.title")}</PanelTitle>
      </PanelHead>
      <PanelBody>
        <Grid role="group" aria-label={t("dm.season.title")} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          {seasons.map((s) => (
            <SegButton
              key={s}
              $active={season === s}
              onClick={() => setSeason(s)}
              style={{ width: "100%" }}
            >
              {t(`dm.season.${s}`)}
            </SegButton>
          ))}
        </Grid>
      </PanelBody>
    </Panel>
  );
};
