/**
 * Centralised sound configuration.
 *
 * Production recordings live in `public/audio`. The engine prefers each local
 * recording and falls back to the matching Web Audio synth if a file cannot be
 * loaded, so a missing asset never makes a mixer channel unusable.
 */

export type SynthRecipe =
  "rain" | "birds" | "wind" | "ocean" | "fire" | "diesel" | "crickets" | "om";

export type SoundIconName = "rain" | "bird" | "wind" | "waves" | "flame" | "truck" | "bug" | "om";

export interface SoundDef {
  id: string;
  name: string;
  icon: SoundIconName;
  /** Optional looping audio file. Leave undefined to use the fallback synth. */
  src?: string;
  /** Per-sound loudness trim so channels feel balanced at equal fader values. */
  trim: number;
  synth: SynthRecipe;
}

export const SOUNDS: SoundDef[] = [
  { id: "rain", name: "Rain", icon: "rain", src: "/audio/rain.m4a", trim: 0.72, synth: "rain" },
  { id: "birds", name: "Birds", icon: "bird", src: "/audio/birds.m4a", trim: 0.7, synth: "birds" },
  { id: "wind", name: "Wind", icon: "wind", src: "/audio/wind.m4a", trim: 0.74, synth: "wind" },
  {
    id: "ocean",
    name: "Ocean",
    icon: "waves",
    src: "/audio/ocean.m4a",
    trim: 0.78,
    synth: "ocean",
  },
  { id: "fire", name: "Fire", icon: "flame", src: "/audio/fire.m4a", trim: 0.72, synth: "fire" },
  {
    id: "diesel",
    name: "Truck",
    icon: "truck",
    src: "/audio/diesel.m4a",
    trim: 0.68,
    synth: "diesel",
  },
  {
    id: "crickets",
    name: "Crickets",
    icon: "bug",
    src: "/audio/crickets.m4a",
    trim: 0.64,
    synth: "crickets",
  },
  { id: "om", name: "Om Chant", icon: "om", src: "/audio/om.m4a", trim: 0.7, synth: "om" },
];

export const SOUND_IDS = SOUNDS.map((s) => s.id);

export const soundById = (id: string) => SOUNDS.find((s) => s.id === id);
