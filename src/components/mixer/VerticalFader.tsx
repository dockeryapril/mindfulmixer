import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VerticalFaderProps {
  value: number; // 0..100
  onChange: (value: number) => void;
  label: string;
  active?: boolean;
  muted?: boolean;
  sounding?: boolean;
  handle: ReactNode;
  onToggleMute: () => void;
  onInteractionStart?: () => void;
  /** Tailwind height classes for the fader travel. */
  heightClassName?: string;
}

/** Physical-fader style vertical slider: recessed track, raised round handle. */
export function VerticalFader({
  value,
  onChange,
  label,
  active = false,
  muted = false,
  sounding = false,
  handle,
  onToggleMute,
  onInteractionStart,
  heightClassName = "h-[clamp(7rem,23dvh,10rem)] max-lg:landscape:h-[clamp(4rem,20dvh,7rem)]",
}: VerticalFaderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const tapCandidate = useRef(false);
  const startY = useRef(0);

  /* Keep the page still while a finger is on the fader. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const block = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchstart", block, { passive: false });
    el.addEventListener("touchmove", block, { passive: false });
    return () => {
      el.removeEventListener("touchstart", block);
      el.removeEventListener("touchmove", block);
    };
  }, []);

  const fromEvent = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pad = 16; // half of the circular icon handle
      const usable = rect.height - pad * 2;
      const y = Math.min(rect.bottom - pad, Math.max(rect.top + pad, clientY));
      const ratio = 1 - (y - (rect.top + pad)) / usable;
      onChange(Math.round(ratio * 100));
    },
    [onChange],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(Math.min(100, value + step));
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(Math.max(0, value - step));
    else if (e.key === "Home") onChange(0);
    else if (e.key === "End") onChange(100);
    else if (e.key === " " || e.key === "Enter") onToggleMute();
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={`${label} volume`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={`${value} percent${muted ? ", muted" : ""}`}
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onInteractionStart?.();
        dragging.current = true;
        tapCandidate.current = Boolean((e.target as Element).closest("[data-fader-handle]"));
        startY.current = e.clientY;
        e.currentTarget.setPointerCapture(e.pointerId);
        if (!tapCandidate.current) fromEvent(e.clientY);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        e.preventDefault();
        e.stopPropagation();
        if (Math.abs(e.clientY - startY.current) > 4) tapCandidate.current = false;
        fromEvent(e.clientY);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        const shouldToggle = tapCandidate.current;
        dragging.current = false;
        tapCandidate.current = false;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        if (shouldToggle) onToggleMute();
      }}
      onPointerCancel={() => {
        dragging.current = false;
        tapCandidate.current = false;
      }}
      onLostPointerCapture={() => {
        dragging.current = false;
        tapCandidate.current = false;
      }}
      className={cn(
        "relative mx-auto w-full max-w-10 cursor-pointer touch-none overscroll-none rounded-full select-none",
        heightClassName,
      )}
      style={{ touchAction: "none" }}
    >
      {/* recessed track */}
      <div className="groove absolute inset-x-[13px] inset-y-0 rounded-full" />
      {/* illuminated active portion */}
      <div
        className={cn(
          "absolute inset-x-[13px] bottom-0 rounded-full transition-[opacity,box-shadow] duration-200",
          active ? "opacity-100" : "opacity-35",
        )}
        style={{
          height: `${value}%`,
          background:
            "linear-gradient(180deg, var(--color-primary), color-mix(in oklab, var(--color-primary) 70%, var(--color-accent)))",
          boxShadow: active ? "var(--glow-accent)" : "none",
        }}
      />
      {/* The sound icon is both the draggable fader handle and tap-to-mute control. */}
      <div
        data-fader-handle
        className={cn(
          "absolute left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-panel-edge transition-[color,background-color,box-shadow]",
          muted ? "bg-foreground/8 text-muted-foreground/45" : "knob text-muted-foreground",
        )}
        style={{ bottom: `calc(${value}% - ${value * 0.32}px)` }}
      >
        {handle}
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-primary",
            sounding ? "breathe" : "opacity-0",
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
