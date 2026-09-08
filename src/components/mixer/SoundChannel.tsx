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
  onInteractionStart: () => void;
}

export function SoundChannel({
  sound,
  state,
  playing,
  onVolume,
  onToggleMute,
  onInteractionStart,
}: Props) {
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

      <VerticalFader
        value={state.volume}
        onChange={onVolume}
        label={sound.name}
        active={active}
        muted={state.muted}
        sounding={sounding}
        handle={<SoundIcon name={sound.icon} />}
        onToggleMute={onToggleMute}
        onInteractionStart={onInteractionStart}
      />
      <span className="sr-only">{sounding ? `${sound.name} is playing` : ""}</span>
    </div>
  );
}
