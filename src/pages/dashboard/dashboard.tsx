import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import MapComponent, { ClusterPoint } from "../../components/map/MapComponent";
import { fetchSymptoms, Symptom } from "../../services/symptomService";
import {
  DashboardContainer,
  MapControls,
  MapSection,
  FilterGroup,
  FilterDivider,
  FilterBadge,
  ChipRow,
  Chip,
  FilterLabel,
  FloatingCharts,
  KPIBar,
  KPICard,
  KPIValue,
  KPILabel,
  EmptyStateOverlay,
} from "../../styles/DashboardStyles";

import BottomCharts from "../../components/charts/BottomCharts";
import SideMenu from "../../components/SideMenu/SideMenu";
import HeatmapLegend from "../../components/map/HeatmapLegend";
import { useTranslation } from "react-i18next";
import { LOCATIONS, LocationKey } from "../../constants/dashboard";
import { IoDownloadOutline } from "react-icons/io5";

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

const processSicknessData = (data: HealthDataEntry[]) => {
  const counts = ageGroupLabels.reduce(
    (acc, label) => {
      acc[label] = { sick: 0, notSick: 0 };
      return acc;
    },
    {} as Record<string, { sick: number; notSick: number }>,
  );

  data.forEach((entry) => {
    if (entry.AgeGroup && !isNaN(parseInt(entry.AgeGroup, 10))) {
      const group = categorizeAgeGroup(parseInt(entry.AgeGroup, 10));
      const isSick = entry.Symptoms && !entry.Symptoms.includes("none");
      if (counts[group]) {
        if (isSick) counts[group].sick += 1;
        else counts[group].notSick += 1;
      }
    }
  });

  return Object.entries(counts).map(([label, c]) => ({
    ageGroup: label,
    Sick: c.sick,
    NotSick: c.notSick,
  }));
};

