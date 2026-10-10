// Week 1 placeholder: confirms Next.js, TypeScript, Tailwind and the design tokens work together.
const bands = [
  { label: "F", className: "bg-band-f" },
  { label: "P & C", className: "bg-band-p" },
  { label: "B & B+", className: "bg-band-b" },
  { label: "A, A+ & O", className: "bg-band-a" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm uppercase tracking-wide text-muted">SKIT · Department of CSE</p>
      <h1 className="mt-2 font-serif text-3xl text-register">Result Analysis System</h1>
      <p className="mt-3 text-ink-2">
        Frontend setup is working: Next.js, TypeScript and Tailwind CSS.
      </p>

      <section className="mt-8 rounded-lg border border-rule bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">Grade band colours</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {bands.map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-sm text-ink-2">
              <span className={`inline-block h-4 w-4 rounded ${b.className}`} />
              {b.label}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
