import { useState } from "react";
import { Timer, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMixer } from "@/hooks/use-mixer";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "1 hour", minutes: 60 },
  { label: "2 hours", minutes: 120 },
];

export function SessionTimer() {
  const { timerMinutes, remainingMs, startTimer, cancelTimer } = useMixer();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  const running = remainingMs !== null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Session timer"
          className={cn(
            "flex h-11 flex-col items-center justify-center gap-0.5 rounded-2xl border border-panel-edge text-[11px] font-medium transition-colors",
            running ? "bg-primary/12 text-primary" : "knob text-foreground/75",
          )}
        >
          <Timer size={17} strokeWidth={1.7} aria-hidden="true" />
          Timer
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display">Session timer</DialogTitle>
          <DialogDescription>
            Sounds fade out gently when the timer ends. Your mix stays exactly as you left it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.minutes}
              type="button"
              onClick={() => {
                startTimer(p.minutes);
                setOpen(false);
              }}
              className={cn(
                "rounded-2xl border border-panel-edge py-3 text-sm font-medium transition-colors",
                timerMinutes === p.minutes
                  ? "bg-primary/15 text-primary"
                  : "knob text-foreground/80",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(custom);
            if (Number.isFinite(n) && n > 0) {
              startTimer(Math.min(720, Math.round(n)));
              setOpen(false);
              setCustom("");
            }
          }}
        >
          <label htmlFor="custom-timer" className="sr-only">
            Custom timer in minutes
          </label>
          <Input
            id="custom-timer"
            inputMode="numeric"
            placeholder="Custom minutes"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="rounded-2xl"
          />
          <button
            type="submit"
            className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Set
          </button>
        </form>

        {running && (
          <button
            type="button"
            onClick={() => {
              cancelTimer();
              setOpen(false);
            }}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-panel-edge py-2.5 text-sm text-foreground/75"
          >
            <X size={15} aria-hidden="true" /> Cancel timer
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
