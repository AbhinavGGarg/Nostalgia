import { cn } from "@/lib/cn";

export function CountdownTimer({
  label,
  value,
  danger,
}: {
  label?: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {label ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">{label}</span>
      ) : null}
      <p
        className={cn(
          "font-display text-6xl leading-none tracking-tight sm:text-8xl",
          danger ? "text-rose-300 drop-shadow-[0_0_30px_rgba(251,113,133,0.45)]" : "text-cyan-200",
        )}
      >
        {value}
      </p>
    </div>
  );
}
