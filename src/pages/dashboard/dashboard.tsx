import React, { useRef, useEffect, useState, useCallback } from "react";
import MapComponent from "../../components/map/MapComponent";
import { fetchSymptoms, Symptom } from "../../services/symptomService";
import {
  DashboardContainer,
  MapControls,
  MapSection,
  FilterGroup,
  ChipRow,
  Chip,
  FilterLabel,
  FloatingCharts,
} from "../../styles/DashboardStyles";

import BottomCharts from "../../components/charts/BottomCharts";
import SideMenu from "../../components/SideMenu/SideMenu";
import { useTranslation } from "react-i18next";
import { LOCATIONS, LocationKey } from "../../constants/dashboard";

interface HealthDataEntry {
  AgeGroup: string;
  longitude: number;
  latitude: number;
  Sex: string;
  DistanceMetric: number;
  Symptoms: string[];
}

const ageGroupLabels = [
  "<20",
  "20-30",
  "30-40",
  "40-50",
  "50-60",
  "60-80",
  "80+",
];

const categorizeAgeGroup = (age: number): string => {
  if (age < 20) return "<20";
  if (age >= 20 && age < 30) return "20-30";
  if (age >= 30 && age < 40) return "30-40";
  if (age >= 40 && age < 50) return "40-50";
  if (age >= 50 && age < 60) return "50-60";
  if (age >= 60 && age < 80) return "60-80";
  return "80+";
};

const processSicknessData = (healthData: HealthDataEntry[]) => {
  const ageGroupCounts = ageGroupLabels.reduce(
    (acc, label) => {
      acc[label] = { sick: 0, notSick: 0 };
      return acc;
    },
    {} as Record<string, { sick: number; notSick: number }>,
  );

  healthData.forEach((entry) => {
    if (entry.AgeGroup && !isNaN(parseInt(entry.AgeGroup, 10))) {
      const ageGroup = categorizeAgeGroup(parseInt(entry.AgeGroup, 10));
      const isSick = entry.Symptoms && !entry.Symptoms.includes("none");

      if (ageGroupCounts[ageGroup]) {
        if (isSick) {
          ageGroupCounts[ageGroup].sick += 1;
        } else {
          ageGroupCounts[ageGroup].notSick += 1;
        }
      }
    }
  });

  return Object.entries(ageGroupCounts).map(([label, counts]) => ({
    ageGroup: label,
    Sick: counts.sick,
    NotSick: counts.notSick,
  }));
};

const processGenderSicknessData = (healthData: HealthDataEntry[]) => {
  let sickMale = 0,
    sickFemale = 0,
    nonSickMale = 0,
    nonSickFemale = 0;

  healthData.forEach((entry) => {
    const isSick = entry.Symptoms && !entry.Symptoms.includes("none");

    if (entry.Sex === "male") {
      if (isSick) {
        sickMale++;
      } else {
        nonSickMale++;
      }
    } else if (entry.Sex === "female") {
      if (isSick) {
        sickFemale++;
      } else {
        nonSickFemale++;
      }
    }
  });

  const total = sickMale + sickFemale + nonSickMale + nonSickFemale;

  // Return default structure with 0 values if no data is available
  if (total === 0) {
    return [
      { name: "Sick Male", value: 0 },
      { name: "Non-Sick Male", value: 0 },
      { name: "Sick Female", value: 0 },
      { name: "Non-Sick Female", value: 0 },
    ];
  }

  return [
    { name: "Sick Male", value: (sickMale / total) * 100 },
    { name: "Non-Sick Male", value: (nonSickMale / total) * 100 },
    { name: "Sick Female", value: (sickFemale / total) * 100 },
    { name: "Non-Sick Female", value: (nonSickFemale / total) * 100 },
  ];
};

const Dashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthDataEntry[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationKey>("siliconValley");
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState<string>("All");

  const ws = useRef<WebSocket | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar" | "ja">(
    "en",
  );

  const { t, i18n } = useTranslation();

  const sicknessData = processSicknessData(healthData);
  const genderSicknessData = processGenderSicknessData(healthData) || [
    { name: "Sick Male", value: 0 },
    { name: "Non-Sick Male", value: 0 },
    { name: "Sick Female", value: 0 },
    { name: "Non-Sick Female", value: 0 },
  ];

  const distanceMetrics = healthData.map((entry) => entry.DistanceMetric);

  const connectWebSocket = useCallback(() => {
    const websocketURL = process.env.REACT_APP_WEBSOCKET_URL || "";
    ws.current = new WebSocket(websocketURL);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");

      // Send initial data immediately after connection
      ws.current?.send(JSON.stringify({ action: "send_initial_data" }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
      if (data.message === "connected") {
        console.log("WebSocket confirmed connection");
      } else {
        // Handle health data updates
        const healthDataEntry = data as HealthDataEntry;
        if (healthDataEntry.Symptoms) {
          setHealthData((prevData) => [...prevData, healthDataEntry]);
        }
      }
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket connection closed unexpectedly");
      console.log(`Code: ${event.code}, Reason: ${event.reason}`);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    connectWebSocket(); // Initial connection attempt

    // Ping every 5 minutes to keep the connection alive
    const pingInterval = setInterval(
      () => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ action: "ping", message: "ping" }));
        }
      },
      5 * 60 * 1000,
    );

    return () => {
      clearInterval(pingInterval);
      ws.current?.close();
    };
  }, [connectWebSocket]);

  useEffect(() => {
    const loadSymptoms = async () => {
      try {
        const symptoms = await fetchSymptoms();
        setSymptomsList(symptoms);

        const withoutAll = symptoms.filter((s) => s.id !== "All");
        const fullList = [{ id: "All", label: "All 🔴" }, ...withoutAll];
        setSymptomsList(fullList);

        // Set default selected symptom to the first actual symptom (or "All" if none)
        setSelectedSymptom(withoutAll.length > 0 ? withoutAll[0].id : "All");
      } catch (error) {
        console.error("Failed to load symptoms", error);
      } finally {
        setLoadingSymptoms(false);
      }
    };
    loadSymptoms();
  }, []);

  const handleLanguageChange = useCallback((language: "en" | "ar" | "ja") => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* ------------------ SIDE MENU ------------------ */}
      <SideMenu
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* ------------------ MAIN DASHBOARD CONTENT ------------------ */}

      <DashboardContainer dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <MapSection>
          <MapComponent
            lat={LOCATIONS[selectedLocation].lat}
            lon={LOCATIONS[selectedLocation].lon}
            zoom={LOCATIONS[selectedLocation].zoom}
            points={healthData.map((entry) => ({
              lat: entry.latitude,
              lng: entry.longitude,
              intensity: 10,
            }))}
          />

          <MapControls>
            {/* Location group */}
            <FilterGroup>
              <FilterLabel>📍 {t("dashboard.location")}</FilterLabel>
              <ChipRow>
                {(Object.keys(LOCATIONS) as LocationKey[]).map((key) => (
                  <Chip
                    key={key}
                    $active={selectedLocation === key}
                    onClick={() => setSelectedLocation(key)}
                  >
                    {t(`dashboard.locations.${key}`)}
                  </Chip>
                ))}
              </ChipRow>
            </FilterGroup>

            {/* Symptoms group */}
            <FilterGroup>
              <FilterLabel>🤒 {t("dashboard.symptomsLabel")}</FilterLabel>
              {loadingSymptoms ? (
                <div style={{ color: "#ccc" }}>
                  {t("dashboard.loadingSymptoms")}
                </div>
              ) : (
                <ChipRow>
                  {symptomsList.map((symptom) => (
                    <Chip
                      key={symptom.id}
                      $active={selectedSymptom === symptom.id}
                      onClick={() => setSelectedSymptom(symptom.id)}
                    >
                      {t(`symptoms.${symptom.id}`)}
                    </Chip>
                  ))}
                </ChipRow>
              )}
            </FilterGroup>
          </MapControls>

          {/* Floating charts panel */}
          <FloatingCharts>
            <BottomCharts
              selectedLanguage={selectedLanguage}
              sicknessData={sicknessData}
              genderSicknessData={genderSicknessData}
              distanceMetrics={distanceMetrics}
            />
          </FloatingCharts>
        </MapSection>
      </DashboardContainer>
    </div>
  );
};

export default Dashboard;
