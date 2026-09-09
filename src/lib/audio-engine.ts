import { SOUNDS, type SoundDef } from "./sounds";

/**
 * Web Audio engine: one always-running source per channel behind its own gain
 * node, all summed into a master gain. Volume changes are gain ramps, so audio
 * never restarts and there is exactly one instance of each loop.
 */

type Channel = {
  gain: GainNode;
  level: number; // 0..1 requested by UI (already mute-adjusted)
  source?: AudioBufferSourceNode | undefined;
  fallbackStarted?: boolean | undefined;
  schedule?: ((until: number) => void) | undefined;
};

type PlaybackNavigator = Navigator & {
  audioSession?: {
    type: "ambient" | "playback" | "transient" | "transient-solo" | "play-and-record";
  };
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function noiseBuffer(ctx: AudioContext, kind: "white" | "brown", seconds = 6) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === "white") {
      data[i] = w * 0.6;
    } else {
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 6;
    }
  }
  // Smooth the loop seam.
  const fade = Math.min(2000, Math.floor(len / 8));
  for (let i = 0; i < fade; i++) {
    const k = i / fade;
    data[i] = (data[i] ?? 0) * k;
    data[len - 1 - i] = (data[len - 1 - i] ?? 0) * k;
  }
  return buf;
}

function noiseSource(ctx: AudioContext, kind: "white" | "brown") {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, kind);
  src.loop = true;
  src.start();
  return src;
}

function lp(ctx: AudioContext, freq: number, q = 0.7) {
  const f = ctx.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

function hp(ctx: AudioContext, freq: number) {
  const f = ctx.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = freq;
  return f;
}

/** Slow sine LFO modulating a param. */
function lfo(ctx: AudioContext, rate: number, depth: number, target: AudioParam) {
  const osc = ctx.createOscillator();
  osc.frequency.value = rate;
  const g = ctx.createGain();
  g.gain.value = depth;
  osc.connect(g).connect(target);
  osc.start();
}

/** One short pitched event (bird chirp, cricket, crackle). */
function blip(
  ctx: AudioContext,
  dest: AudioNode,
  t: number,
  opts: { f0: number; f1: number; dur: number; gain: number; type?: OscillatorType },
) {
  const osc = ctx.createOscillator();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.f0, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(30, opts.f1), t + opts.dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.gain, t + opts.dur * 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  osc.connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + opts.dur + 0.05);
}

