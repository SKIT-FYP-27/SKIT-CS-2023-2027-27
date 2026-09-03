const TONE_CLASSES = {
  rise: "bg-rise/10 text-rise",
  gold: "bg-gold/10 text-gold",
  alert: "bg-alert/10 text-alert",
  navy: "bg-navy-50 text-navy",
};

export default function Badge({ children, tone = "navy" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
