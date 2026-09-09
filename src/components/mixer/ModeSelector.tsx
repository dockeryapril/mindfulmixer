import { MODES } from "@/lib/presets";
import type { ModeId } from "@/lib/mixer-types";
import { cn } from "@/lib/utils";

export function ModeSelector({
  active,
  onSelect,
  className,
}: {
  active: ModeId | null;
  onSelect: (id: ModeId) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 max-lg:landscape:grid max-lg:landscape:grid-cols-2 max-lg:landscape:gap-1 max-lg:landscape:rounded-2xl max-lg:landscape:border max-lg:landscape:border-panel-edge max-lg:landscape:bg-card max-lg:landscape:p-1.5",
        className,
      )}
      role="group"
      aria-label="Suggested starting mixes"
    >
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onSelect(mode.id)}
          aria-pressed={active === mode.id}
          className={cn(
            "flex-1 rounded-full border px-2 py-1.5 text-[12px] font-medium transition-colors max-lg:landscape:px-1 max-lg:landscape:py-1",
            active === mode.id
              ? "border-primary/40 bg-primary/15 text-primary"
              : "border-panel-edge bg-card text-foreground/75 hover:bg-secondary",
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
