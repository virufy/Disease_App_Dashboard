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
import { COLORS, MEAN, STD_DEV } from '../../constants/dashboard';
import { tokens } from '../../styles/theme';

interface BottomChartsProps {
  selectedLanguage: 'en' | 'ar' | 'ja';
  sicknessData: Array<{ ageGroup: string; Sick: number; NotSick: number }>;
  genderSicknessData: Array<{ name: string; value: number }>;
  distanceMetrics: number[];
  // Sick/total across ALL filtered records (matches the Sick Rate KPI denominator).
  // Optional: falls back to the age-bucketed totals when omitted.
  overview?: { sick: number; total: number };
}

const genderKeyMap: Record<string, string> = {
  'Sick Male': 'sickMale',
  'Non-Sick Male': 'nonSickMale',
  'Sick Female': 'sickFemale',
  'Non-Sick Female': 'nonSickFemale',
};

const CHART_TITLE_STYLE: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: tokens.color.muted,
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
  paddingBottom: '8px',
  borderBottom: `1px solid ${tokens.color.borderSoft}`,
  marginBottom: '8px',
  flexShrink: 0,
};

const BottomCharts: React.FC<BottomChartsProps> = ({
  selectedLanguage,
  sicknessData,
  genderSicknessData,
  distanceMetrics,
  overview,
}) => {
  const { t } = useTranslation();
  const isRTL = selectedLanguage === 'ar';

  // ── Sick / Healthy overview totals ───────────────────────────────────────
  // Prefer the overview computed across ALL filtered records so the donut % matches
  // the Sick Rate KPI exactly. Fall back to age-bucketed totals if not provided.
  const ageSick = sicknessData.reduce((sum, d) => sum + d.Sick, 0);
  const ageHealthy = sicknessData.reduce((sum, d) => sum + d.NotSick, 0);
  const totalSick = overview ? overview.sick : ageSick;
  const grandTotal = overview ? overview.total : ageSick + ageHealthy;
  const totalHealthy = grandTotal - totalSick;
  const sickPct = grandTotal > 0 ? Math.round((totalSick / grandTotal) * 100) : 0;
  const overviewData = [
    { name: t('sicknessKeys.sick'), value: totalSick },
    { name: t('sicknessKeys.notSick'), value: totalHealthy },
  ];

  // ── Bar chart tooltip ────────────────────────────────────────────────────
  const CustomTooltipBar = ({ payload, label, active }: any) => {
    if (active && payload?.length) {
      return (
        <div
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 8,
            padding: '8px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: 12,
          }}
        >
          <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#374151' }}>
            {label}
          </p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} style={{ margin: '2px 0', color: entry.color }}>
              {`${entry.name === 'Sick' ? t('sicknessKeys.sick') : t('sicknessKeys.notSick')}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ── Pie chart tooltip ────────────────────────────────────────────────────
  const CustomTooltipPie = ({ payload, active }: any) => {
    if (active && payload?.length) {
      const { name, value } = payload[0];
      const key = genderKeyMap[name] || name;
      const localizedName = t(`gender.${key}`);
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
          <p style={{ margin: 0, color: '#374151' }}>
            {`${localizedName}: ${value.toFixed(2)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // ── Y-axis tick ──────────────────────────────────────────────────────────
  const renderYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const dx = isRTL ? 0 : -10;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dx={dx}
          dy={4}
          textAnchor={isRTL ? 'end' : 'start'}
          fill="#9ca3af"
          fontSize={10}
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
      {/* ── Age Chart ─────────────────────────────────────────────────── */}
      <BottomCard $accent={tokens.color.brand}>
        <div style={CHART_TITLE_STYLE}>{t('dashboard.ageTitle')}</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={isRTL ? [...sicknessData].reverse() : sicknessData}
              margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="ageGroup"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                orientation={isRTL ? 'right' : 'left'}
                tickFormatter={(v) =>
                  Number.isInteger(v) ? v.toString() : v.toFixed(0)
                }
                allowDecimals={false}
                domain={[0, 'auto']}
                tick={renderYAxisTick}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#6b7280' }}
                formatter={(value) => (isRTL ? `  ${value}  ` : value)}
              />
              <Bar
                dataKey="Sick"
                name={t('sicknessKeys.sick')}
                fill={tokens.color.danger}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="NotSick"
                name={t('sicknessKeys.notSick')}
                fill={tokens.color.success}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </BottomCard>

      {/* ── Gender Chart ──────────────────────────────────────────────── */}
      <BottomCard $accent={tokens.color.brand}>
        <div style={CHART_TITLE_STYLE}>{t('dashboard.genderTitle')}</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderSicknessData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="75%"
                labelLine={false}
              >
                {genderSicknessData.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
              <Legend
                iconSize={10}
                wrapperStyle={{
                  fontSize: 11,
                  color: '#6b7280',
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
                formatter={(value) => {
                  const key = genderKeyMap[value] || value;
                  const translated = t(`gender.${key}`);
                  return isRTL ? `\u200E  ${translated}  \u200E` : translated;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </BottomCard>

      {/* ── Cough Statistics Chart ────────────────────────────────────── */}
      <BottomCard $accent={tokens.color.brand}>
        <div style={CHART_TITLE_STYLE}>{t('dashboard.coughStatsTitle')}</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <DistanceMetricChart
            mean={MEAN}
            stdDev={STD_DEV}
            distanceMetrics={distanceMetrics}
            language={selectedLanguage}
          />
        </div>
      </BottomCard>
      {/* ── Sick / Healthy Overview ───────────────────────────────────── */}
      <BottomCard $accent={tokens.color.brand}>
        <div style={CHART_TITLE_STYLE}>{t('dashboard.overviewTitle')}</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overviewData}
                dataKey="value"
                cx="50%"
                cy="45%"
                innerRadius="38%"
                outerRadius="65%"
                labelLine={false}
                startAngle={90}
                endAngle={-270}
              >
                <Label
                  position="center"
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox as { cx: number; cy: number };
                    return (
                      <g>
                        <text
                          x={cx}
                          y={cy - 4}
                          textAnchor="middle"
                          fill={tokens.color.heading}
                          style={{ fontSize: 18, fontWeight: 800 }}
                        >
                          {sickPct}%
                        </text>
                        <text
                          x={cx}
                          y={cy + 12}
                          textAnchor="middle"
                          fill={tokens.color.muted}
                          style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.6 }}
                        >
                          {t('dashboard.sickShort')}
                        </text>
                      </g>
                    );
                  }}
                />
                <Cell fill={tokens.color.danger} />
                <Cell fill={tokens.color.success} />
              </Pie>
              <Tooltip
                formatter={(value: number) => [value, '']}
                contentStyle={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: 12,
                }}
              />
              <Legend
                iconSize={10}
                wrapperStyle={{ fontSize: 11, color: '#6b7280' }}
                formatter={(value) => isRTL ? `\u200E  ${value}  \u200E` : value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </BottomCard>
    </BottomCardsContainer>
  );
};

export default BottomCharts;
