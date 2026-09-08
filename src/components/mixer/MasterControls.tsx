import { useState } from "react";
import { Bookmark, Eraser, Pause, Play, Shuffle, Volume2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useMixer } from "@/hooks/use-mixer";
import { SessionTimer } from "./SessionTimer";
import { cn } from "@/lib/utils";

function SmallControl({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-12 flex-col items-center justify-center gap-0.5 rounded-2xl border border-panel-edge text-[11px] font-medium transition-colors",
        active ? "bg-primary/12 text-primary" : "knob text-foreground/75",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function MasterControls() {
  const { playing, togglePlay, masterVolume, setMasterVolume, anySound, clearMix, shuffle, saveCurrentMix } =
    useMixer();
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <section aria-label="Master controls" className="panel rounded-3xl p-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            if (!anySound && !playing) {
              toast("Raise a slider first", { description: "Pick at least one sound to play." });
              return;
            }
            togglePlay();
          }}
          aria-label={playing ? "Pause mix" : "Play mix"}
          aria-pressed={playing}
          className={cn(
            "relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full transition-all duration-500 active:scale-[0.97]",
            playing ? "accent-glow" : "",
          )}
          style={{
            background: playing
              ? "radial-gradient(circle at 35% 28%, color-mix(in oklab, var(--color-primary) 78%, white), var(--color-primary) 70%)"
              : "radial-gradient(circle at 35% 28%, color-mix(in oklab, var(--color-primary) 55%, white), color-mix(in oklab, var(--color-primary) 88%, black) 95%)",
            boxShadow: playing
              ? "var(--glow-accent), 0 8px 18px -6px oklch(0.4 0.05 50 / 0.45), inset 0 2px 3px oklch(1 0 0 / 0.35)"
              : "0 8px 16px -8px oklch(0.4 0.05 50 / 0.4), inset 0 2px 3px oklch(1 0 0 / 0.25)",
          }}
        >
          <span className="text-primary-foreground">
            {playing ? <Pause size={34} strokeWidth={2} /> : <Play size={34} strokeWidth={2} className="ml-1" />}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Volume2 size={14} aria-hidden="true" /> Master
            </span>
            <span className="digital tabular-nums">{String(masterVolume).padStart(2, "0")}</span>
          </div>
          <Slider
            value={[masterVolume]}
            onValueChange={([v]) => setMasterVolume(v)}
            max={100}
            step={1}
            aria-label="Master volume"
          />
          <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
            {playing ? "Playing your mix" : anySound ? "Ready when you are" : "Raise a slider to add a sound"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <SessionTimer />
        <SmallControl
          label="Save"
          icon={<Bookmark size={17} strokeWidth={1.7} aria-hidden="true" />}
          onClick={() => {
            if (!anySound) {
              toast("Nothing to save yet", { description: "Raise at least one slider." });
              return;
            }
            setSaveOpen(true);
          }}
        />
        <SmallControl
          label="Shuffle"
          icon={<Shuffle size={17} strokeWidth={1.7} aria-hidden="true" />}
          onClick={shuffle}
        />
        <SmallControl
          label="Clear"
          icon={<Eraser size={17} strokeWidth={1.7} aria-hidden="true" />}
          onClick={() => {
            clearMix();
            toast("Mix cleared");
          }}
        />
      </div>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display">Save this mix</DialogTitle>
            <DialogDescription>
              Sound levels, master volume and timer are stored with the mix.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              saveCurrentMix(name);
              setName("");
              setSaveOpen(false);
              toast("Mix saved", { description: "Find it under My Mixes." });
            }}
          >
            <label htmlFor="mix-name" className="text-sm font-medium">
              Mix name
            </label>
            <Input
              id="mix-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Late night rain"
              className="rounded-2xl"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-2xl bg-primary py-3 text-sm font-medium text-primary-foreground"
            >
              Save mix
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
