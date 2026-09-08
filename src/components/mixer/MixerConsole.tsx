import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { SOUNDS } from "@/lib/sounds";
import { useMixer } from "@/hooks/use-mixer";
import { SoundChannel } from "./SoundChannel";
import { cn } from "@/lib/utils";

export function MixerConsole() {
  const { channels, playing, setVolume, toggleMute, anySound } = useMixer();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      aria-label="Sound channels"
      className={cn(
        "panel relative rounded-3xl p-3 transition-shadow duration-500",
        playing && "ring-1 ring-primary/20",
      )}
    >
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-1 max-lg:landscape:justify-between max-lg:landscape:gap-1 max-lg:landscape:overflow-x-visible lg:justify-center"
      >
        {SOUNDS.map((sound) => (
          <SoundChannel
            key={sound.id}
            sound={sound}
            state={channels[sound.id] ?? { volume: 0, muted: false }}
            playing={playing}
            onVolume={(v) => setVolume(sound.id, v)}
            onToggleMute={() => toggleMute(sound.id)}
          />
        ))}
      </div>

      {/* more-channels affordance */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-3 right-1 flex w-10 items-center justify-end rounded-r-3xl transition-opacity duration-300 max-lg:landscape:hidden lg:hidden",
          atEnd ? "opacity-0" : "opacity-100",
        )}
        style={{ background: "linear-gradient(270deg, var(--panel) 20%, transparent)" }}
      >
        <ChevronRight className="mr-1 text-muted-foreground" size={18} />
      </div>

      {!anySound && (
        <p className="mt-2 border-t border-panel-edge pt-3 text-center text-[13px] text-muted-foreground">
          Your space is quiet. Raise a slider to begin.
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {anySound ? "Sounds selected" : "No sounds selected"}
      </p>
      <span className="mt-1 block text-center text-[10px] tracking-wide text-muted-foreground/70 max-lg:landscape:hidden lg:hidden">
        Four channels at a time · Swipe for more
      </span>
    </section>
  );
}
