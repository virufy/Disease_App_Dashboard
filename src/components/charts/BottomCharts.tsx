import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BottomCardsContainer, BottomCard } from '../../styles/DashboardStyles';
import DistanceMetricChart from './DistanceMetricChart';
import { COLORS, MEAN, STD_DEV } from '../../constants/dashboard';

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

const BottomCharts: React.FC<BottomChartsProps> = ({
  selectedLanguage,
  sicknessData,
  genderSicknessData,
  distanceMetrics,
}) => {
  const { t } = useTranslation();
  const isRTL = selectedLanguage === 'ar';

  // Bar chart tooltip
  const CustomTooltipBar = ({ payload, label, active }: any) => {
    if (active && payload?.length) {
      return (
        <div style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: 5, padding: 10, boxShadow: '0 0 5px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} style={{ margin: '5px 0', color: entry.color }}>
              {`${entry.name === 'Sick' ? t('sicknessKeys.sick') : t('sicknessKeys.notSick')}: ${entry.value}`}
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
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: 5,
          padding: 10,
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr',
        }}>
          <p style={{ margin: 0 }}>{`${localizedName}: ${value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Y‑axis tick renderer (same as before)
  const renderYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const dx = isRTL ? 0 : -10;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dx={dx} dy={4} textAnchor={isRTL ? 'end' : 'start'} fill="#666">
          {Number.isInteger(payload.value) ? payload.value : payload.value.toFixed(0)}
        </text>
      </g>
    );
  };

  return (
    <BottomCardsContainer>
      {/* Age Chart */}
      <BottomCard>
        <div style={{ margin: '0 auto 10px', height: '5%', fontSize: '14px', fontWeight: 500 }}>
          {t('dashboard.ageTitle')}
        </div>
        <ResponsiveContainer width="100%" height="93%">
          <BarChart data={isRTL ? [...sicknessData].reverse() : sicknessData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ageGroup" />
            <YAxis
              orientation={isRTL ? 'right' : 'left'}
              tickFormatter={(v) => (Number.isInteger(v) ? v.toString() : v.toFixed(0))}
              allowDecimals={false}
              domain={[0, 'auto']}
              tick={renderYAxisTick}
            />
            <Tooltip content={<CustomTooltipBar />} />
            <Legend
              wrapperStyle={{ fontSize: isRTL ? '14px' : '12px' }}
              formatter={(value) => (isRTL ? `  ${value}  ` : value)}
            />
            <Bar dataKey="Sick" name={t('sicknessKeys.sick')} fill="#FF6B6B" />
            <Bar dataKey="NotSick" name={t('sicknessKeys.notSick')} fill="#4ECDC4" />
          </BarChart>
        </ResponsiveContainer>
      </BottomCard>

      {/* Gender Chart */}
      <BottomCard>
        <div style={{ margin: '0 auto 10px', height: '5%', fontSize: '14px', fontWeight: 500  }}>
          {t('dashboard.genderTitle')}
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
              {genderSicknessData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipPie />} />
            <Legend
              iconSize={14}
              wrapperStyle={{ fontSize: isRTL ? '14px' : '12px', direction: isRTL ? 'rtl' : 'ltr' }}
              formatter={(value) => {
                const key = genderKeyMap[value] || value;
                const translated = t(`gender.${key}`);
                return isRTL ? `‎‎  ${translated}  ‎‎` : translated;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </BottomCard>

      {/* Cough Statistics Chart */}
      <BottomCard>
        <div style={{ margin: '0 auto 10px', height: '4%', fontSize: '14px', fontWeight: 500  }}>
          {t('dashboard.coughStatsTitle')}
        </div>
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