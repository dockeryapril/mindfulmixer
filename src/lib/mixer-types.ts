export interface ChannelState {
  volume: number; // 0..100
  muted: boolean;
}

export type ChannelMap = Record<string, ChannelState>;

export interface SavedMix {
  id: string;
  name: string;
  channels: ChannelMap;
  masterVolume: number;
  timerMinutes: number | null;
  favorite: boolean;
  lastUsed: string; // ISO date
}

export type ThemePreference = "cream" | "dusk";

export interface Settings {
  defaultTimerMinutes: number | null;
  fadeOutSeconds: number;
  rememberLastMix: boolean;
  haptics: boolean;
  theme: ThemePreference;
  showFirstRun: boolean;
}

export interface PersistedState {
  version: 1;
  mixes: SavedMix[];
  settings: Settings;
  lastMix: { channels: ChannelMap; masterVolume: number } | null;
}

export type ModeId = "sleep" | "relax" | "focus" | "reset";
