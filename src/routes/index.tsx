import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useMixer } from "@/hooks/use-mixer";
import { MixerConsole } from "@/components/mixer/MixerConsole";
import { MasterControls } from "@/components/mixer/MasterControls";
import { ModeSelector } from "@/components/mixer/ModeSelector";
import { DigitalTimerDisplay } from "@/components/mixer/DigitalTimerDisplay";
import { FirstRunOverlay } from "@/components/mixer/FirstRunOverlay";
import { RotatePrompt } from "@/components/mixer/RotatePrompt";
import { useIsPortraitPhone } from "@/hooks/use-orientation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mindful Mixer — Blend calming sounds your way" },
      {
        name: "description",
        content:
          "Mix rain, ocean, fire and more on a tactile sound board. Set a sleep timer, save your favourite blends, and drift off.",
      },
      { property: "og:title", content: "Mindful Mixer — Blend calming sounds your way" },
      {
        property: "og:description",
        content: "A tactile sound board for sleep, focus and calm. Blend eight ambient sounds and save your mixes.",
      },
    ],
  }),
  component: MixerScreen,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Late night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function MixerScreen() {
  const { activeMode, applyMode, remainingMs, playing, audioErrors } = useMixer();
  const portraitPhone = useIsPortraitPhone();

  return (
    <>
      <FirstRunOverlay />
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-6 max-lg:landscape:max-w-none max-lg:landscape:gap-2 max-lg:landscape:pt-3 lg:max-w-3xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="font-display text-[15px] tracking-tight text-primary">Mindful Mixer</p>
            <h1 className="mt-1 font-display text-[24px] leading-tight max-lg:landscape:mt-0 max-lg:landscape:truncate max-lg:landscape:text-[17px]">
              {greeting()}. What do you need right now?
            </h1>
          </div>
          <DigitalTimerDisplay remainingMs={remainingMs} playing={playing} className="mt-1 shrink-0" />
        </header>

        <ModeSelector active={activeMode} onSelect={applyMode} />

        {audioErrors.length > 0 && (
          <p className="flex items-start gap-2 rounded-2xl border border-panel-edge bg-card px-3 py-2 text-[12px] text-muted-foreground">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            Unavailable right now: {audioErrors.join(", ")}. Everything else still works.
          </p>
        )}

        {portraitPhone ? <RotatePrompt /> : <MixerConsole />}
        <MasterControls />

        <p className="pb-2 text-center text-[11px] text-muted-foreground/70 max-lg:landscape:hidden">
          Placeholder ambient tones are generated in your browser until studio recordings are added.
        </p>
      </div>
    </>
  );
}
