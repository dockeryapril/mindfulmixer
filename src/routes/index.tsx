import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useMixer } from "@/hooks/use-mixer";
import { MixerConsole } from "@/components/mixer/MixerConsole";
import { MasterControls } from "@/components/mixer/MasterControls";
import { ModeSelector } from "@/components/mixer/ModeSelector";
import { DigitalTimerDisplay } from "@/components/mixer/DigitalTimerDisplay";
import { FirstRunOverlay } from "@/components/mixer/FirstRunOverlay";

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
        content:
          "A tactile sound board for sleep, focus and calm. Blend eight ambient sounds and save your mixes.",
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

  return (
    <>
      <FirstRunOverlay />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-2 px-2.5 pt-3 max-lg:landscape:grid max-lg:landscape:h-dvh max-lg:landscape:max-w-none max-lg:landscape:grid-cols-[minmax(0,1fr)_9rem] max-lg:landscape:grid-rows-[auto_auto_auto_1fr] max-lg:landscape:gap-2 max-lg:landscape:overflow-hidden max-lg:landscape:pt-[max(0.5rem,env(safe-area-inset-top))] max-lg:landscape:pr-[max(0.5rem,env(safe-area-inset-right))] max-lg:landscape:pb-[max(0.5rem,env(safe-area-inset-bottom))] max-lg:landscape:pl-[max(0.5rem,env(safe-area-inset-left))] lg:max-w-3xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 max-lg:landscape:col-start-2 max-lg:landscape:row-start-1 max-lg:landscape:grid-cols-1 max-lg:landscape:rounded-2xl max-lg:landscape:border max-lg:landscape:border-panel-edge max-lg:landscape:bg-card max-lg:landscape:p-1.5">
          <div className="min-w-0 max-lg:landscape:hidden">
            <p className="font-display text-[15px] tracking-tight text-primary">Mindful Mixer</p>
            <h1 className="mt-0.5 font-display text-[20px] leading-tight max-lg:landscape:sr-only">
              {greeting()}. What do you need right now?
            </h1>
          </div>
          <DigitalTimerDisplay
            remainingMs={remainingMs}
            playing={playing}
            className="mt-1 shrink-0 max-lg:landscape:mt-0 max-lg:landscape:w-full max-lg:landscape:justify-center max-lg:landscape:px-2"
          />
        </header>

        <ModeSelector
          active={activeMode}
          onSelect={applyMode}
          className="max-lg:landscape:col-start-2 max-lg:landscape:row-start-2"
        />

        {audioErrors.length > 0 && (
          <p className="flex items-start gap-2 rounded-2xl border border-panel-edge bg-card px-3 py-2 text-[12px] text-muted-foreground max-lg:landscape:hidden">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            Unavailable right now: {audioErrors.join(", ")}. Everything else still works.
          </p>
        )}

        <MixerConsole className="max-lg:landscape:col-start-1 max-lg:landscape:row-start-1 max-lg:landscape:row-span-4 max-lg:landscape:h-full max-lg:landscape:min-h-0" />
        <MasterControls className="max-lg:landscape:col-start-2 max-lg:landscape:row-start-3 max-lg:landscape:self-start" />
      </div>
    </>
  );
}
