export function StatCards({ stats }) {
  const items = [
    { label: 'Total', value: stats?.total ?? 0, color: 'bg-slate-100 text-slate-800' },
    { label: 'Applied', value: stats?.applied ?? 0, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Interview', value: stats?.interview ?? 0, color: 'bg-sky-50 text-sky-700' },
    { label: 'Offers', value: stats?.offer ?? 0, color: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={`rounded-xl p-4 ${item.color}`}>
          <p className="text-sm font-medium opacity-80">{item.label}</p>
          <p className="mt-1 text-3xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
