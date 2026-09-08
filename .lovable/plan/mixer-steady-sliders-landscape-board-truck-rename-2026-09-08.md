# Mixer: steady sliders, landscape board, Truck rename

## 1. Sliders no longer drag the page

Right now, sliding a volume fader with a finger can also scroll or bounce the page
underneath. Fix so a finger on a fader only moves that fader:

- On each fader, block browser scroll/zoom gestures while a drag is in progress
  (`touch-action: none` on the whole hit area, plus `preventDefault()` on the
  initial touch and a `pointerdown`-scoped scroll lock).
- Stop the drag from bubbling into the horizontal channel strip, so the strip
  doesn't slide sideways mid-adjustment.
- Prevent page-level rubber-banding while the console is being touched
  (`overscroll-behavior: contain` on the scroll strip).

## 2. Board goes horizontal (landscape)

- In landscape, the mixer becomes a single fixed row showing all eight channels
  at once — no swiping, taller faders, comfortable touch targets, header and
  timer condensed to one line above the board.
- In portrait on a phone, the mixer screen shows a calm "Rotate your phone"
  card with the app name, a rotate icon and a short line of copy; the board is
  not shown. Modes, timer, saved mixes and Settings stay reachable so nothing
  is lost.
- Tablets/desktop keep the current wide layout (they already fit eight
  channels), so the rotate prompt is phone-only.

## 3. "Train" becomes "Truck"

- Sound name changes from "Idle Diesel" to "Truck".
- Icon changes from the train icon to a truck icon.
- Any supporting copy or preset/mix wording referring to a train or diesel
  engine is updated to truck.
- Saved mixes keep working: only the display name and icon change, the stored
  channel id stays the same so existing saved mixes still load.

## Technical notes

- `src/components/mixer/VerticalFader.tsx`: add `onTouchStart` preventDefault,
  `stopPropagation` on pointer events, keep pointer capture; ensure
  `touch-action: none` covers handle and track.
- `src/components/mixer/MixerConsole.tsx`: `overscroll-x-contain`; add a
  landscape variant (single non-scrolling flex row, taller fader height passed
  through `SoundChannel`) and hide the swipe affordance in landscape.
- New `src/components/mixer/RotatePrompt.tsx` plus an orientation hook using
  `matchMedia("(orientation: portrait)")` read in `useEffect` to avoid
  hydration mismatch; used only in `src/routes/index.tsx` and only below the
  `lg` breakpoint.
- `src/lib/sounds.ts`: `name: "Truck"`, `icon: "truck"`; add `truck` to
  `SoundIconName` and map to lucide `Truck` in `SoundIcon.tsx`. Keep
  `id: "diesel"` and the `diesel` synth recipe untouched.
- Check `src/lib/presets.ts` and onboarding copy for train/diesel wording.
