export default function StatCard({ label, value, delta, deltaTone = "rise" }) {
  const toneClass = {
    rise: "text-rise",
    alert: "text-alert",
    gold: "text-gold",
  }[deltaTone];

  return (
    <div className="panel px-5 py-4">
      <p className="stat-label">{label}</p>
      <div className="flex items-end gap-2 mt-1.5">
        <span className="font-display text-3xl text-navy">{value}</span>
        {delta && <span className={`text-xs mb-1 ${toneClass}`}>{delta}</span>}
      </div>
    </div>
  );
}
