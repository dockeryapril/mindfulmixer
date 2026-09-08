import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMixer } from "@/hooks/use-mixer";
import { SavedMixCard } from "@/components/mixer/SavedMixCard";

export const Route = createFileRoute("/mixes")({
  head: () => ({
    meta: [
      { title: "My Mixes — Mindful Mixer" },
      {
        name: "description",
        content: "Your saved sound blends: load, rename, duplicate or favourite any mix in one tap.",
      },
      { property: "og:title", content: "My Mixes — Mindful Mixer" },
      { property: "og:description", content: "Load, rename and favourite your saved ambient sound blends." },
    ],
  }),
  component: MixesScreen,
});

function MixesScreen() {
  const { mixes, loadedMixId, loadMix, renameMix, updateMix, duplicateMix, deleteMix, toggleFavorite } =
    useMixer();
  const navigate = useNavigate();

  const sorted = [...mixes].sort((a, b) => Number(b.favorite) - Number(a.favorite));

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 pt-6 lg:max-w-3xl">
      <header>
        <p className="font-display text-[15px] tracking-tight text-primary">Mindful Mixer</p>
        <h1 className="mt-1 font-display text-[26px] leading-tight">My Mixes</h1>
      </header>

      {sorted.length === 0 ? (
        <p className="panel rounded-3xl p-6 text-center text-sm text-muted-foreground">
          No saved mixes yet. Build a blend on the mixer and tap Save.
        </p>
      ) : (
        sorted.map((mix) => (
          <SavedMixCard
            key={mix.id}
            mix={mix}
            loaded={loadedMixId === mix.id}
            onLoad={() => {
              loadMix(mix.id);
              toast(`${mix.name} loaded`, { description: "Press play on the mixer." });
              void navigate({ to: "/" });
            }}
            onRename={(name) => renameMix(mix.id, name)}
            onUpdate={() => {
              updateMix(mix.id);
              toast(`${mix.name} updated`);
            }}
            onDuplicate={() => duplicateMix(mix.id)}
            onDelete={() => {
              deleteMix(mix.id);
              toast(`${mix.name} deleted`);
            }}
            onToggleFavorite={() => toggleFavorite(mix.id)}
          />
        ))
      )}
    </div>
  );
}
