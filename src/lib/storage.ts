import type { PersistedState, Settings } from "./mixer-types";
import { starterMixes } from "./presets";

/**
 * Local-first persistence. All reads/writes funnel through this module so a
 * later migration to Supabase user accounts only needs a new implementation of
 * `loadState` / `saveState`.
 */
const KEY = "mindful-mixer:v1";

export const defaultSettings: Settings = {
  defaultTimerMinutes: null,
  fadeOutSeconds: 8,
  rememberLastMix: true,
  haptics: true,
  theme: "cream",
  showFirstRun: true,
};

export function defaultState(): PersistedState {
  return { version: 1, mixes: starterMixes(), settings: defaultSettings, lastMix: null };
}

export function loadState(): PersistedState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      version: 1,
      mixes: Array.isArray(parsed.mixes) ? parsed.mixes : starterMixes(),
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      lastMix: parsed.lastMix ?? null,
    };
  } catch {
    // Corrupt or unavailable storage must never blank the app.
    return defaultState();
  }
}

export function saveState(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — the app keeps working in memory */
  }
}
