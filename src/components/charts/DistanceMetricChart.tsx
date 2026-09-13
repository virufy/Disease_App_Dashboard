import React from 'react';
import { ComposedChart, Scatter, Line, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Area, CartesianGrid } from 'recharts';

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
  if (index === total - 1) {
    return 'rgba(255, 0, 0, 1)';
  } else if (index === total - 2) {
    return 'rgba(255, 0, 0, 0.4)';
  } else {
    const opacity = 0.1 + 0.3 * (index / total);
    return `rgba(255, 0, 0, ${opacity})`;
  }
};

const CustomTooltip = ({ active, payload, label, language }: any) => {
  if (active && payload && payload.length) {
    const t = translations[language as 'en' | 'ar' | 'ja'];
    const bellCurveValue = payload.find((entry: any) => entry.name === "Probability");
    const isRTL = language === 'ar';

    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(15,23,42,0.08)',
          borderRadius: 12,
          padding: '9px 12px',
          boxShadow: '0 14px 34px -14px rgba(15,23,42,0.45)',
          fontSize: 12.5,
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <p style={{ margin: '2px 0', color: '#334155' }}>
          {`${t.tooltipDistance}: `}
          <b style={{ color: '#0f172a' }}>{label.toFixed(2)}</b>
        </p>
        {bellCurveValue && (
          <p style={{ margin: '2px 0', color: '#0d9488' }}>
            {`${t.tooltipProbability}: `}
            <b>{bellCurveValue.value.toFixed(4)}</b>
          </p>
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
    const dx = isRTL ? 15 : 0;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          dx={2}
          textAnchor="middle"
          fill="#666"
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
        fill="#94a3b8"
        fontSize={11}
        fontWeight={600}
      >
        {payload.value.toFixed(2)}
      </text>
    </g>
  );
};

  return (
    <ResponsiveContainer width="100%" height="93%">
      <ComposedChart margin={chartMargin}>
        <defs>
          <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#eef2f7" strokeDasharray="4 4" />
        <XAxis
          dataKey="x"
          label={{ value: t.distanceMetric, position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 11 }}
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
          axisLine={false}
          tickLine={false}
          label={{
            value: t.probabilityDensity,
            angle: -90,
            position: isRTL ? 'insideRight' : 'insideLeft',
            offset: 0,
            dy: isRTL ? 40 : 60,
            fill: '#94a3b8',
            fontSize: 11,
          }}
          tick={renderYAxisTick}
        />
        <ZAxis range={[30, 31]} />
        <Tooltip content={<CustomTooltip language={language} />} />

        <Area
          type="monotone"
          dataKey="y"
          data={bellCurveData}
          fill="url(#bellGrad)"
          stroke="#0d9488"
          strokeWidth={2}
          name="Probability"
          animationDuration={700}
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