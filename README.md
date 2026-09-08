# Mindful Mixer

## Production audio

The eight mixer channels use local, iPhone-compatible AAC recordings and keep
the existing Web Audio synthesis as an automatic fallback. Source, creator,
license, and modification details are documented in
[`public/audio/CREDITS.md`](public/audio/CREDITS.md).

I am building a mobile-first ambient sound-mixing app called “Mindful Mixer.”

PRODUCT CONCEPT

Mindful Mixer allows users to combine multiple soothing sounds and control each sound independently, creating a personalized environment for sleeping, relaxing, focusing, meditating, reading, or calming anxiety.

The central experience should feel like using a beautiful physical sound machine or compact audio mixing board—not like browsing a generic meditation app.

Use the attached images only as inspiration for the interaction model:

Individual vertical volume sliders

A tactile control-panel appearance

Simple playback controls

A timer display

One larger master control

Multiple sounds playing simultaneously

Do not copy the product’s exact industrial design, icons, branding, proportions, or layout. Create an original digital interpretation for Mindful Mixer.

DESIGN DIRECTION

Create a calm, premium, tactile interface with:

Warm cream and soft off-white surfaces

Muted terracotta or coral accent lighting

Warm brown text

Very subtle shadows and highlights

Rounded corners

Recessed slider tracks

Raised circular slider handles

Smooth, restrained animations

A clean, uncluttered composition

Large touch targets suitable for iPhone use

The control panel should feel dimensional and touchable, but not cartoonish, overly glossy, skeuomorphic, or cluttered.

Avoid the predictable meditation-app appearance of purple gradients, floating lotus flowers, excessive inspirational language, or stock wellness photography.

MAIN MIXER SCREEN

Make the mixer the primary home screen.

Top section:

Small Mindful Mixer wordmark

Contextual greeting such as “What do you need right now?”

Four compact mode chips: Sleep, Relax, Focus, and Reset

Selecting a mode may load a suggested starting mix, but the user must still be able to customize every sound

Central mixer console:

Display eight vertical audio channels. On narrow phones, show four channels at a time in a horizontally swipeable area with a clear visual indication that more channels are available. Do not shrink eight sliders until they become difficult to use.

Initial sound channels:

Rain

Birds

Wind

Ocean

Fire

Idle Diesel Engine

Crickets

Deep ‘Om’ Chanting

Each audio channel must include:

A recognizable line icon

The sound name

A vertical volume slider

A visible active state

Individual mute/unmute control

A small animated indicator when the sound is playing

Volume values from 0–100

Smooth volume changes without restarting the audio

Use custom-styled vertical sliders that resemble physical faders. The inactive track should be recessed and neutral. The active portion should glow softly in terracotta or coral. The circular handle should look raised and easy to grab.

MASTER CONTROLS

Below the individual channels, create a prominent master-control area containing:

Large central Play/Pause button

Master volume control

Timer button

Save Mix button

Clear Mix button

Optional Shuffle button that generates a balanced combination

The main Play/Pause button should be the most visually prominent control. It may resemble a large physical dial or illuminated button inspired by the orange control in the reference image.

When playback begins, transition the interface into a subtle active state using gentle illumination and minimal motion. Do not use distracting animations.

TIMER

Create a sleep/session timer with these presets:

15 minutes

30 minutes

45 minutes

1 hour

2 hours

Custom

Show the remaining time on the mixer screen using a small digital-style display inspired by a physical sound machine.

When the timer reaches zero:

Gradually fade out all sounds

Stop playback

Preserve the user’s selected mix

Never stop abruptly unless the user presses Stop or Clear

SAVED MIXES

Allow users to save their current sound combination.

Each saved mix should store:

Mix name

Active sounds

Individual sound volumes

Master volume

Preferred timer, if selected

Date last used

Provide several starter presets:

Deep Sleep

Rainy Cabin

Quiet Train Ride

Morning Woods

Ocean Reset

Campfire Focus

Users should be able to:

Create a mix

Rename it

Load it

Update it

Duplicate it

Delete it

Mark it as a favorite

Create a “My Mixes” screen using simple cards that display the mix name and small icons representing its active sounds.

NAVIGATION

Use a minimal bottom navigation bar with:

Mixer

My Mixes

Settings

Keep the Mixer button centered or visually emphasized.

SETTINGS

Include:

Default session timer

Fade-out duration

Remember last mix toggle

Haptics toggle

Theme preference

Audio behavior information

About Mindful Mixer

CORE AUDIO BEHAVIOR

Implement real simultaneous audio playback. Multiple audio loops must be able to play at once.

Requirements:

Each sound loops seamlessly

Each channel has independent volume

A master-volume control affects the entire mix

Muting one sound does not stop the others

Changing volume does not restart the sound

Play and pause affect the full mix

Audio state remains synchronized with the interface

Prevent duplicate instances of the same audio loop

Handle browser and iOS audio restrictions by starting audio only after deliberate user interaction

Fade sounds smoothly when pausing, clearing the mix, or completing a timer

Avoid clicks, gaps, and abrupt transitions where technically possible

If production-ready audio files are not yet available, create clearly labeled local placeholder assets and a centralized sound configuration file so the audio sources can be replaced later without rewriting components.

TECHNICAL REQUIREMENTS

Mobile-first and optimized for modern iPhones

Responsive on tablets and desktop browsers

Use the existing project’s framework and conventions

Keep components modular and reusable

Use accessible semantic controls

Include visible focus states

Include accessible labels for every slider and button

Maintain sufficient color contrast

Do not make icon-only controls ambiguous

Save user-created mixes and preferences locally for the first version

Structure storage so it can later migrate to Supabase user accounts

Make the web version installable as a Progressive Web App where the current architecture supports it

Do not add authentication, subscriptions, social features, community content, or a complex onboarding process yet

COMPONENT STRUCTURE

Create reusable components such as:

MixerConsole

SoundChannel

VerticalFader

MasterControls

SessionTimer

DigitalTimerDisplay

ModeSelector

SavedMixCard

BottomNavigation

FIRST-RUN EXPERIENCE

On first launch, show one lightweight instructional overlay:

“Move the sliders to build your space.”

Include three short tips:

Raise a slider to add a sound

Combine as many sounds as you like

Save combinations you want to use again

The overlay must be dismissible and should not reappear after dismissal unless reset in Settings.

EMPTY AND ERROR STATES

If every slider is at zero, display: “Your space is quiet. Raise a slider to begin.”

If an audio file fails to load, keep the rest of the mixer functional and show a small non-blocking message identifying the unavailable sound.

Never display a blank screen when audio or local storage fails.

BUILD PRIORITY

Prioritize this working flow first:

User opens the Mixer

User adjusts multiple sound sliders

User presses Play

All chosen sounds play together at their selected volumes

User sets a timer

User saves the mix

User can reload that mix later

Do not spend time creating marketing pages or unnecessary secondary features before this complete flow works.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mindfulmixer.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6e66a6aa-a0ac-4f83-b418-c16c5f8f916f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
