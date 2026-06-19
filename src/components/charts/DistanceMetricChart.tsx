import React from 'react';
import { ComposedChart, Scatter, Line, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';

interface DistanceMetricChartProps {
  mean: number;
  stdDev: number;
  distanceMetrics: number[];
  language: 'en' | 'ar' | 'ja';
}

const translations = {
  en: {
    distanceMetric: "Distance Metric",
    probabilityDensity: "Probability Density",
    tooltipDistance: "Distance Metric",
    tooltipProbability: "Probability",
  },
  ar: {
    distanceMetric: "مقياس المسافة",
    probabilityDensity: "كثافة الاحتمال",
    tooltipDistance: "مقياس المسافة",
    tooltipProbability: "الاحتمال",
  },
  ja: {
    distanceMetric: "距離メトリック",
    probabilityDensity: "確率密度",
    tooltipDistance: "距離メトリック",
    tooltipProbability: "確率",
  },
};

const generateBellCurveData = (mean: number, stdDev: number) => {
  const data = [];
  for (let i = mean - 3 * stdDev; i <= mean + 3 * stdDev; i += 0.1) {
    const probabilityDensity =
      (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((i - mean) / stdDev) ** 2);
    data.push({ x: i, y: probabilityDensity });
  }
  return data;
};

const generateColor = (index: number, total: number) => {
  // Gradient from teal (low) through amber to red (high) — matches heatmap ramp
  const palette = ['#0d9488', '#06b6d4', '#fbbf24', '#ef4444'];
  if (total <= 1) return palette[3];
  const t = index / (total - 1);
  if (t >= 0.75) return palette[3];
  if (t >= 0.5)  return palette[2];
  if (t >= 0.25) return palette[1];
  return palette[0];
};

const CustomTooltip = ({ active, payload, label, language }: any) => {
  if (active && payload && payload.length) {
    const t = translations[language as 'en' | 'ar' | 'ja'];
    const bellCurveValue = payload.find((entry: any) => entry.name === "Probability");
    const isRTL = language === 'ar';

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontSize: 12,
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <p style={{ margin: '0 0 4px', color: '#ef4444', fontWeight: 500 }}>{`${t.tooltipDistance}: ${label.toFixed(2)}`}</p>
        {bellCurveValue && (
          <p style={{ margin: 0, color: '#14b8a6' }}>{`${t.tooltipProbability}: ${bellCurveValue.value.toFixed(4)}`}</p>
        )}
      </div>
    );
  }
  return null;
};

const generateTicks = (min: number, max: number) => {
  const interval = (max - min) / 4;
  return [min, min + interval, min + 2 * interval, min + 3 * interval, max];
};

const DistanceMetricChart: React.FC<DistanceMetricChartProps> = ({
  mean,
  stdDev,
  distanceMetrics,
  language,
}) => {
  const t = translations[language];
  const isRTL = language === 'ar';

  const bellCurveData = generateBellCurveData(mean, stdDev);
  const minX = mean - 3 * stdDev;
  const maxX = mean + 3 * stdDev;
  const ticks = generateTicks(minX, maxX);
  const chartMargin = { top: 20, right: 20, left: 20, bottom: 20 };

  const renderCustomizedTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          dx={2}
          textAnchor="middle"
          fill="#9ca3af"
        >
          {payload.value.toFixed(2)}
        </text>
      </g>
    );
  };

const renderYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const dx = isRTL ? 5 : -30;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dx={dx}
        dy={4}
        textAnchor={isRTL ? 'end' : 'start'}
        fill="#9ca3af"
      >
        {payload.value.toFixed(2)}
      </text>
    </g>
  );
};

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart margin={chartMargin}>
        <XAxis
          dataKey="x"
          label={{
            value: t.distanceMetric,
            position: 'insideBottom',
            offset: -15,
            fill: '#9ca3af',
            fontSize: 10,
          }}
          type="number"
          domain={['dataMin', 'dataMax']}
          ticks={ticks}
          tickFormatter={(value) => value.toFixed(2)}
          tick={renderCustomizedTick}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          orientation={isRTL ? 'right' : 'left'}
          label={{
            value: t.probabilityDensity,
            angle: -90,
            position: isRTL ? 'insideRight' : 'insideLeft',
            offset: 0,
            dy: isRTL ? 40 : 60,
            fill: '#9ca3af',
            fontSize: 10,
          }}
          tick={renderYAxisTick}
          axisLine={false}
          tickLine={false}
        />
        <ZAxis range={[30, 31]} />
        <Tooltip content={<CustomTooltip language={language} />} />

        <Area
          type="monotone"
          dataKey="y"
          data={bellCurveData}
          fill="rgba(6, 182, 212, 0.15)"
          stroke="#06b6d4"
          strokeWidth={2}
          name="Probability"
        />

        {distanceMetrics.map((metric, index) => {
          const yValue =
            (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
            Math.exp(-0.5 * ((metric - mean) / stdDev) ** 2);

          return (
            <React.Fragment key={`line-${index}`}>
              <Line
                type="monotone"
                data={[
                  { x: metric, y: 0 },
                  { x: metric, y: yValue },
                ]}
                dataKey="y"
                stroke={generateColor(index, distanceMetrics.length)}
                strokeWidth={2}
                dot={false}
              />
              <Scatter
                data={[{ x: metric, y: yValue }]}
                dataKey="y"
                fill={generateColor(index, distanceMetrics.length)}
              />
            </React.Fragment>
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default DistanceMetricChart;