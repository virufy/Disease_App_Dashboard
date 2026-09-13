import React from "react";
import { useTranslation } from "react-i18next";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiTrendingUp } from "react-icons/fi";
import { useDisease } from "../../state/DiseaseContext";
import { volumeSeriesFiltered } from "../../data/derive";
import { Panel, PanelHead, PanelTitle, Chip } from "../../styles/cc";

const glass: React.CSSProperties = {
  background: "rgba(18,24,38,0.95)",
  border: "1px solid rgba(148,163,184,0.26)",
  borderRadius: 12,
  padding: "9px 12px",
  fontSize: 12,
  color: "#e8edf6",
  boxShadow: "0 14px 34px -14px rgba(0,0,0,0.8)",
};

const ExpectedVsActual: React.FC = () => {
  const { t } = useTranslation();
  const { filteredAll, total, visibleCount, season, scenario, dir } = useDisease();
  const data = volumeSeriesFiltered(filteredAll, total, visibleCount, season, scenario);

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ ...glass, direction: dir }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ display: "flex", gap: 8, alignItems: "center", margin: "2px 0" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.color }} />
            <span style={{ color: "#97a4bd" }}>
              {p.dataKey === "modeled" ? t("dm.chart.modeled") : t("dm.chart.actual")}:
            </span>
            <b style={{ fontFamily: "var(--font-num)" }}>{p.value ?? "n/a"}</b>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Panel>
      <PanelHead>
        <PanelTitle><FiTrendingUp size={13} /> {t("dm.chart.title")}</PanelTitle>
        <Chip $tone="#fcd34d">{t("dm.tag.modeledLine")}</Chip>
      </PanelHead>
      <div style={{ height: 280, padding: "0 8px 12px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 14, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="evaActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4d8df6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#4d8df6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              reversed={dir === "rtl"}
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              minTickGap={26}
            />
            <YAxis
              orientation={dir === "rtl" ? "right" : "left"}
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<Tip />} />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 11 }}
              formatter={(v) => (
                <span style={{ color: "#97a4bd" }}>
                  {v === "modeled" ? t("dm.chart.modeled") : t("dm.chart.actual")}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="modeled"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
              name="modeled"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#4d8df6"
              strokeWidth={2.4}
              fill="url(#evaActual)"
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
              name="actual"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
};

export default ExpectedVsActual;
