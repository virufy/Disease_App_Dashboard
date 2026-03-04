import React, { useRef, useEffect, useState, useCallback } from "react";
import MapComponent from "../../components/map/MapComponent";
import { fetchSymptoms, Symptom } from "../../services/symptomService";
import {
  DashboardContainer,
  HeatmapContainer,
  HeatmapCard,
  SelectionContainer,
  SelectDropdown,
  DropdownOption,
  HeaderContainer,
} from "../../styles/DashboardStyles";

import BottomCharts from "../../components/charts/BottomCharts";
import SideMenu from "../../components/SideMenu/SideMenu";

interface HealthDataEntry {
  AgeGroup: string;
  longitude: number;
  latitude: number;
  Sex: string;
  DistanceMetric: number;
  Symptoms: string[];
}

const translations = {
  en: {
    languageLabel: "Language:",
    symptomsLabel: "Symptoms:",
    ageTitle: "Age",
    genderTitle: "Gender",
    coughStatsTitle: "Cough Statistics",
    chartKeys: {
      sick: "Sick",
      notSick: "NotSick",
    },
  },
  ar: {
    languageLabel: "اللغة:",
    symptomsLabel: "الأعراض:",
    ageTitle: "العمر",
    genderTitle: "الجنس",
    coughStatsTitle: "إحصائيات السعال",
    chartKeys: {
      sick: "مريض",
      notSick: "غير مريض",
    },
  },
  ja: {
    languageLabel: "言語:",
    symptomsLabel: "症状:",
    ageTitle: "年齢",
    genderTitle: "性別",
    coughStatsTitle: "咳の統計",
    chartKeys: {
      sick: "病気",
      notSick: "健康",
    },
  },
};

const genderTranslations = {
  en: {
    sickMale: "Sick Male",
    nonSickMale: "Non-Sick Male",
    sickFemale: "Sick Female",
    nonSickFemale: "Non-Sick Female",
  },
  ar: {
    sickMale: "ذكر مريض",
    nonSickMale: "ذكر غير مريض",
    sickFemale: "أنثى مريضة",
    nonSickFemale: "أنثى غير مريضة",
  },
  ja: {
    sickMale: "病気の男性",
    nonSickMale: "健康な男性",
    sickFemale: "病気の女性",
    nonSickFemale: "健康な女性",
  },
};

// const mean = 6.026709714020622;
// const stdDev = 2.170383376216376;

const mean = 2.170383376216376;
const stdDev = 2;

const LOCATIONS = {
  siliconValley: {
    label: "Silicon Valley",
    lat: 37.3382,
    lon: -121.8863,
    zoom: 10,
  },
  dubai: {
    label: "Dubai",
    lat: 25.2048,
    lon: 55.2708,
    zoom: 10,
  },
} as const;

type LocationKey = keyof typeof LOCATIONS;

const symptomsTranslations: Record<
  "en" | "ar" | "ja",
  Record<string, string>