const processGenderSicknessData = (data: HealthDataEntry[]) => {
  let sickMale = 0,
    sickFemale = 0,
    nonSickMale = 0,
    nonSickFemale = 0;

  data.forEach((entry) => {
    const isSick = entry.Symptoms && !entry.Symptoms.includes("none");
    if (entry.Sex === "male") {
      if (isSick) sickMale++;
      else nonSickMale++;
    } else if (entry.Sex === "female") {
      if (isSick) sickFemale++;
      else nonSickFemale++;
    }
  });

  const total = sickMale + sickFemale + nonSickMale + nonSickFemale;
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

  // Multi-select: empty array = no symptom filter (show all)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const ws = useRef<WebSocket | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar" | "ja">(
    "en",
  );

  const { t, i18n } = useTranslation();

  // ── Symptom multi-select logic ──────────────────────────────────────────────

  const handleSymptomClick = useCallback((symptomId: string) => {
    if (symptomId === "All") {
      setSelectedSymptoms([]);
      return;
    }
    setSelectedSymptoms((prev) => {
      const isSelected = prev.includes(symptomId);
      return isSelected
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId];
    });
  }, []);

  const isAllActive = selectedSymptoms.length === 0;

  // ── Location-bounded data (before symptom filter) ───────────────────────────

  const locationBoundedData = useMemo(() => {
    const { bounds } = LOCATIONS[selectedLocation];
    return healthData.filter(
      (entry) =>
        entry.latitude >= bounds.latMin &&
        entry.latitude <= bounds.latMax &&
        entry.longitude >= bounds.lonMin &&
        entry.longitude <= bounds.lonMax,
    );
  }, [healthData, selectedLocation]);

  // ── Filtered data (location + symptom) ─────────────────────────────────────

  const filteredHealthData = useMemo(() => {
    if (selectedSymptoms.length === 0) return locationBoundedData;
    return locationBoundedData.filter((entry) =>
      entry.Symptoms?.some((s) => selectedSymptoms.includes(s)),
    );
  }, [locationBoundedData, selectedSymptoms]);

  // ── Per-symptom counts (for chip labels) ───────────────────────────────────

  const symptomCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    locationBoundedData.forEach((entry) => {
      entry.Symptoms?.forEach((s) => {
        if (s !== "none") counts[s] = (counts[s] || 0) + 1;
      });
    });
    return counts;
  }, [locationBoundedData]);

  // ── KPI summary values ──────────────────────────────────────────────────────

  const kpiData = useMemo(() => {
    const total = filteredHealthData.length;
    if (total === 0) return { sickRate: 0, topAgeGroup: "—", topSymptom: "—" };

    const sickCount = filteredHealthData.filter(
      (e) => !e.Symptoms?.includes("none"),
    ).length;

    const ageCounts: Record<string, number> = {};
    filteredHealthData.forEach((e) => {
      if (e.AgeGroup && !isNaN(parseInt(e.AgeGroup, 10))) {
        const g = categorizeAgeGroup(parseInt(e.AgeGroup, 10));
        ageCounts[g] = (ageCounts[g] || 0) + 1;
      }
    });
    const topAgeGroup =
      Object.entries(ageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    const symFreq: Record<string, number> = {};
    filteredHealthData.forEach((e) => {
      e.Symptoms?.forEach((s) => {
        if (s !== "none") symFreq[s] = (symFreq[s] || 0) + 1;
      });
    });
    const topSymptomId =
      Object.entries(symFreq).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topSymptom = topSymptomId
      ? (symptomsList.find((s) => s.id === topSymptomId)?.label ?? topSymptomId)
      : "—";

    return {
      sickRate: Math.round((sickCount / total) * 100),
      topAgeGroup,
      topSymptom,
    };
  }, [filteredHealthData, symptomsList]);

  // ── Map cluster points ──────────────────────────────────────────────────────

  const mapClusters = useMemo<ClusterPoint[]>(() => {
    const cells: Record<
      string,
      { lat: number; lng: number; count: number; sick: number; symptoms: Record<string, number> }
    > = {};

    filteredHealthData.forEach((entry) => {
      const key = `${Math.round(entry.latitude * 10) / 10},${Math.round(entry.longitude * 10) / 10}`;
      if (!cells[key]) {
        cells[key] = {
          lat: Math.round(entry.latitude * 10) / 10,
          lng: Math.round(entry.longitude * 10) / 10,
          count: 0,
          sick: 0,
          symptoms: {},
        };
      }
      cells[key].count++;
      if (!entry.Symptoms?.includes("none")) cells[key].sick++;
      entry.Symptoms?.forEach((s) => {
        if (s !== "none")
          cells[key].symptoms[s] = (cells[key].symptoms[s] || 0) + 1;
      });
    });

    return Object.values(cells).map((cell) => {
      const topSymptom =
        Object.entries(cell.symptoms).sort((a, b) => b[1] - a[1])[0]?.[0] ??
        "none";
      return {
        lat: cell.lat,
        lng: cell.lng,
        count: cell.count,
        sickRate:
          cell.count > 0 ? Math.round((cell.sick / cell.count) * 100) : 0,
        topSymptom,
      };
    });
  }, [filteredHealthData]);

  // ── Chart derived data ──────────────────────────────────────────────────────

  const sicknessData = useMemo(
    () => processSicknessData(filteredHealthData),
    [filteredHealthData],
  );

  const genderSicknessData = useMemo(
    () =>
      processGenderSicknessData(filteredHealthData) ?? [
        { name: "Sick Male", value: 0 },
        { name: "Non-Sick Male", value: 0 },
        { name: "Sick Female", value: 0 },
        { name: "Non-Sick Female", value: 0 },
      ],
    [filteredHealthData],
  );

  const distanceMetrics = useMemo(
    () => filteredHealthData.map((e) => e.DistanceMetric),
    [filteredHealthData],
  );

  // ── CSV export ──────────────────────────────────────────────────────────────

  const handleExportCSV = useCallback(() => {
    const headers = [
      "Age Group",
      "Sex",
      "Latitude",
      "Longitude",
      "Distance Metric",
      "Symptoms",
    ];
    const rows = filteredHealthData.map((e) => [
      e.AgeGroup ?? "",
      e.Sex ?? "",
      e.latitude,
      e.longitude,
      e.DistanceMetric,
      (e.Symptoms ?? []).join(";"),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `disease-data-${selectedLocation}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredHealthData, selectedLocation]);

  // ── WebSocket ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const websocketURL = process.env.REACT_APP_WEBSOCKET_URL || "";
    if (!websocketURL) {
      console.warn("REACT_APP_WEBSOCKET_URL is not set — dashboard has no data source");
      return undefined;
    }

    // Scope this socket to a local const. Every handler below references `socket`
    // (never the shared `ws.current`), so under React StrictMode's dev-only
    // mount→unmount→remount, an old socket's handlers can never close the new one.
    const socket = new WebSocket(websocketURL);
    ws.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send(JSON.stringify({ action: "send_initial_data" }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message === "connected") {
        console.log("WebSocket confirmed connection");
      } else {
        const entry = data as HealthDataEntry;
        if (entry.Symptoms) {
          setHealthData((prev) => [...prev, entry]);
        }
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed", event.code, event.reason);
    };

    // Do NOT close() here — the browser already tears the socket down on error,
    // and closing the shared ref would kill an unrelated (newer) socket.
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    const pingInterval = setInterval(
      () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ action: "ping", message: "ping" }));
        }
      },
      5 * 60 * 1000,
    );

    return () => {
      clearInterval(pingInterval);
      // Closing a socket that's still CONNECTING triggers a spurious 1006 and the
      // "closed before established" warning. Defer the close until it has opened.
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      } else if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener("open", () => socket.close());
      }
    };
  }, []);

  useEffect(() => {
    const loadSymptoms = async () => {
      try {
        const symptoms = await fetchSymptoms();
        const withoutAll = symptoms.filter((s) => s.id !== "All");
        setSymptomsList([{ id: "All", label: "All" }, ...withoutAll]);
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
  }, []);

  const hasData = healthData.length > 0;
  const isEmpty = hasData && filteredHealthData.length === 0;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* ── Side Menu ─────────────────────────────────────────────────────── */}
      <SideMenu
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        totalRecords={healthData.length}
        filteredRecords={filteredHealthData.length}
      />

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <DashboardContainer dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <MapSection>
          {/* Map */}
          <MapComponent
            lat={LOCATIONS[selectedLocation].lat}
            lon={LOCATIONS[selectedLocation].lon}
            zoom={LOCATIONS[selectedLocation].zoom}
            points={filteredHealthData.map((entry) => ({
              lat: entry.latitude,
              lng: entry.longitude,
              intensity: 10,
            }))}
            clusters={mapClusters}
          />

          {/* Heatmap legend */}
          <HeatmapLegend />

          {/* ── Filter Bar ──────────────────────────────────────────────── */}
          <MapControls>
            {/* Location */}
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

            <FilterDivider />

            {/* Symptoms (multi-select with counts) */}
            <FilterGroup>
              <FilterLabel>
                🧬 {t("dashboard.symptomsLabel")}
                {selectedSymptoms.length > 0 && (
                  <FilterBadge>{selectedSymptoms.length}</FilterBadge>
                )}
              </FilterLabel>
              {loadingSymptoms ? (
                <span style={{ color: "#9ca3af", fontSize: 11 }}>
                  {t("dashboard.loadingSymptoms")}
                </span>
              ) : (
                <ChipRow>
                  {symptomsList.map((symptom) => {
                    const count =
                      symptom.id !== "All"
                        ? symptomCounts[symptom.id] ?? 0
                        : null;
                    return (
                      <Chip
                        key={symptom.id}
                        $active={
                          symptom.id === "All"
                            ? isAllActive
                            : selectedSymptoms.includes(symptom.id)
                        }
                        onClick={() => handleSymptomClick(symptom.id)}
                      >
                        {t(`symptoms.${symptom.id}`)}
                        {count !== null && (
                          <span
                            style={{
                              marginLeft: 4,
                              opacity: 0.7,
                              fontSize: "0.9em",
                            }}
                          >
                            ({count})
                          </span>
                        )}
                      </Chip>
                    );
                  })}
                </ChipRow>
              )}
            </FilterGroup>

            <FilterDivider />

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              disabled={filteredHealthData.length === 0}
              title={`Export ${filteredHealthData.length} records as CSV`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                background:
                  filteredHealthData.length > 0
                    ? "linear-gradient(135deg, #1d4ed8, #4f46e5)"
                    : "rgba(0,0,0,0.04)",
                color:
                  filteredHealthData.length > 0 ? "#ffffff" : "#9ca3af",
                border: "none",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                cursor:
                  filteredHealthData.length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <IoDownloadOutline size={13} />
              Export
            </button>
          </MapControls>

          {/* ── KPI Summary Bar ─────────────────────────────────────────── */}
          {hasData && (
            <KPIBar>
              <KPICard $color="#3b82f6">
                <KPIValue>
                  {filteredHealthData.length.toLocaleString("en-US")}
                </KPIValue>
                <KPILabel>Total Cases</KPILabel>
              </KPICard>
              <KPICard $color="#ef4444">
                <KPIValue>{kpiData.sickRate}%</KPIValue>
                <KPILabel>Sick Rate</KPILabel>
              </KPICard>
              <KPICard $color="#8b5cf6">
                <KPIValue>{kpiData.topAgeGroup}</KPIValue>
                <KPILabel>Top Age Group</KPILabel>
              </KPICard>
              <KPICard $color="#f59e0b">
                <KPIValue
                  style={{ fontSize: 13, letterSpacing: 0 }}
                  title={kpiData.topSymptom}
                >
                  {kpiData.topSymptom.length > 12
                    ? `${kpiData.topSymptom.slice(0, 12)}…`
                    : kpiData.topSymptom}
                </KPIValue>
                <KPILabel>Top Symptom</KPILabel>
              </KPICard>
            </KPIBar>
          )}

          {/* ── Charts Panel ────────────────────────────────────────────── */}
          <FloatingCharts>
            {isEmpty ? (
              <EmptyStateOverlay>
                <div style={{ fontSize: 28, lineHeight: 1 }}>🔍</div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}
                >
                  No data matches your filters
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  Try a different location or adjust the symptom selection
                </div>
              </EmptyStateOverlay>
            ) : (
              <BottomCharts
                selectedLanguage={selectedLanguage}
                sicknessData={sicknessData}
                genderSicknessData={genderSicknessData}
                distanceMetrics={distanceMetrics}
              />
            )}
          </FloatingCharts>
        </MapSection>
      </DashboardContainer>
    </div>
  );
};

export default Dashboard;
