export default function Navbar({ title, subtitle }) {
  return (
    <header className="flex items-baseline justify-between px-8 py-6 border-b border-line">
      <div>
        <h1 className="text-2xl">{title}</h1>
        {subtitle && <p className="text-sm text-slate mt-1">{subtitle}</p>}
      </div>
    </header>
  );
}
