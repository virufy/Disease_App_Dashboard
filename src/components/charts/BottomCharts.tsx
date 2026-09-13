import React from 'react';
import { useTranslation } from 'react-i18next';
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
  Label,
} from 'recharts';
import { BottomCardsContainer, BottomCard } from '../../styles/DashboardStyles';
import DistanceMetricChart from './DistanceMetricChart';
import { MEAN, STD_DEV } from '../../constants/dashboard';

interface BottomChartsProps {
  selectedLanguage: 'en' | 'ar' | 'ja';
  sicknessData: Array<{ ageGroup: string; Sick: number; NotSick: number }>;
  genderSicknessData: Array<{ name: string; value: number }>;
  distanceMetrics: number[];
}

// Helper to map internal gender names to translation keys
const genderKeyMap: Record<string, string> = {
  'Sick Male': 'sickMale',
  'Non-Sick Male': 'nonSickMale',
  'Sick Female': 'sickFemale',
  'Non-Sick Female': 'nonSickFemale',
};

// Theme-aligned colors for the gender donut slices
const genderColors: Record<string, string> = {
  'Sick Male': '#ef4444',
  'Non-Sick Male': '#14b8a6',
  'Sick Female': '#f59e0b',
  'Non-Sick Female': '#2563eb',
};

const cardTitleStyle: React.CSSProperties = {
  margin: '0 0 6px',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  color: '#64748b',
};

const glassTooltip: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(15,23,42,0.08)',
  borderRadius: 12,
  padding: '10px 13px',
  boxShadow: '0 14px 34px -14px rgba(15,23,42,0.45)',
  fontSize: 12.5,
};

