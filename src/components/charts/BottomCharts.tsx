import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BottomCardsContainer, BottomCard } from "../../styles/DashboardStyles";
import DistanceMetricChart from "./DistanceMetricChart";

interface BottomChartsProps {
  ageTitle: string;
  genderTitle: string;
  coughStatsTitle: string;
  chartKeys: { sick: string; notSick: string };
  sicknessData: Array<{ ageGroup: string; Sick: number; NotSick: number }>;
  genderSicknessData: Array<{ name: string; value: number }>;
  genderTranslationsForLang: {
    sickMale: string;
    nonSickMale: string;
    sickFemale: string;
    nonSickFemale: string;
  };
  colors: string[];
  selectedLanguage: "en" | "ar" | "ja";
  mean: number;
  stdDev: number;
  distanceMetrics: number[];
}

const BottomCharts: React.FC<BottomChartsProps> = ({
  ageTitle,
  genderTitle,
  coughStatsTitle,
  chartKeys,
  sicknessData,
  genderSicknessData,
  genderTranslationsForLang,
  colors,
  selectedLanguage,
  mean,
  stdDev,
  distanceMetrics,
}) => {
  // Custom tooltip for bar chart (uses chartKeys for translation)
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
              entry.name === "Sick" ? chartKeys.sick : chartKeys.notSick;
            return (
              <p
                key={index}
                style={{
                  margin: "5px 0",
                  color: entry.color,
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

  // Custom tooltip for pie chart (uses genderTranslationsForLang)
  const CustomTooltipPie = ({ payload, active }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const localizedName =
        name === "Sick Male"
          ? genderTranslationsForLang.sickMale
          : name === "Non-Sick Male"
            ? genderTranslationsForLang.nonSickMale
            : name === "Sick Female"
              ? genderTranslationsForLang.sickFemale
              : genderTranslationsForLang.nonSickFemale;
      const isRTL = selectedLanguage === "ar";

      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
            textAlign: isRTL ? "right" : "left",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <p
            style={{ margin: 0 }}
          >{`${localizedName}: ${value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const renderYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const isRTL = selectedLanguage === "ar";
    const dx = isRTL ? 0 : -10;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dx={dx}
          dy={4}
          textAnchor={isRTL ? "end" : "start"}
          fill="#666"
        >
          {Number.isInteger(payload.value)
            ? payload.value
            : payload.value.toFixed(0)}
        </text>
      </g>
    );
  };

  return (
    <BottomCardsContainer>
      {/* Age Chart */}
      <BottomCard>
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "10px",
            height: "5%",
            fontSize: "100%",
          }}
        >
          {ageTitle}
        </div>
        <ResponsiveContainer width="100%" height="93%">
          <BarChart
            data={
              selectedLanguage === "ar"
                ? [...sicknessData].reverse()
                : sicknessData
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ageGroup" />
            <YAxis
              orientation={selectedLanguage === "ar" ? "right" : "left"}
              tickFormatter={(value) =>
                Number.isInteger(value) ? value.toString() : value.toFixed(0)
              }
              allowDecimals={false}
              domain={[0, "auto"]}
              tick={renderYAxisTick}
            />
            <Tooltip content={<CustomTooltipBar />} />
            <Legend
              wrapperStyle={{
                fontSize: selectedLanguage === "ar" ? "14px" : "12px",
              }}
              formatter={(value) => {
                return selectedLanguage === "ar" ? `  ${value}  ` : value;
              }}
            />
            <Bar dataKey="Sick" name={chartKeys.sick} fill="#FF6B6B" />
            <Bar dataKey="NotSick" name={chartKeys.notSick} fill="#4ECDC4" />
          </BarChart>
        </ResponsiveContainer>
      </BottomCard>

      {/* Gender Chart */}
      <BottomCard>
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "10px",
            height: "5%",
            fontSize: "100%",
          }}
        >
          {genderTitle}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={genderSicknessData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              fill="#8884d8"
              labelLine={false}
            >
              {genderSicknessData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipPie />} />
            <Legend
              iconSize={14}
              wrapperStyle={{
                fontSize: selectedLanguage === "ar" ? "14px" : "12px",
                direction: selectedLanguage === "ar" ? "rtl" : "ltr",
              }}
              formatter={(value) => {
                const translated =
                  value === "Sick Male"
                    ? genderTranslationsForLang.sickMale
                    : value === "Non-Sick Male"
                      ? genderTranslationsForLang.nonSickMale
                      : value === "Sick Female"
                        ? genderTranslationsForLang.sickFemale
                        : genderTranslationsForLang.nonSickFemale;
                return selectedLanguage === "ar"
                  ? `‎‎  ${translated}  ‎‎`
                  : translated;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </BottomCard>

      {/* Cough Statistics Chart */}
      <BottomCard>
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "10px",
            height: "4%",
            fontSize: "100%",
          }}
        >
          {coughStatsTitle}
        </div>
        <DistanceMetricChart
          mean={mean}
          stdDev={stdDev}
          distanceMetrics={distanceMetrics}
          language={selectedLanguage}
        />
      </BottomCard>
    </BottomCardsContainer>
  );
};

export default BottomCharts;
