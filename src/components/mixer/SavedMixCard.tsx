import { useState } from "react";
import { Copy, Heart, MoreVertical, Pencil, Play, RefreshCw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SOUNDS } from "@/lib/sounds";
import type { SavedMix } from "@/lib/mixer-types";
import { SoundIcon } from "./SoundIcon";
import { cn } from "@/lib/utils";

interface Props {
  mix: SavedMix;
  loaded: boolean;
  onLoad: () => void;
  onRename: (name: string) => void;
  onUpdate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function SavedMixCard({
  mix,
  loaded,
  onLoad,
  onRename,
  onUpdate,
  onDuplicate,
  onDelete,
  onToggleFavorite,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(mix.name);

  const active = SOUNDS.filter((s) => (mix.channels[s.id]?.volume ?? 0) > 0);

  return (
    <article
      className={cn(
        "panel rounded-3xl p-4",
        loaded && "ring-1 ring-primary/30",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onLoad}
          aria-label={`Load ${mix.name}`}
          className="knob flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-panel-edge text-primary"
        >
          <Play size={17} className="ml-0.5" strokeWidth={2} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onRename(draft);
                setEditing(false);
              }}
            >
              <label htmlFor={`name-${mix.id}`} className="sr-only">
                Mix name
              </label>
              <Input
                id={`name-${mix.id}`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => {
                  onRename(draft);
                  setEditing(false);
                }}
                autoFocus
                className="h-9 rounded-xl"
              />
            </form>
          ) : (
            <h3 className="truncate font-display text-[17px] leading-tight">{mix.name}</h3>
          )}
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {active.length} sound{active.length === 1 ? "" : "s"}
            {mix.timerMinutes ? ` · ${mix.timerMinutes} min timer` : ""} · last used{" "}
            {new Date(mix.lastUsed).toLocaleDateString()}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {active.map((s) => (
              <span
                key={s.id}
                title={s.name}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <SoundIcon name={s.icon} size={14} />
                <span className="sr-only">{s.name}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={mix.favorite ? `Remove ${mix.name} from favorites` : `Mark ${mix.name} as favorite`}
            aria-pressed={mix.favorite}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground"
          >
            <Heart size={17} className={mix.favorite ? "fill-primary text-primary" : ""} aria-hidden="true" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`More options for ${mix.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground"
            >
              <MoreVertical size={17} aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl">
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <Pencil size={14} /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onUpdate}>
                <RefreshCw size={14} /> Update with current mix
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy size={14} /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
