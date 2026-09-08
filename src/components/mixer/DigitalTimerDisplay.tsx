import { cn } from "@/lib/utils";

function format(ms: number | null) {
  if (ms === null) return "--:--";
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function DigitalTimerDisplay({
  remainingMs,
  playing,
  className,
}: {
  remainingMs: number | null;
  playing: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-display px-3 py-1.5",
        "shadow-[inset_0_2px_6px_oklch(0_0_0/0.45)]",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-display-ink", playing ? "breathe" : "opacity-30")} />
      <span className="digital text-base tabular-nums" aria-live="polite">
        {format(remainingMs)}
      </span>
    </div>
  );
}
