import { useState } from "react";
import { Bookmark, Eraser, Shuffle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
        "flex h-11 flex-col items-center justify-center gap-0.5 rounded-2xl border border-panel-edge text-[11px] font-medium transition-colors",
        active ? "bg-primary/12 text-primary" : "knob text-foreground/75",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function MasterControls({ className }: { className?: string }) {
  const { anySound, clearMix, shuffle, saveCurrentMix } = useMixer();
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <section aria-label="Mix actions" className={cn("panel rounded-3xl p-2", className)}>
      <div className="grid grid-cols-4 gap-2 max-lg:landscape:grid-cols-2 max-lg:landscape:gap-1">
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
            <DialogDescription>Sound levels and timer are stored with the mix.</DialogDescription>
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