function buildSynth(ctx: AudioContext, def: SoundDef, out: GainNode): Channel["schedule"] {
  switch (def.synth) {
    case "rain": {
      const n = noiseSource(ctx, "white");
      const high = hp(ctx, 700);
      const low = lp(ctx, 7000);
      n.connect(high).connect(low).connect(out);
      const body = noiseSource(ctx, "brown");
      const bodyLow = lp(ctx, 500);
      const bodyGain = ctx.createGain();
      bodyGain.gain.value = 0.5;
      body.connect(bodyLow).connect(bodyGain).connect(out);
      return undefined;
    }
    case "wind": {
      const n = noiseSource(ctx, "brown");
      const filter = lp(ctx, 420, 2);
      lfo(ctx, 0.08, 260, filter.frequency);
      const amp = ctx.createGain();
      amp.gain.value = 0.85;
      lfo(ctx, 0.06, 0.25, amp.gain);
      n.connect(filter).connect(amp).connect(out);
      return undefined;
    }
    case "ocean": {
      const n = noiseSource(ctx, "brown");
      const filter = lp(ctx, 900, 1.2);
      lfo(ctx, 0.09, 400, filter.frequency);
      const amp = ctx.createGain();
      amp.gain.value = 0.6;
      lfo(ctx, 0.11, 0.4, amp.gain);
      n.connect(filter).connect(amp).connect(out);
      return undefined;
    }
    case "fire": {
      const n = noiseSource(ctx, "brown");
      const filter = lp(ctx, 1100, 1);
      const amp = ctx.createGain();
      amp.gain.value = 0.7;
      lfo(ctx, 0.5, 0.15, amp.gain);
      n.connect(filter).connect(amp).connect(out);
      let next = ctx.currentTime;
      return (until) => {
        if (next < ctx.currentTime) next = ctx.currentTime;
        while (next < until) {
          blip(ctx, out, next, {
            f0: 900 + Math.random() * 2200,
            f1: 200,
            dur: 0.03 + Math.random() * 0.05,
            gain: 0.05 + Math.random() * 0.12,
            type: "triangle",
          });
          next += 0.04 + Math.random() * 0.28;
        }
      };
    }
    case "diesel": {
      const o1 = ctx.createOscillator();
      o1.type = "sawtooth";
      o1.frequency.value = 41;
      const o2 = ctx.createOscillator();
      o2.type = "square";
      o2.frequency.value = 20.5;
      const filter = lp(ctx, 260, 3);
      lfo(ctx, 6.5, 40, filter.frequency);
      const amp = ctx.createGain();
      amp.gain.value = 0.5;
      lfo(ctx, 6.5, 0.12, amp.gain);
      o1.connect(filter);
      o2.connect(filter);
      filter.connect(amp).connect(out);
      o1.start();
      o2.start();
      const rumble = noiseSource(ctx, "brown");
      const rl = lp(ctx, 180);
      const rg = ctx.createGain();
      rg.gain.value = 0.45;
      rumble.connect(rl).connect(rg).connect(out);
      return undefined;
    }
    case "om": {
      const amp = ctx.createGain();
      amp.gain.value = 0.35;
      lfo(ctx, 0.13, 0.12, amp.gain);
      [
        { f: 108, g: 1 },
        { f: 216.4, g: 0.4 },
        { f: 324, g: 0.18 },
        { f: 54.2, g: 0.5 },
      ].forEach(({ f, g }) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        const og = ctx.createGain();
        og.gain.value = g;
        o.connect(og).connect(amp);
        o.start();
      });
      const filter = lp(ctx, 1400);
      amp.connect(filter).connect(out);
      return undefined;
    }
    case "birds": {
      let next = ctx.currentTime + 0.4;
      return (until) => {
        if (next < ctx.currentTime) next = ctx.currentTime;
        while (next < until) {
          const notes = 1 + Math.floor(Math.random() * 4);
          for (let i = 0; i < notes; i++) {
            const base = 2200 + Math.random() * 2200;
            blip(ctx, out, next + i * 0.09, {
              f0: base,
              f1: base * (0.6 + Math.random() * 0.9),
              dur: 0.06 + Math.random() * 0.07,
              gain: 0.1 + Math.random() * 0.12,
            });
          }
          next += 0.5 + Math.random() * 2.4;
        }
      };
    }
    case "crickets": {
      let next = ctx.currentTime + 0.2;
      return (until) => {
        if (next < ctx.currentTime) next = ctx.currentTime;
        while (next < until) {
          for (let i = 0; i < 3; i++) {
            blip(ctx, out, next + i * 0.055, {
              f0: 4400 + Math.random() * 500,
              f1: 4200,
              dur: 0.03,
              gain: 0.08,
              type: "triangle",
            });
          }
          next += 0.32 + Math.random() * 0.25;
        }
      };
    }
    default:
      return undefined;
  }
}

