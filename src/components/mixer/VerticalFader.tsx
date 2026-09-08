import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VerticalFaderProps {
  value: number; // 0..100
  onChange: (value: number) => void;
  label: string;
  active?: boolean;
  /** Tailwind height classes for the fader travel. */
  heightClassName?: string;
}

/** Physical-fader style vertical slider: recessed track, raised round handle. */
export function VerticalFader({
  value,
  onChange,
  label,
  active = false,
  heightClassName = "h-44 max-lg:landscape:h-[34vh] max-lg:landscape:min-h-28",
}: VerticalFaderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

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
      const pad = 14; // half handle
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
      aria-valuetext={`${value} percent`}
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromEvent(e.clientY);
      }}
      onPointerMove={(e) => {
        if (dragging.current) fromEvent(e.clientY);
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      className="relative mx-auto w-11 cursor-pointer touch-none rounded-full"
      style={{ height }}
    >
      {/* recessed track */}
      <div className="groove absolute inset-x-[13px] inset-y-0 rounded-full" />
      {/* illuminated active portion */}
      <div
        className={cn(
          "absolute inset-x-[13px] bottom-0 rounded-full transition-[height,opacity,box-shadow] duration-200",
          active ? "opacity-100" : "opacity-35",
        )}
        style={{
          height: `${value}%`,
          background: "linear-gradient(180deg, var(--color-primary), color-mix(in oklab, var(--color-primary) 70%, var(--color-accent)))",
          boxShadow: active ? "var(--glow-accent)" : "none",
        }}
      />
      {/* raised handle */}
      <div
        className="knob pointer-events-none absolute left-1/2 h-7 w-10 -translate-x-1/2 rounded-full border border-panel-edge transition-[bottom] duration-100"
        style={{ bottom: `calc(${value}% - 14px + ${(1 - value / 100) * 0}px)` }}
      >
        <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-panel-edge" />
      </div>
    </div>
  );
}
