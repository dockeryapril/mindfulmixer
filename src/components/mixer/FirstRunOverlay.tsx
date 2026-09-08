import { useMixer } from "@/hooks/use-mixer";

const TIPS = [
  "Raise a slider to add a sound",
  "Combine as many sounds as you like",
  "Save combinations you want to use again",
];

export function FirstRunOverlay() {
  const { hydrated, settings, updateSettings } = useMixer();
  if (!hydrated || !settings.showFirstRun) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-run-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/25 p-4 backdrop-blur-sm"
    >
      <div className="panel w-full max-w-sm rounded-3xl p-6">
        <h2 id="first-run-title" className="font-display text-2xl leading-snug">
          Move the sliders to build your space.
        </h2>
        <ul className="mt-4 space-y-2.5">
          {TIPS.map((tip, i) => (
            <li key={tip} className="flex items-start gap-3 text-[14px] text-foreground/80">
              <span className="digital mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[11px] text-primary">
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => updateSettings({ showFirstRun: false })}
          className="mt-6 w-full rounded-2xl bg-primary py-3 text-sm font-medium text-primary-foreground"
          autoFocus
        >
          Start mixing
        </button>
      </div>
    </div>
  );
}
