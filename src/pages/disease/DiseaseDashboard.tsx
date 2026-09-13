import React, { useState } from "react";
import styled from "styled-components";
import { useDisease } from "../../state/DiseaseContext";
import { Page } from "../../styles/cc";
import Header from "../../components/disease/Header";
import MetricsRow from "../../components/disease/MetricsRow";
import MapView from "../../components/disease/MapView";
import AlertsPanel from "../../components/disease/AlertsPanel";
import { ForecastPanel, SeasonPanel } from "../../components/disease/ControlsPanel";
import Timeline from "../../components/disease/Timeline";
import SensorStrip from "../../components/disease/SensorStrip";
import ExpectedVsActual from "../../components/disease/ExpectedVsActual";
import ModelPerf from "../../components/disease/ModelPerf";
import NodeTable from "../../components/disease/NodeTable";
import { FootNote, MethodologyModal } from "../../components/disease/MethodologyNote";

const Main = styled.div`
  display: flex;
  gap: 12px;
  height: 60vh;
  min-height: 420px;

  @media (max-width: 1000px) {
    flex-direction: column;
    height: auto;
  }
`;

const Rail = styled.div`
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-inline-end: 2px;

  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const ChartsRow = styled.div`
  display: flex;
  gap: 12px;

  & > *:first-child {
    flex: 2;
    min-width: 0;
  }
  & > *:last-child {
    flex: 1;
    min-width: 260px;
  }
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const DiseaseDashboard: React.FC = () => {
  const { dir } = useDisease();
  const [methOpen, setMethOpen] = useState(false);

  return (
    <Page dir={dir}>
      <Header onMethodology={() => setMethOpen(true)} />
      <MetricsRow />

      <Main>
        <MapView />
        <Rail>
          <AlertsPanel />
          <ForecastPanel />
          <SeasonPanel />
        </Rail>
      </Main>

      <Timeline />
      <SensorStrip />

      <ChartsRow>
        <ExpectedVsActual />
        <ModelPerf />
      </ChartsRow>

      <NodeTable />
      <FootNote onOpen={() => setMethOpen(true)} />

      <MethodologyModal open={methOpen} onClose={() => setMethOpen(false)} />
    </Page>
  );
};

export default DiseaseDashboard;
