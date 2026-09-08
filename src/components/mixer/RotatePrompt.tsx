import { RotateCcw, Smartphone } from "lucide-react";

/** Shown on upright phones: the full eight-channel board needs a wide screen. */
export function RotatePrompt({ onShowAnyway }: { onShowAnyway?: () => void }) {
  return (
    <section
      aria-label="Rotate your phone to open the mixing board"
      className="panel flex flex-col items-center gap-3 rounded-3xl px-5 py-8 text-center"
    >
      <div className="knob relative flex h-16 w-16 items-center justify-center rounded-full border border-panel-edge">
        <Smartphone size={26} strokeWidth={1.6} className="text-primary" aria-hidden="true" />
        <RotateCcw
          size={16}
          strokeWidth={1.8}
          className="breathe absolute -right-1 -top-1 text-primary"
          aria-hidden="true"
        />
      </div>
      <h2 className="font-display text-[19px] leading-tight">Turn your phone sideways</h2>
      <p className="max-w-[16rem] text-[13px] leading-relaxed text-muted-foreground">
        The mixing board opens in landscape so all eight sounds sit side by side, ready under your
        thumbs.
      </p>
      {onShowAnyway ? (
        <button
          type="button"
          onClick={onShowAnyway}
          className="mt-1 min-h-11 rounded-full border border-panel-edge px-5 text-[13px] font-medium text-primary transition-colors hover:bg-secondary/40"
        >
          Open the board anyway
        </button>
      ) : null}
    </section>
  );
}
