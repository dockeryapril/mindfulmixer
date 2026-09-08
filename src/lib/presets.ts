import { SOUND_IDS } from "./sounds";
import type { ChannelMap, ModeId, SavedMix } from "./mixer-types";

export function emptyChannels(): ChannelMap {
  const out: ChannelMap = {};
  for (const id of SOUND_IDS) out[id] = { volume: 0, muted: false };
  return out;
}

export function channelsFrom(levels: Partial<Record<string, number>>): ChannelMap {
  const base = emptyChannels();
  for (const [id, volume] of Object.entries(levels)) {
    if (base[id] && typeof volume === "number") base[id] = { volume, muted: false };
  }
  return base;
}

export const MODES: { id: ModeId; label: string; levels: Record<string, number> }[] = [
  { id: "sleep", label: "Sleep", levels: { rain: 55, om: 25, wind: 20 } },
  { id: "relax", label: "Relax", levels: { ocean: 60, birds: 30, wind: 25 } },
  { id: "focus", label: "Focus", levels: { rain: 40, diesel: 45 } },
  { id: "reset", label: "Reset", levels: { om: 55, fire: 30, crickets: 20 } },
];

const iso = () => new Date().toISOString();

export function starterMixes(): SavedMix[] {
  const defs: Array<[string, Record<string, number>, number | null]> = [
    ["Deep Sleep", { rain: 45, om: 30, wind: 18 }, 60],
    ["Rainy Cabin", { rain: 65, fire: 40, wind: 22 }, 45],
    ["Quiet Train Ride", { diesel: 60, rain: 25 }, 30],
    ["Morning Woods", { birds: 55, wind: 30, crickets: 15 }, null],
    ["Ocean Reset", { ocean: 70, wind: 25 }, 15],
    ["Campfire Focus", { fire: 55, crickets: 30, wind: 15 }, 45],
  ];
  return defs.map(([name, levels, timerMinutes], i) => ({
    id: `starter-${i}`,
    name,
    channels: channelsFrom(levels),
    masterVolume: 75,
    timerMinutes,
    favorite: false,
    lastUsed: iso(),
  }));
}

/** Balanced random combination: 2–4 sounds, complementary levels. */
export function shuffleChannels(): ChannelMap {
  const ids = [...SOUND_IDS].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 3);
  const picked = ids.slice(0, count);
  const levels: Record<string, number> = {};
  picked.forEach((id, i) => {
    const base = i === 0 ? 55 : 45 - i * 8;
    levels[id] = Math.max(15, Math.round(base + (Math.random() * 16 - 8)));
  });
  return channelsFrom(levels);
}
