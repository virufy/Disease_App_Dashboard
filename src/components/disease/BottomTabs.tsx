import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FiTrendingUp, FiMapPin, FiActivity } from "react-icons/fi";
import { Segmented, SegButton } from "../../styles/cc";
import ExpectedVsActual from "./ExpectedVsActual";
import NodeTable from "./NodeTable";
import SensorStrip from "./SensorStrip";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;
const TabBar = styled(Segmented)`
  align-self: flex-start;
`;

type TabKey = "trend" | "locations" | "sensors";

const BottomTabs: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("trend");

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "trend", label: t("dm.tabs.trend"), icon: <FiTrendingUp size={13} /> },
    { key: "locations", label: t("dm.tabs.locations"), icon: <FiMapPin size={13} /> },
    { key: "sensors", label: t("dm.tabs.sensors"), icon: <FiActivity size={13} /> },
  ];

  return (
    <Wrap>
      <TabBar role="tablist">
        {tabs.map((tb) => (
          <SegButton
            key={tb.key}
            role="tab"
            aria-selected={tab === tb.key}
            $active={tab === tb.key}
            onClick={() => setTab(tb.key)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            {tb.icon} {tb.label}
          </SegButton>
        ))}
      </TabBar>

      {tab === "trend" && <ExpectedVsActual />}
      {tab === "locations" && <NodeTable />}
      {tab === "sensors" && <SensorStrip />}
    </Wrap>
  );
};

export default BottomTabs;