> = {
  en: {
    All: "All 🔴",
    heavysmoker: "Heavy Smoker 🚬",
    cold: "Cold 🤒",
    influenza: "Influenza 😷",
    covid: "COVID 🤧",
    sars: "SARS 🦠",
    rsv: "RSV 🏥",
  },
  ar: {
    All: "الكل 🔴",
    heavysmoker: "مدخن ثقيل 🚬",
    cold: "نزلة برد 🤒",
    influenza: "إنفلونزا 😷",
    covid: "كوفيد 🤧",
    sars: "سارس 🦠",
    rsv: "الفيروس المخلوي التنفسي 🏥",
  },
  ja: {
    All: "すべて 🔴",
    heavysmoker: "ヘビースモーカー 🚬",
    cold: "風邪 🤒",
    influenza: "インフルエンザ 😷",
    covid: "COVID 🤧",
    sars: "SARS 🦠",
    rsv: "RSV 🏥",
  },
};

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
  const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);
  const [leftSymptoms, setLeftSymptoms] = useState<Symptom[]>([]);
  const [rightSymptoms, setRightSymptoms] = useState<Symptom[]>([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

  // Change selected symptoms to string (they were SymptomKey before)
  const [selectedSymptomsLeft, setSelectedSymptomsLeft] =
    useState<string>("All");
  const [selectedSymptomsRight, setSelectedSymptomsRight] =
    useState<string>("All");
  const ws = useRef<WebSocket | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar" | "ja">(
    "en",
  );

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const updateScreenSize = () => setIsDesktop(window.innerWidth > 768);

  const t = translations[selectedLanguage];
  const tg = genderTranslations[selectedLanguage];

  const sicknessData = processSicknessData(healthData);
  const genderSicknessData = processGenderSicknessData(healthData) || [
    { name: "Sick Male", value: 0 },
    { name: "Non-Sick Male", value: 0 },
    { name: "Sick Female", value: 0 },
    { name: "Non-Sick Female", value: 0 },
  ];

  const distanceMetrics = healthData.map((entry) => entry.DistanceMetric);

  const COLORS = ["#FF6B6B", "#4ECDC4", "#1A535C", "#B565A7"];

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
        setAllSymptoms(symptoms);

        // Split into two halves (excluding "All" for the split, then add "All" to both)
        const withoutAll = symptoms.filter((s) => s.id !== "All");
        const midpoint = Math.ceil(withoutAll.length / 2);
        const left = withoutAll.slice(0, midpoint);
        const right = withoutAll.slice(midpoint);

        // Add "All" at the beginning of each list
        const leftWithAll = [{ id: "All", label: "All 🔴" }, ...left];
        const rightWithAll = [{ id: "All", label: "All 🔴" }, ...right];
        setLeftSymptoms(leftWithAll);
        setRightSymptoms(rightWithAll);

        // Left map defaults to the first actual symptom (if available), otherwise "All"
        setSelectedSymptomsLeft(left.length > 0 ? left[0].id : "All");
        // Right map defaults to the first actual symptom (if available), otherwise "All"
        setSelectedSymptomsRight(
          right.length > 0
            ? right[0].id
            : right.length > 0
              ? right[0].id
              : "All",
        );
      } catch (error) {
        console.error("Failed to load symptoms", error);
      } finally {
        setLoadingSymptoms(false);
      }
    };
    loadSymptoms();
  }, []);

  const handleSymptomSelectLeft = useCallback((symptom: string) => {
    setSelectedSymptomsLeft(symptom);
  }, []);

  const handleSymptomSelectRight = useCallback((symptom: string) => {
    setSelectedSymptomsRight(symptom);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const handleLanguageChange = useCallback((language: "en" | "ar" | "ja") => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
  }, []);

  const CustomTooltipBar = ({ payload, label, active }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          {payload.map((entry: any, index: number) => {
            const localizedName =
              entry.name === "Sick" ? t.chartKeys.sick : t.chartKeys.notSick;
            return (
              <p
                key={index}
                style={{
                  margin: "5px 0",
                  color: entry.color, // Use the color of the bar
                }}
              >
                {`${localizedName}: ${entry.value}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ------------------ SIDE MENU ------------------ */}
      <SideMenu
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* ------------------ MAIN DASHBOARD CONTENT ------------------ */}
      <div
        style={{ flex: 1, overflowY: "auto", flexDirection: "column" }}
      ></div>
      <DashboardContainer dir={selectedLanguage === "ar" ? "rtl" : "ltr"}>
        <HeaderContainer style={{ marginBottom: "4px" }}>
          <SelectionContainer
            style={{
              width: "140px",
              right: "80px",
              position: "absolute",
            }}
          >
            <label style={{ fontSize: "14px", marginBottom: "4px" }}>
              Location:
            </label>
            <SelectDropdown $isArabic={selectedLanguage === "ar"}>
              {(Object.keys(LOCATIONS) as LocationKey[]).map((key) => (
                <DropdownOption
                  key={key}
                  onClick={() => setSelectedLocation(key)}
                  className="dropdown-option"
                  style={{
                    fontWeight: selectedLocation === key ? "bold" : "normal",
                    color: selectedLocation === key ? "#007bff" : "black",
                  }}
                >
                  {LOCATIONS[key].label}
                </DropdownOption>
              ))}
            </SelectDropdown>
          </SelectionContainer>
        </HeaderContainer>
        <HeatmapContainer>
          <HeatmapCard>
            <MapComponent
              lat={LOCATIONS[selectedLocation].lat}
              lon={LOCATIONS[selectedLocation].lon}
              zoom={LOCATIONS[selectedLocation].zoom}
              points={healthData
                .filter((entry) => {
                  if (selectedSymptomsLeft === "All") {
                    return !entry.Symptoms.includes("none");
                  }
                  return entry.Symptoms.includes(selectedSymptomsLeft);
                })
                .map((entry) => ({
                  lat: entry.latitude,
                  lng: entry.longitude,
                  intensity: 10,
                }))}
            />

            <SelectionContainer>
              <label style={{ fontSize: "14px", marginBottom: "10px" }}>
                {t.symptomsLabel}
              </label>
              {loadingSymptoms ? (
                <div>Loading symptoms...</div>
              ) : (
                <SelectDropdown $isArabic={selectedLanguage === "ar"}>
                  {leftSymptoms.map((symptom) => (
                    <DropdownOption
                      key={symptom.id}
                      onClick={() => setSelectedSymptomsLeft(symptom.id)}
                      className="dropdown-option"
                      style={{
                        fontWeight:
                          selectedSymptomsLeft === symptom.id
                            ? "bold"
                            : "normal",
                        color:
                          selectedSymptomsLeft === symptom.id
                            ? "#007bff"
                            : "black",
                      }}
                    >
                      {/* Use translation if available, otherwise the label */}
                      {symptomsTranslations?.[selectedLanguage]?.[symptom.id] ||
                        symptom.label}
                    </DropdownOption>
                  ))}
                </SelectDropdown>
              )}
            </SelectionContainer>
          </HeatmapCard>
          {isDesktop && (
            <HeatmapCard>
              <MapComponent
                lat={LOCATIONS[selectedLocation].lat}
                lon={LOCATIONS[selectedLocation].lon}
                zoom={LOCATIONS[selectedLocation].zoom}
                points={healthData
                  .filter((entry) => {
                    if (selectedSymptomsRight === "All") {
                      return !entry.Symptoms.includes("none");
                    }
                    return entry.Symptoms.includes(selectedSymptomsRight);
                  })
                  .map((entry) => ({
                    lat: entry.latitude,
                    lng: entry.longitude,
                    intensity: 10,
                  }))}
              />

              <SelectionContainer>
                <label style={{ fontSize: "14px", marginBottom: "10px" }}>
                  {t.symptomsLabel}
                </label>
                {loadingSymptoms ? (
                  <div>Loading symptoms...</div>
                ) : (
                  <SelectDropdown $isArabic={selectedLanguage === "ar"}>
                    {rightSymptoms.map((symptom) => (
                      <DropdownOption
                        key={symptom.id}
                        onClick={() => setSelectedSymptomsRight(symptom.id)}
                        className="dropdown-option"
                        style={{
                          fontWeight:
                            selectedSymptomsRight === symptom.id
                              ? "bold"
                              : "normal",
                          color:
                            selectedSymptomsRight === symptom.id
                              ? "#007bff"
                              : "black",
                        }}
                      >
                        {/* Use translation if available, otherwise the label */}
                        {symptomsTranslations?.[selectedLanguage]?.[
                          symptom.id
                        ] || symptom.label}
                      </DropdownOption>
                    ))}
                  </SelectDropdown>
                )}
              </SelectionContainer>
            </HeatmapCard>
          )}
        </HeatmapContainer>
        <BottomCharts
          ageTitle={t.ageTitle}
          genderTitle={t.genderTitle}
          coughStatsTitle={t.coughStatsTitle}
          chartKeys={t.chartKeys}
          sicknessData={sicknessData}
          genderSicknessData={genderSicknessData}
          genderTranslationsForLang={genderTranslations[selectedLanguage]}
          colors={COLORS}
          selectedLanguage={selectedLanguage}
          mean={mean}
          stdDev={stdDev}
          distanceMetrics={distanceMetrics}
        />
      </DashboardContainer>
    </div>
  );
};

export default Dashboard;
