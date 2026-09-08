import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useMixer } from "@/hooks/use-mixer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Mindful Mixer" },
      {
        name: "description",
        content: "Choose a default session timer, fade-out length, haptics and theme for Mindful Mixer.",
      },
      { property: "og:title", content: "Settings — Mindful Mixer" },
      { property: "og:description", content: "Default timer, fade-out length, haptics and theme preferences." },
    ],
  }),
  component: SettingsScreen,
});

const TIMER_OPTIONS = [
  { label: "Off", value: null },
  { label: "15", value: 15 },
  { label: "30", value: 30 },
  { label: "45", value: 45 },
  { label: "60", value: 60 },
  { label: "120", value: 120 },
];

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="panel rounded-3xl p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-medium">{title}</h2>
          {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

function SettingsScreen() {
  const { settings, updateSettings } = useMixer();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 pt-6 lg:max-w-3xl">
      <header>
        <p className="font-display text-[15px] tracking-tight text-primary">Mindful Mixer</p>
        <h1 className="mt-1 font-display text-[26px] leading-tight">Settings</h1>
      </header>

      <div className="panel rounded-3xl p-4">
        <h2 className="text-[15px] font-medium">Default session timer</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">Minutes, pre-selected when you open the app.</p>
        <div className="mt-3 flex gap-2">
          {TIMER_OPTIONS.map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => updateSettings({ defaultTimerMinutes: o.value })}
              aria-pressed={settings.defaultTimerMinutes === o.value}
              className={cn(
                "flex-1 rounded-xl border border-panel-edge py-2 text-[13px] font-medium transition-colors",
                settings.defaultTimerMinutes === o.value
                  ? "bg-primary/15 text-primary"
                  : "knob text-foreground/75",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel rounded-3xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-medium">Fade-out length</h2>
          <span className="digital text-sm tabular-nums">{settings.fadeOutSeconds}s</span>
        </div>
        <p className="mt-0.5 mb-3 text-[12px] text-muted-foreground">
          How gently sounds fade when a timer ends or you pause.
        </p>
        <Slider
          value={[settings.fadeOutSeconds]}
          onValueChange={([v]) => updateSettings({ fadeOutSeconds: v })}
          min={1}
          max={30}
          step={1}
          aria-label="Fade-out length in seconds"
        />
      </div>

      <Row title="Remember last mix" description="Reopen with your most recent sound levels.">
        <Switch
          checked={settings.rememberLastMix}
          onCheckedChange={(v) => updateSettings({ rememberLastMix: v })}
          aria-label="Remember last mix"
        />
      </Row>

      <Row title="Haptics" description="Subtle vibration on taps, where supported.">
        <Switch
          checked={settings.haptics}
          onCheckedChange={(v) => updateSettings({ haptics: v })}
          aria-label="Haptics"
        />
      </Row>

      <Row title="Theme" description="Cream daylight or dusk for night use.">
        <div className="flex gap-2">
          {(["cream", "dusk"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => updateSettings({ theme: t })}
              aria-pressed={settings.theme === t}
              className={cn(
                "rounded-xl border border-panel-edge px-3 py-2 text-[13px] font-medium capitalize",
                settings.theme === t ? "bg-primary/15 text-primary" : "knob text-foreground/75",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Row>

      <Row title="Show tips again" description="Bring back the welcome overlay on the mixer.">
        <button
          type="button"
          onClick={() => {
            updateSettings({ showFirstRun: true });
            toast("Tips will show on the mixer again");
          }}
          className="knob rounded-xl border border-panel-edge px-3 py-2 text-[13px] font-medium"
        >
          Reset
        </button>
      </Row>

      <section className="panel rounded-3xl p-4">
        <h2 className="text-[15px] font-medium">How the audio behaves</h2>
        <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-muted-foreground">
          <li>Every sound loops continuously and has its own volume.</li>
          <li>Master volume affects the whole blend; muting one sound leaves the others playing.</li>
          <li>Changing a level never restarts a sound.</li>
          <li>Sound can only begin after you press play — phones and browsers require that first tap.</li>
          <li>
            Sounds are currently generated in your browser as clearly-labelled placeholders until studio
            recordings are added.
          </li>
        </ul>
      </section>

      <section className="panel rounded-3xl p-4">
        <h2 className="text-[15px] font-medium">About Mindful Mixer</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          A tactile sound board for sleeping, relaxing, focusing and calming down. Mixes and preferences are
          stored privately on this device.
        </p>
      </section>
    </div>
  );
}
