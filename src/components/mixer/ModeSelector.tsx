import { MODES } from "@/lib/presets";
import type { ModeId } from "@/lib/mixer-types";
import { cn } from "@/lib/utils";

export function ModeSelector({
  active,
  onSelect,
}: {
  active: ModeId | null;
  onSelect: (id: ModeId) => void;
}) {
  return (
    <div className="flex gap-2" role="group" aria-label="Suggested starting mixes">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onSelect(mode.id)}
          aria-pressed={active === mode.id}
          className={cn(
            "flex-1 rounded-full border px-2 py-1.5 text-[12px] font-medium transition-colors",
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
