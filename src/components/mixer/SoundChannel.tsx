import type { SoundDef } from "@/lib/sounds";
import type { ChannelState } from "@/lib/mixer-types";
import { VerticalFader } from "./VerticalFader";
import { SoundIcon } from "./SoundIcon";
import { cn } from "@/lib/utils";

interface Props {
  sound: SoundDef;
  state: ChannelState;
  playing: boolean;
  onVolume: (v: number) => void;
  onToggleMute: () => void;
}

export function SoundChannel({ sound, state, playing, onVolume, onToggleMute }: Props) {
  const active = state.volume > 0 && !state.muted;
  const sounding = active && playing;

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <span
        className={cn(
          "digital flex h-4 items-center text-[10px] leading-none tabular-nums",
          active ? "opacity-100" : "opacity-45",
        )}
        aria-hidden="true"
      >
        {String(state.volume).padStart(2, "0")}
      </span>

      <VerticalFader value={state.volume} onChange={onVolume} label={sound.name} active={active} />

      <button
        type="button"
        onClick={onToggleMute}
        aria-pressed={state.muted}
        aria-label={state.muted ? `Unmute ${sound.name}` : `Mute ${sound.name}`}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full border border-panel-edge transition-[color,background-color,box-shadow,transform] active:scale-95 max-[360px]:h-8 max-[360px]:w-8",
          active
            ? "bg-primary/15 text-primary shadow-[0_0_12px_color-mix(in_oklab,var(--color-primary)_28%,transparent)]"
            : state.muted
              ? "bg-foreground/8 text-muted-foreground/45"
              : "knob text-muted-foreground",
        )}
      >
        <SoundIcon name={sound.icon} />
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-primary",
            sounding ? "breathe" : "opacity-0",
          )}
          aria-hidden="true"
        />
        <span className="sr-only">{sounding ? `${sound.name} is playing` : ""}</span>
      </button>
    </div>
  );
}
