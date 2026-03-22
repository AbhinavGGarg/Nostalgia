const STEPS = [
  {
    title: "Enter",
    text: "One button. No feed. No options menu."
  },
  {
    title: "Receive",
    text: "DROP picks a random moment and starts the timer instantly."
  },
  {
    title: "React",
    text: "You answer now or lose it forever."
  },
  {
    title: "Vanish",
    text: "Your response becomes a fleeting signal in today's chaos."
  },
];

export function HowItWorks() {
  return (
    <section className="relative z-20 mx-auto mt-20 w-full max-w-6xl px-5 pb-20 sm:px-8">
      <div className="mb-8 flex items-end justify-between gap-6">
        <h2 className="max-w-md text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          This was not made for scrolling.
        </h2>
        <p className="hidden max-w-sm text-sm text-zinc-400 sm:block">
          Spontaneity engine, not recommendation engine.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, index) => (
          <article
            key={step.title}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-lg transition hover:border-cyan-300/30"
          >
            <p className="font-mono text-xs tracking-[0.24em] text-cyan-200">0{index + 1}</p>
            <h3 className="mt-3 text-xl font-semibold text-zinc-100">{step.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
