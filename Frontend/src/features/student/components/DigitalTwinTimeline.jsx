// Renders the student's lifecycle as an ordered, stepped timeline —
// numbering is appropriate here since the content is a genuine sequence
// (admission through placement), per the UEI "Digital Twin" concept.

export default function DigitalTwinTimeline({ stages }) {
  return (
    <div className="panel p-5">
      <p className="stat-label mb-5">Lifecycle — admission to placement</p>
      <div className="relative flex justify-between">
        <div className="absolute top-3 left-0 right-0 h-px bg-line" />
        {stages.map((stage, i) => (
          <div key={stage.label} className="relative flex flex-col items-center flex-1">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-medium bg-paper z-10 ${
                stage.status === "complete"
                  ? "border-navy text-navy"
                  : stage.status === "current"
                  ? "border-gold text-gold"
                  : "border-line text-slate"
              }`}
            >
              {i + 1}
            </div>
            <p
              className={`mt-2 text-xs text-center leading-tight max-w-[72px] ${
                stage.status === "upcoming" ? "text-slate" : "text-ink"
              }`}
            >
              {stage.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
