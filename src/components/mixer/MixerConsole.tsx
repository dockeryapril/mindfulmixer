import { SOUNDS } from "@/lib/sounds";
import { useMixer } from "@/hooks/use-mixer";
import { SoundChannel } from "./SoundChannel";
import { cn } from "@/lib/utils";

export function MixerConsole({ className }: { className?: string }) {
  const { channels, playing, setVolume, toggleMute, unlockAudio, anySound } = useMixer();
  return (
    <section
      aria-label="Sound channels"
      className={cn(
        "panel relative rounded-3xl px-2 py-2.5 transition-shadow duration-500",
        playing && "ring-1 ring-primary/20",
        className,
      )}
    >
      <div className="flex w-full touch-none items-end justify-between gap-0.5 overflow-hidden overscroll-none max-lg:landscape:h-full">
        {SOUNDS.map((sound) => (
          <SoundChannel
            key={sound.id}
            sound={sound}
            state={channels[sound.id] ?? { volume: 0, muted: false }}
            playing={playing}
            onVolume={(v) => setVolume(sound.id, v)}
            onToggleMute={() => toggleMute(sound.id)}
            onInteractionStart={unlockAudio}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {anySound ? "Sounds selected" : "No sounds selected"}
      </p>
    </section>
  );
}
