import React from "react";
import styled from "styled-components";
import { useDisease } from "../../state/DiseaseContext";
import { Page } from "../../styles/cc";
import Header from "../../components/disease/Header";
import MetricsRow from "../../components/disease/MetricsRow";
import GlobalFilterBar from "../../components/disease/GlobalFilterBar";
import MapView from "../../components/disease/MapView";
import AlertsPanel from "../../components/disease/AlertsPanel";
import LiveFeed from "../../components/disease/LiveFeed";
import { ModeledPanel } from "../../components/disease/ControlsPanel";
import QRCard from "../../components/disease/QRCard";
import Timeline from "../../components/disease/Timeline";
import BottomTabs from "../../components/disease/BottomTabs";

const Main = styled.div`
  display: flex;
  gap: 12px;
  height: 66vh;
  min-height: 460px;
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
const DiseaseDashboard: React.FC = () => {
  const { dir } = useDisease();

  return (
    <Page dir={dir}>
      <Header />
      <MetricsRow />
      <GlobalFilterBar />

      <Main>
        <MapView />
        <Rail>
          <AlertsPanel />
          <LiveFeed />
          <ModeledPanel />
          <QRCard />
        </Rail>
      </Main>

      <Timeline />

      <BottomTabs />
    </Page>
  );
};

export default DiseaseDashboard;
