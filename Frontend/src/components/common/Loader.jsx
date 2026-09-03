export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate py-8 justify-center">
      <span className="w-3.5 h-3.5 border-2 border-line border-t-gold rounded-full animate-spin" />
      {label}
    </div>
  );
}
