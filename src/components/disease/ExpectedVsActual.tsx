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
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useDisease } from "../../state/DiseaseContext";
import { expectedVsActual } from "../../data/simulation";
import { Panel, PanelHead, PanelTitle } from "../../styles/cc";

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
  const { sim, index, frame, dir } = useDisease();
  const data = expectedVsActual(sim, index);

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ ...glass, direction: dir }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ display: "flex", gap: 8, alignItems: "center", margin: "2px 0" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.color }} />
            <span style={{ color: "#97a4bd" }}>
              {p.dataKey === "predicted" ? t("dm.chart.evaPredicted") : t("dm.chart.evaActual")}:
            </span>
            <b style={{ fontFamily: "var(--font-num)" }}>{p.value ?? "—"}</b>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Panel style={{ display: "flex", flexDirection: "column" }}>
      <PanelHead>
        <PanelTitle>📈 {t("dm.chart.eva")}</PanelTitle>
        <span style={{ fontSize: 10.5, color: "var(--faint)", fontWeight: 600 }}>
          {t("dm.chart.evaUnit")}
        </span>
      </PanelHead>
      <div style={{ flex: 1, minHeight: 200, padding: "0 8px 10px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 14, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="evaActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              reversed={dir === "rtl"}
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              orientation={dir === "rtl" ? "right" : "left"}
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <Tooltip content={<Tip />} />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 11, color: "#97a4bd" }}
              formatter={(v) => (
                <span style={{ color: "#97a4bd" }}>
                  {v === "predicted" ? t("dm.chart.evaPredicted") : t("dm.chart.evaActual")}
                </span>
              )}
            />
            <ReferenceLine
              x={frame.label}
              stroke="rgba(34,211,238,0.55)"
              strokeDasharray="3 3"
              strokeWidth={1.2}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
              name="predicted"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#22d3ee"
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
