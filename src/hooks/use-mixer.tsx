import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getEngine } from "@/lib/audio-engine";
import { SOUNDS } from "@/lib/sounds";
import { MODES, emptyChannels, shuffleChannels } from "@/lib/presets";
import { defaultState, loadState, saveState } from "@/lib/storage";
import type {
  ChannelMap,
  ModeId,
  PersistedState,
  SavedMix,
  SavedMix as Mix,
  Settings,
} from "@/lib/mixer-types";

interface MixerContextValue {
  hydrated: boolean;
  channels: ChannelMap;
  masterVolume: number;
  playing: boolean;
  activeMode: ModeId | null;
  anySound: boolean;
  mixes: SavedMix[];
  settings: Settings;
  loadedMixId: string | null;
  timerMinutes: number | null;
  remainingMs: number | null;
  audioErrors: string[];
  setVolume: (id: string, volume: number) => void;
  toggleMute: (id: string) => void;
  setMasterVolume: (v: number) => void;
  togglePlay: () => void;
  applyMode: (id: ModeId) => void;
  clearMix: () => void;
  shuffle: () => void;
  startTimer: (minutes: number | null) => void;
  cancelTimer: () => void;
  saveCurrentMix: (name: string) => void;
  updateMix: (id: string) => void;
  renameMix: (id: string, name: string) => void;
  duplicateMix: (id: string) => void;
  deleteMix: (id: string) => void;
  toggleFavorite: (id: string) => void;
  loadMix: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
}

const MixerContext = createContext<MixerContextValue | null>(null);

