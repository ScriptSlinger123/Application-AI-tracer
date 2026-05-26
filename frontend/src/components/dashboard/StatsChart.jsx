import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = {
  applied: '#6366f1',
  interview: '#0ea5e9',
  rejected: '#f43f5e',
  offer: '#22c55e',
};

export function StatsChart({ stats }) {
  const data = [
    { name: 'Applied', key: 'applied', value: stats?.applied || 0 },
    { name: 'Interview', key: 'interview', value: stats?.interview || 0 },
    { name: 'Rejected', key: 'rejected', value: stats?.rejected || 0 },
    { name: 'Offer', key: 'offer', value: stats?.offer || 0 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
