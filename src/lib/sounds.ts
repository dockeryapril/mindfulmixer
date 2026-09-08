/**
 * Centralised sound configuration.
 *
 * PLACEHOLDER AUDIO: no production recordings ship with this build yet. Every
 * channel is currently synthesised in the browser by the Web Audio engine
 * (see `audio-engine.ts`) using the `synth` recipe below.
 *
 * To move to real audio files later, set `src` to a looping file URL
 * (e.g. "/audio/rain.mp3"). The engine prefers `src` when present and falls
 * back to the synthesised placeholder if the file fails to load — no component
 * changes required.
 */

export type SynthRecipe =
  | "rain"
  | "birds"
  | "wind"
  | "ocean"
  | "fire"
  | "diesel"
  | "crickets"
  | "om";

export type SoundIconName =
  | "rain"
  | "bird"
  | "wind"
  | "waves"
  | "flame"
  | "truck"
  | "bug"
  | "om";

export interface SoundDef {
  id: string;
  name: string;
  icon: SoundIconName;
  /** Optional looping audio file. Leave undefined to use the placeholder synth. */
  src?: string;
  /** Per-sound loudness trim so channels feel balanced at equal fader values. */
  trim: number;
  synth: SynthRecipe;
}

export const SOUNDS: SoundDef[] = [
  { id: "rain", name: "Rain", icon: "rain", trim: 0.5, synth: "rain" },
  { id: "birds", name: "Birds", icon: "bird", trim: 0.5, synth: "birds" },
  { id: "wind", name: "Wind", icon: "wind", trim: 0.75, synth: "wind" },
  { id: "ocean", name: "Ocean", icon: "waves", trim: 0.8, synth: "ocean" },
  { id: "fire", name: "Fire", icon: "flame", trim: 0.6, synth: "fire" },
  { id: "diesel", name: "Truck", icon: "truck", trim: 0.55, synth: "diesel" },
  { id: "crickets", name: "Crickets", icon: "bug", trim: 0.4, synth: "crickets" },
  { id: "om", name: "Om Chant", icon: "om", trim: 0.45, synth: "om" },
];

export const SOUND_IDS = SOUNDS.map((s) => s.id);

export const soundById = (id: string) => SOUNDS.find((s) => s.id === id);
