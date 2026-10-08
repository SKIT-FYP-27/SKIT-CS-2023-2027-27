const TONE_CLASSES = {
  navy: "bg-navy",
  gold: "bg-gold",
  rise: "bg-rise",
  alert: "bg-alert",
};

export default function ProgressBar({ value, tone = "navy" }) {
  const pct = Math.max(0, Math.min(100, value ?? 0));

  return (
    <div
      className="w-full h-1.5 bg-line rounded overflow-hidden"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded ${TONE_CLASSES[tone] ?? TONE_CLASSES.navy}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