export type EngineEvents = {
  onError?: (soundId: string, name: string) => void;
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private channels = new Map<string, Channel>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private pauseTimer: ReturnType<typeof setTimeout> | null = null;
  private masterLevel = 0.75;
  private started = false;
  playing = false;
  events: EngineEvents = {};

  get ready() {
    return this.started;
  }

  async ensure(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // WebKit normally categorizes Web Audio as ambient, which the iPhone
    // Ring/Silent switch mutes. Mindful Mixer is user-requested media, so opt
    // into the playback category before creating or resuming the context.
    try {
      const session = (navigator as PlaybackNavigator).audioSession;
      if (session) session.type = "playback";
    } catch {
      // Older browsers do not expose the Audio Session API; audio still works
      // with their normal platform behavior.
    }

    if (!this.ctx) {
      const AC: typeof AudioContext =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return false;
      const ctx = new AC();
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(ctx.destination);
      for (const def of SOUNDS) this.build(def);
      this.timer = setInterval(() => this.tick(), 250);
      this.started = true;
    }
    if (this.ctx.state !== "running") {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }
    return this.ctx.state === "running";
  }

  private build(def: SoundDef) {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.master!);
    const channel: Channel = { gain, level: 0 };

    this.channels.set(def.id, channel);

    if (def.src) {
      // Decode recordings inside the already-unlocked Web Audio context. This
      // avoids starting eight HTMLAudioElements, which iOS may reject even
      // after a fader gesture.
      void this.loadRecording(def, channel);
    } else {
      channel.schedule = buildSynth(ctx, def, gain);
    }
  }

  private async loadRecording(def: SoundDef, channel: Channel) {
    const ctx = this.ctx;
    if (!ctx || !def.src) return;
    try {
      const response = await fetch(def.src);
      if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
      const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
      if (this.ctx !== ctx || ctx.state === "closed") return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(channel.gain);
      source.start();
      channel.source = source;
    } catch {
      if (channel.fallbackStarted || this.ctx !== ctx || ctx.state === "closed") return;
      channel.fallbackStarted = true;
      this.events.onError?.(def.id, def.name);
      channel.schedule = buildSynth(ctx, def, channel.gain);
    }
  }

  private tick() {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    const until = ctx.currentTime + 0.6;
    this.channels.forEach((ch) => {
      if (ch.level > 0.001 && ch.schedule) ch.schedule(until);
    });
  }

  private ramp(param: AudioParam, value: number, seconds = 0.18) {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(value, now + Math.max(0.01, seconds));
  }

  setChannel(id: string, level: number) {
    const ch = this.channels.get(id);
    if (!ch || !this.ctx) return;
    ch.level = clamp01(level);
    const def = SOUNDS.find((s) => s.id === id);
    this.ramp(ch.gain.gain, ch.level * (def?.trim ?? 1));
  }

  setMaster(level: number) {
    this.masterLevel = clamp01(level);
    if (this.ctx && this.playing) this.ramp(this.master!.gain, this.masterLevel);
  }

  async play(): Promise<boolean> {
    const unlocked = await this.ensure();
    if (!unlocked || !this.ctx) {
      this.playing = false;
      return false;
    }
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.pauseTimer = null;
    this.playing = true;
    this.ramp(this.master!.gain, this.masterLevel, 0.5);
    return true;
  }

  pause(fadeSeconds = 0.5) {
    if (!this.ctx || !this.master) {
      this.playing = false;
      return;
    }
    this.playing = false;
    this.ramp(this.master.gain, 0, fadeSeconds);
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.pauseTimer = setTimeout(
      () => {
        this.pauseTimer = null;
      },
      Math.max(0, fadeSeconds * 1000) + 50,
    );
  }

  /** Timer completion / clear: long graceful fade, then stop. */
  fadeOut(seconds: number) {
    this.pause(Math.max(0.2, seconds));
  }

  dispose() {
    if (this.timer) clearInterval(this.timer);
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.timer = null;
    this.pauseTimer = null;
    this.channels.forEach((channel) => {
      try {
        channel.source?.stop();
      } catch {
        /* already stopped */
      }
    });
    void this.ctx?.close();
    this.ctx = null;
    this.channels.clear();
    this.started = false;
    this.playing = false;
  }
}

let engine: AudioEngine | null = null;

export function getEngine() {
  if (!engine) engine = new AudioEngine();
  return engine;
}
