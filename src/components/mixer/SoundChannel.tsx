import { Volume2, VolumeX } from "lucide-react";
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
    <div className="flex w-[calc(25%_-_0.375rem)] shrink-0 snap-start flex-col items-center gap-2 max-lg:landscape:w-[11.5%] max-lg:landscape:gap-1 lg:w-[76px]">
      <div className="flex h-4 items-center justify-center max-lg:landscape:h-2">
        <span
          className={cn("h-1.5 w-1.5 rounded-full bg-primary", sounding ? "breathe" : "opacity-0")}
          aria-hidden="true"
        />
        <span className="sr-only">{sounding ? `${sound.name} is playing` : ""}</span>
      </div>

      <VerticalFader value={state.volume} onChange={onVolume} label={sound.name} active={active} />

      <span
        className={cn("digital text-[11px] tabular-nums", active ? "opacity-100" : "opacity-45")}
      >
        {String(state.volume).padStart(2, "0")}
      </span>

      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-panel-edge transition-colors max-lg:landscape:h-7 max-lg:landscape:w-7",
          active ? "bg-primary/12 text-primary" : "knob text-muted-foreground",
        )}
      >
        <SoundIcon name={sound.icon} />
      </div>

      <span className="text-center text-[11px] leading-tight font-medium text-foreground/80 max-lg:landscape:text-[10px]">
        {sound.name}
      </span>

      <button
        type="button"
        onClick={onToggleMute}
        aria-pressed={state.muted}
        aria-label={state.muted ? `Unmute ${sound.name}` : `Mute ${sound.name}`}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border border-panel-edge transition-colors max-lg:landscape:h-7 max-lg:landscape:w-7",
          state.muted ? "bg-destructive/15 text-destructive" : "knob text-muted-foreground",
        )}
      >
        {state.muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </div>
  );
}
