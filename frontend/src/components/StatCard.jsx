export default function StatCard({ label, value, icon, accent = 'ghost' }) {
  const accents = {
    ghost: 'from-ghost-500/20 to-ghost-600/10 text-ghost-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/10 text-amber-400',
  };

  return (
    <div className={`gradient-card bg-gradient-to-br ${accents[accent]} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">{value}</p>
        </div>
        {icon && <span className="text-2xl opacity-80">{icon}</span>}
      </div>
    </div>
  );
}
