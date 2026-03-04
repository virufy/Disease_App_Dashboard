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
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '5px',
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <p style={{ color: '#ff5632' }}>{`${t.tooltipDistance}: ${label.toFixed(2)}`}</p>
        {bellCurveValue && (
          <p style={{ color: '#4BC0C0' }}>{`${t.tooltipProbability}: ${bellCurveValue.value.toFixed(4)}`}</p>
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
        fill="#666"
      >
        {payload.value.toFixed(2)}
      </text>
    </g>
  );
};

  return (
    <ResponsiveContainer width="100%" height="93%">
      <ComposedChart margin={chartMargin}>
        <XAxis
          dataKey="x"
          label={{ value: t.distanceMetric, position: 'insideBottom', offset: -15, }}
          type="number"
          domain={['dataMin', 'dataMax']}
          ticks={ticks}
          tickFormatter={(value) => value.toFixed(2)}
          tick={renderCustomizedTick}
        />
        <YAxis
          orientation={isRTL ? 'right' : 'left'}
          label={{
            value: t.probabilityDensity,
            angle: -90,
            position: isRTL ? 'insideRight' : 'insideLeft',
            offset: 0,
            dy: isRTL ? 40 : 60,
          }}
          tick={renderYAxisTick}
        />
        <ZAxis range={[30, 31]} />
        <Tooltip content={<CustomTooltip language={language} />} />

        <Area
          type="monotone"
          dataKey="y"
          data={bellCurveData}
          fill="rgba(75, 192, 192, 0.2)"
          stroke="#4BC0C0"
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