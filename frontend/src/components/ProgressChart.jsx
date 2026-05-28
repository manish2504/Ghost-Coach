import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getScoreColor } from '../utils/scoreUtils';

export default function ProgressChart({ trend }) {
  if (!trend?.length) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border border-white/10 bg-pitch-800 px-4 py-2 shadow-xl">
        <p className="text-sm text-gray-400">{payload[0].payload.date}</p>
        <p className="text-lg font-bold text-ghost-400">Score: {payload[0].value}/10</p>
      </div>
    );
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} />
          <YAxis domain={[0, 10]} stroke="#6b7280" fontSize={12} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={{ fill: getScoreColor(trend[trend.length - 1]?.score), r: 5 }}
            activeDot={{ r: 7, fill: '#2dd4bf' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