const uid = () => `mix-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function MixerProvider({ children }: { children: ReactNode }) {
  const engine = getEngine();
  const [hydrated, setHydrated] = useState(false);
  const [channels, setChannels] = useState<ChannelMap>(() => emptyChannels());
  const [masterVolume, setMaster] = useState(75);
  const [playing, setPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState<ModeId | null>(null);
  const [persisted, setPersisted] = useState<PersistedState>(() => defaultState());
  const [loadedMixId, setLoadedMixId] = useState<string | null>(null);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [audioErrors, setAudioErrors] = useState<string[]>([]);
  const fadingRef = useRef(false);

  // --- hydrate from local storage -----------------------------------------
  useEffect(() => {
    const state = loadState();
    setPersisted(state);
    setTimerMinutes(state.settings.defaultTimerMinutes);
    if (state.settings.rememberLastMix && state.lastMix) {
      setChannels({ ...emptyChannels(), ...state.lastMix.channels });
      setMaster(state.lastMix.masterVolume);
    }
    setHydrated(true);
  }, []);

  // --- persist -------------------------------------------------------------
  useEffect(() => {
    if (!hydrated) return;
    saveState({ ...persisted, lastMix: { channels, masterVolume } });
  }, [hydrated, persisted, channels, masterVolume]);

  // --- theme ---------------------------------------------------------------
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", persisted.settings.theme === "dusk");
  }, [persisted.settings.theme]);

  // --- audio errors --------------------------------------------------------
  useEffect(() => {
    engine.events.onError = (_id, name) =>
      setAudioErrors((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }, [engine]);

  // --- push state into engine ---------------------------------------------
  useEffect(() => {
    if (!engine.ready) return;
    for (const def of SOUNDS) {
      const ch = channels[def.id];
      engine.setChannel(def.id, ch && !ch.muted ? ch.volume / 100 : 0);
    }
  }, [channels, engine, playing]);

  useEffect(() => {
    engine.setMaster(masterVolume / 100);
  }, [masterVolume, engine]);

  const haptic = useCallback(() => {
    if (!persisted.settings.haptics) return;
    try {
      navigator.vibrate?.(8);
    } catch {
      /* unsupported */
    }
  }, [persisted.settings.haptics]);

  // --- controls ------------------------------------------------------------
  const setVolume = useCallback(
    (id: string, volume: number) => {
      const v = Math.max(0, Math.min(100, Math.round(volume)));
      setChannels((prev) => ({ ...prev, [id]: { volume: v, muted: v === 0 ? false : (prev[id]?.muted ?? false) } }));
      setActiveMode(null);
      if (engine.ready) engine.setChannel(id, v / 100);
    },
    [engine],
  );

  const toggleMute = useCallback(
    (id: string) => {
      haptic();
      setChannels((prev) => {
        const cur = prev[id] ?? { volume: 0, muted: false };
        return { ...prev, [id]: { ...cur, muted: !cur.muted } };
      });
    },
    [haptic],
  );

  const setMasterVolume = useCallback((v: number) => {
    setMaster(Math.max(0, Math.min(100, Math.round(v))));
  }, []);

  const startPlayback = useCallback(async () => {
    fadingRef.current = false;
    await engine.play();
    for (const def of SOUNDS) {
      const ch = channels[def.id];
      engine.setChannel(def.id, ch && !ch.muted ? ch.volume / 100 : 0);
    }
    engine.setMaster(masterVolume / 100);
    setPlaying(true);
  }, [channels, engine, masterVolume]);

  const stopPlayback = useCallback(
    (fadeSeconds = 0.5) => {
      engine.pause(fadeSeconds);
      setPlaying(false);
    },
    [engine],
  );

  const togglePlay = useCallback(() => {
    haptic();
    if (playing) stopPlayback(0.6);
    else void startPlayback();
  }, [haptic, playing, startPlayback, stopPlayback]);

  const applyMode = useCallback((id: ModeId) => {
    const mode = MODES.find((m) => m.id === id);
    if (!mode) return;
    const next = emptyChannels();
    for (const [sound, volume] of Object.entries(mode.levels)) next[sound] = { volume, muted: false };
    setChannels(next);
    setActiveMode(id);
    setLoadedMixId(null);
  }, []);

  const clearMix = useCallback(() => {
    setChannels(emptyChannels());
    setActiveMode(null);
    setLoadedMixId(null);
    stopPlayback(persisted.settings.fadeOutSeconds / 2);
    setEndsAt(null);
    setRemainingMs(null);
  }, [persisted.settings.fadeOutSeconds, stopPlayback]);

  const shuffle = useCallback(() => {
    haptic();
    setChannels(shuffleChannels());
    setActiveMode(null);
    setLoadedMixId(null);
  }, [haptic]);

  // --- timer ---------------------------------------------------------------
  const startTimer = useCallback(
    (minutes: number | null) => {
      setTimerMinutes(minutes);
      if (minutes === null) {
        setEndsAt(null);
        setRemainingMs(null);
        return;
      }
      setEndsAt(Date.now() + minutes * 60_000);
      setRemainingMs(minutes * 60_000);
      if (!playing) void startPlayback();
    },
    [playing, startPlayback],
  );

  const cancelTimer = useCallback(() => {
    setEndsAt(null);
    setRemainingMs(null);
    setTimerMinutes(null);
  }, []);

  useEffect(() => {
    if (endsAt === null) return;
    const fadeMs = persisted.settings.fadeOutSeconds * 1000;
    const tick = () => {
      const left = endsAt - Date.now();
      setRemainingMs(Math.max(0, left));
      if (left <= fadeMs && !fadingRef.current) {
        fadingRef.current = true;
        engine.fadeOut(persisted.settings.fadeOutSeconds);
      }
      if (left <= 0) {
        fadingRef.current = false;
        setEndsAt(null);
        setRemainingMs(null);
        setPlaying(false);
        engine.pause(0.2);
      }
    };
    tick();
    const i = setInterval(tick, 250);
    return () => clearInterval(i);
  }, [endsAt, engine, persisted.settings.fadeOutSeconds]);

  // --- saved mixes ---------------------------------------------------------
  const mutateMixes = useCallback((fn: (mixes: Mix[]) => Mix[]) => {
    setPersisted((prev) => ({ ...prev, mixes: fn(prev.mixes) }));
  }, []);

  const saveCurrentMix = useCallback(
    (name: string) => {
      const mix: SavedMix = {
        id: uid(),
        name: name.trim() || "Untitled mix",
        channels,
        masterVolume,
        timerMinutes,
        favorite: false,
        lastUsed: new Date().toISOString(),
      };
      mutateMixes((prev) => [mix, ...prev]);
      setLoadedMixId(mix.id);
    },
    [channels, masterVolume, mutateMixes, timerMinutes],
  );

  const updateMix = useCallback(
    (id: string) => {
      mutateMixes((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, channels, masterVolume, timerMinutes, lastUsed: new Date().toISOString() }
            : m,
        ),
      );
    },
    [channels, masterVolume, mutateMixes, timerMinutes],
  );

  const renameMix = useCallback(
    (id: string, name: string) =>
      mutateMixes((prev) => prev.map((m) => (m.id === id ? { ...m, name: name.trim() || m.name } : m))),
    [mutateMixes],
  );

  const duplicateMix = useCallback(
    (id: string) =>
      mutateMixes((prev) => {
        const src = prev.find((m) => m.id === id);
        if (!src) return prev;
        return [{ ...src, id: uid(), name: `${src.name} copy`, favorite: false }, ...prev];
      }),
    [mutateMixes],
  );

  const deleteMix = useCallback(
    (id: string) => mutateMixes((prev) => prev.filter((m) => m.id !== id)),
    [mutateMixes],
  );

  const toggleFavorite = useCallback(
    (id: string) =>
      mutateMixes((prev) => prev.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m))),
    [mutateMixes],
  );

  const loadMix = useCallback(
    (id: string) => {
      const mix = persisted.mixes.find((m) => m.id === id);
      if (!mix) return;
      setChannels({ ...emptyChannels(), ...mix.channels });
      setMaster(mix.masterVolume);
      setTimerMinutes(mix.timerMinutes);
      setEndsAt(mix.timerMinutes ? Date.now() + mix.timerMinutes * 60_000 : null);
      setLoadedMixId(id);
      setActiveMode(null);
      mutateMixes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, lastUsed: new Date().toISOString() } : m)),
      );
    },
    [mutateMixes, persisted.mixes],
  );

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setPersisted((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const anySound = useMemo(
    () => SOUNDS.some((s) => (channels[s.id]?.volume ?? 0) > 0 && !channels[s.id]?.muted),
    [channels],
  );

  const value: MixerContextValue = {
    hydrated,
    channels,
    masterVolume,
    playing,
    activeMode,
    anySound,
    mixes: persisted.mixes,
    settings: persisted.settings,
    loadedMixId,
    timerMinutes,
    remainingMs,
    audioErrors,
    setVolume,
    toggleMute,
    setMasterVolume,
    togglePlay,
    applyMode,
    clearMix,
    shuffle,
    startTimer,
    cancelTimer,
    saveCurrentMix,
    updateMix,
    renameMix,
    duplicateMix,
    deleteMix,
    toggleFavorite,
    loadMix,
    updateSettings,
  };

  return <MixerContext.Provider value={value}>{children}</MixerContext.Provider>;
}

export function useMixer() {
  const ctx = useContext(MixerContext);
  if (!ctx) throw new Error("useMixer must be used inside MixerProvider");
  return ctx;
}