const BottomCharts: React.FC<BottomChartsProps> = ({
  selectedLanguage,
  sicknessData,
  genderSicknessData,
  distanceMetrics,
}) => {
  const { t } = useTranslation();
  const isRTL = selectedLanguage === 'ar';

  const hasData =
    distanceMetrics.length > 0 ||
    sicknessData.some((d) => d.Sick + d.NotSick > 0) ||
    genderSicknessData.some((d) => d.value > 0);

  // Overall sick share (sum of the two "sick" slices) for the donut center
  const sickShare = genderSicknessData
    .filter((d) => d.name === 'Sick Male' || d.name === 'Sick Female')
    .reduce((sum, d) => sum + d.value, 0);

  // Bar chart tooltip
  const CustomTooltipBar = ({ payload, label, active }: any) => {
    if (active && payload?.length) {
      return (
        <div style={{ ...glassTooltip, textAlign: isRTL ? 'right' : 'left', direction: isRTL ? 'rtl' : 'ltr' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 800, color: '#0f172a' }}>{label}</p>
          {payload.map((entry: any, idx: number) => (
            <p
              key={idx}
              style={{
                margin: '3px 0',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: entry.color,
                  display: 'inline-block',
                }}
              />
              {`${entry.name === 'Sick' ? t('sicknessKeys.sick') : t('sicknessKeys.notSick')}: `}
              <b style={{ color: '#0f172a' }}>{entry.value}</b>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Pie chart tooltip
  const CustomTooltipPie = ({ payload, active }: any) => {
    if (active && payload?.length) {
      const { name, value } = payload[0];
      const key = genderKeyMap[name] || name;
      const localizedName = t(`gender.${key}`);
      return (
        <div
          style={{
            ...glassTooltip,
            textAlign: isRTL ? 'right' : 'left',
            direction: isRTL ? 'rtl' : 'ltr',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: genderColors[name] || '#94a3b8',
              display: 'inline-block',
            }}
          />
          <span>{`${localizedName}: `}</span>
          <b style={{ color: '#0f172a' }}>{`${value.toFixed(1)}%`}</b>
        </div>
      );
    }
    return null;
  };

  // Y‑axis tick renderer
  const renderYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const dx = isRTL ? 4 : -4;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dx={dx}
          dy={4}
          textAnchor={isRTL ? 'start' : 'end'}
          fill="#94a3b8"
          fontSize={11}
          fontWeight={600}
        >
          {Number.isInteger(payload.value) ? payload.value : payload.value.toFixed(0)}
        </text>
      </g>
    );
  };

  if (!hasData) {
    return (
      <BottomCardsContainer>
        <BottomCard
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minHeight: 150,
          }}
        >
          <div style={{ fontSize: 28 }}>📡</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
            {t('dashboard.awaitingTitle', {
              defaultValue: 'Awaiting live data for this region',
            })}
          </div>
          <div style={{ fontSize: 12.5, color: '#64748b', textAlign: 'center' }}>
            {t('dashboard.awaitingHint', {
              defaultValue:
                'Charts populate automatically as submissions arrive — or select another city.',
            })}
          </div>
        </BottomCard>
      </BottomCardsContainer>
    );
  }

  return (
    <BottomCardsContainer>
      {/* Age Chart */}
      <BottomCard>
        <div style={cardTitleStyle}>{t('dashboard.ageTitle')}</div>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={isRTL ? [...sicknessData].reverse() : sicknessData}
            margin={{ top: 6, right: 6, left: -14, bottom: 0 }}
            barGap={3}
          >
            <defs>
              <linearGradient id="sickGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="wellGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef2f7" strokeDasharray="4 4" />
            <XAxis
              dataKey="ageGroup"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
            />
            <YAxis
              orientation={isRTL ? 'right' : 'left'}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              domain={[0, 'auto']}
              width={34}
              tick={renderYAxisTick}
            />
            <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(15,23,42,0.04)' }} />
            <Legend
              iconType="circle"
              iconSize={9}
              wrapperStyle={{ fontSize: '11.5px', fontWeight: 600, paddingTop: 4 }}
              formatter={(value) => (
                <span style={{ color: '#475569' }}>{isRTL ? `  ${value}  ` : value}</span>
              )}
            />
            <Bar
              dataKey="Sick"
              name={t('sicknessKeys.sick')}
              fill="url(#sickGrad)"
              radius={[5, 5, 0, 0]}
              maxBarSize={26}
              animationDuration={700}
            />
            <Bar
              dataKey="NotSick"
              name={t('sicknessKeys.notSick')}
              fill="url(#wellGrad)"
              radius={[5, 5, 0, 0]}
              maxBarSize={26}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </BottomCard>

      {/* Gender Chart — donut with center metric */}
      <BottomCard>
        <div style={cardTitleStyle}>{t('dashboard.genderTitle')}</div>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={genderSicknessData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
              cornerRadius={4}
              stroke="none"
              labelLine={false}
              animationDuration={700}
            >
              {genderSicknessData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={genderColors[entry.name] || '#94a3b8'} />
              ))}
              <Label
                position="center"
                content={({ viewBox }: any) => {
                  const { cx, cy } = viewBox;
                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy - 6}
                        textAnchor="middle"
                        fontSize={22}
                        fontWeight={800}
                        fill="#0f172a"
                      >
                        {`${sickShare.toFixed(0)}%`}
                      </text>
                      <text
                        x={cx}
                        y={cy + 13}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={700}
                        letterSpacing={0.5}
                        fill="#94a3b8"
                      >
                        {t('sicknessKeys.sick').toUpperCase()}
                      </text>
                    </g>
                  );
                }}
              />
            </Pie>
            <Tooltip content={<CustomTooltipPie />} />
            <Legend
              iconType="circle"
              iconSize={9}
              wrapperStyle={{
                fontSize: '11px',
                fontWeight: 600,
                direction: isRTL ? 'rtl' : 'ltr',
                paddingTop: 4,
              }}
              formatter={(value) => {
                const key = genderKeyMap[value] || value;
                const translated = t(`gender.${key}`);
                return (
                  <span style={{ color: '#475569' }}>
                    {isRTL ? `‎‎  ${translated}  ‎‎` : translated}
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </BottomCard>

      {/* Cough Statistics Chart */}
      <BottomCard>
        <div style={cardTitleStyle}>{t('dashboard.coughStatsTitle')}</div>
        <DistanceMetricChart
          mean={MEAN}
          stdDev={STD_DEV}
          distanceMetrics={distanceMetrics}
          language={selectedLanguage}
        />
      </BottomCard>
    </BottomCardsContainer>
  );
};

export default BottomCharts;
