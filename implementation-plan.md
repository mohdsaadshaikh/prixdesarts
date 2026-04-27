# Prix des Arts — Full Vibe Coding Plan
### Paste each prompt block into your AI coder (Lovable / Cursor / Copilot) in order.

---

## STEP 0 — PROJECT SCAFFOLD

**Prompt:**
```
Create a Vite + React project called prixdesarts with the following stack:
- framer-motion (animations)
- @studio-freight/lenis (smooth scroll)
- howler (spatial audio)
- react-router-dom (routing)

Folder structure:
src/
  components/
    GrainCanvas.jsx
    IrisTransition.jsx
    MetroCapsule.jsx
    MonumentRing.jsx
    CustomCursor.jsx
  screens/
    VelvetBlack.jsx
    ParisPanorama.jsx
    RoomPyramid.jsx
    RoomInstitut.jsx
    RoomOpera.jsx
    RoomGrandPalais.jsx
    RoomEiffel.jsx
  hooks/
    useMouseParallax.js
    useAudio.js
    useLenis.js
  assets/
    layers/   (empty - user will add images)
    rooms/    (empty - user will add images)
    audio/    (empty - user will add audio)
  App.jsx
  main.jsx
  index.css

App.jsx should have a global state: currentScreen (velvet | paris | room)
and currentRoom (pyramid | institut | opera | grandpalais | eiffel)
Use Framer AnimatePresence at the root level for screen transitions.
Global CSS: background #080808, font-family Cormorant Garamond + Montserrat from Google Fonts,
overflow hidden, no scrollbar.
```

---

## STEP 1 — GRAIN CANVAS (GrainCanvas.jsx)

**Prompt:**
```
Build GrainCanvas.jsx — a full-screen canvas overlay component.

Behavior:
- Position: fixed, inset 0, z-index 1, pointer-events none
- Every 100ms redraw random pixel noise across the canvas
- Opacity: 0.032
- Canvas size matches window (resize listener)
- Use requestAnimationFrame for the loop, setInterval(drawGrain, 100) for refresh rate

This component is always mounted on top of everything.
```

---

## STEP 2 — VELVET BLACK SCREEN (VelvetBlack.jsx)

**Prompt:**
```
Build VelvetBlack.jsx — the cinematic opening screen.

Background: #080808

Part A — Word reveal:
Render these 5 words: ["reconnaître", "ce", "qui", "fera", "héritage"]
Font: Cormorant Garamond 300 italic, color #f0ece4, font-size clamp(1.8rem,4vw,3.2rem)
letter-spacing 0.12em, centered on screen.
Use Framer Motion staggerChildren 0.38s, each word animates:
  opacity 0→1, y +8px→0, duration 0.6s ease

Part B — After 2s pause:
Words disappear in reverse order except "héritage"
"héritage" stays visible.
A "." appears right after it (same font, no space, same color).
Pause 1.2s.
"héritage" fades out slowly (1.5s). "." stays alone.

Part C — The dot journey:
The "." pulses: scale 1→1.4→1 over 0.8s
Then animates with cubic-bezier(0.76,0,0.24,1) over 2s:
  moves toward bottom-left (toward x: -180px, y: +80px)
  opacity fades to 0 at end of travel

On the canvas behind, as the dot travels, draw a luminous trail:
  12 trail frames, rgba(255,248,231, decreasing opacity) along the path

Part D — After dot animation completes:
Call prop onComplete() — this triggers the Paris screen to mount.
```

---

## STEP 3 — MOUSE PARALLAX HOOK (useMouseParallax.js)

**Prompt:**
```
Build useMouseParallax.js hook.

- Track mouse position relative to window center
- Return { x, y } as Framer Motion useMotionValue
- Apply lerp factor 0.08 (smooth lag)
- On mobile: use DeviceOrientationEvent instead of mouse
  amplitude divided by 2 compared to desktop

Export: useMouseParallax() → { mouseX, mouseY }
```

---

## STEP 4 — PARIS PANORAMA SCREEN (ParisPanorama.jsx)

**Prompt:**
```
Build ParisPanorama.jsx — the living Paris city screen.

Part A — 15 parallax layers:
Import images from assets/layers/ with these names:
layer_sky, layer_skyline, layer_clouds, layer_far_city,
layer_mid_city, layer_eiffel, layer_institut, layer_opera,
layer_bridges, layer_seine, layer_water,
layer_pyramid_bridge, layer_boats, layer_pyramide, layer_foreground

Each layer: position absolute, width 100%, height 100%, object-fit cover
CSS filter on all layers: grayscale(100%) contrast(1.05) brightness(0.82)

Parallax multipliers per layer (X / Y):
  foreground: 12px / 6px
  boats: 10px / 5px
  pyramide: 8px / 4px
  bridges: 6px / 3px
  seine/water: 4px / 2px
  mid layers: 3px / 1.5px
  far layers: 2px / 1px
  sky: 1px / 0.5px

Use useMouseParallax hook. Apply transform via Framer Motion style prop.

Part B — Animated layers:
- seine + water: translateX oscillates 0→-8px→0, 8s ease-in-out infinite
- boats: translateX 0→-15px, 20s linear alternate
- clouds: translateX 0→-6px, 30s linear infinite

Part C — SVG light points (illumination wave):
22 SVG circles positioned along the Seine (use hardcoded x/y positions spread
across 20%→80% of screen width, bottom 30%→40% of screen height)
Each circle: radial gradient #fff8e7→transparent, r=6
Animate on mount: staggered scale 0.3→1, opacity 0→1, stagger 100ms, duration 400ms
Stay visible permanently.

Part D — Monument rings (MonumentRing component used here):
Place rings on: Eiffel Tower (left ~23%), Institut (right ~28%)
Each ring permanently rotates 360° / 12s / linear
On hover: opacity increases, rotation speeds up to 8s,
a small vertical light beam appears above the monument from SVG line.

Part E — Edition plaque:
Fixed text on Pont des Arts area (bottom 29%, centered):
"NOVEMBRE 2026 / PARIS"
Montserrat 300, uppercase, letter-spacing 0.35em, font-size 0.6rem, #f0ece4 opacity 0.55

Part F — Logo emergence:
Centered, bottom 7vh.
Step 1: "A" appears alone (opacity 0→0.15, scale 1.2→1, 1s)
Step 2: Full text "RTS ET DE LA CULTURE" emerges (blur 8px→0, opacity 0→1, 1.5s)
Below: "prixdesarts.org" in Montserrat 300, 0.42rem, letter-spacing 0.4em, opacity 0.45

Part G — Metro capsule (MetroCapsule component):
Position: bottom 3vh, centered
Show 5 stations: Eiffel · Institut · Opéra · Grand Palais · Louvre
Active station = Paris (none selected yet, all dots empty)
Clicking a station calls prop onEnterRoom(roomName) → triggers iris transition
```

---

## STEP 5 — MONUMENT RING (MonumentRing.jsx)

**Prompt:**
```
Build MonumentRing.jsx — an SVG ring around a monument hotspot.

Props: x (% left), y (% bottom), roomName, onEnter

Renders:
- An SVG circle ring: stroke #fff8e7, stroke-width 0.5px, r 32px, opacity 0.15
- Rotates 360° every 12s linear infinite (Framer Motion animate rotate)
- On hover: opacity → 0.7, rotation duration → 8s
  A vertical SVG line appears above (light beam, opacity 0→0.6, height 0→40px)
- On click: calls onEnter(roomName)
- Position: absolute, transform translate(-50%, -50%)
```

---

## STEP 6 — IRIS TRANSITION (IrisTransition.jsx)

**Prompt:**
```
Build IrisTransition.jsx — the camera iris opening/closing effect.

This is a full-screen overlay component with 3 phases:

Phase 1 — Ring expands (0.4s):
  An SVG circle ring at screen center
  scale 1→3.5, stroke-width 0.5→3px, color brightens to #ffffff with glow
  fills the entire screen

Phase 2 — Iris opens (0.6s):
  clip-path: circle(0% at center) → circle(100% at center)
  Framer Motion spring: stiffness 80, damping 20
  Behind the clip: the room photo starts loading
  Paris remains visible as a ring at the edges for 0.3s

Phase 3 — Room settles (1.4s, 3 sub-steps):
  1. Room photo fades in: opacity 0→0.42, brightness 0.25→0.35
  2. Room text drops in: translateY -22px→0, opacity 0→1, stagger 120ms per line
  3. Metro capsule rises: translateY 40px→0, duration 0.5s

Props: isOpen (bool), targetRoom, onComplete
When isOpen flips false: reverse (iris closes back to Paris) — clip-path circle(100%→0%)
```

---

## STEP 7 — METRO CAPSULE (MetroCapsule.jsx)

**Prompt:**
```
Build MetroCapsule.jsx — the persistent floating navigation.

Visual:
- Rounded rectangle, radius 40px
- Background rgba(8,8,8,0.88), backdrop-filter blur(14px)
- Subtle white border rgba(255,255,255,0.07)
- Label above stations: "ART LINE" Montserrat 300, uppercase, letter-spacing 0.35em

5 stations in a row with a connecting track line:
  Eiffel · Institut · Opéra · Grand Palais · Louvre

Each station dot:
  Inactive: 8px circle, border 1px rgba(255,255,255,0.3)
  Active: filled white, box-shadow glow, pulsing halo animation

Light train:
  A small white dot travels between stations when changing rooms
  Animation: 0.6s, cubic-bezier(0.4,0,0.2,1)

Props:
  activeRoom (string | null)
  onNavigate (roomName) => void

On mobile (< 768px): hide station labels, shrink to 300px width.
```

---

## STEP 8 — ROOM BASE COMPONENT (RoomBase.jsx)

**Prompt:**
```
Build RoomBase.jsx — the shared wrapper for all 5 rooms.

Props: roomKey, photoSrc, children, accentColor

Renders:
- Full screen div, background #0a0808
- Bottom layer: room photo (B&W CSS filter: grayscale(100%) contrast(1.05) brightness(0.35))
  On hover: scale 1.04, translateX/Y ±8px (subtle)
- Middle layer: SVG halo group (slot for room-specific halos) with mix-blend-mode: screen
- Top layer: children (room-specific content)
- Watermark: large "A" or "C" in Cormorant Garamond, opacity 0.025, positioned bottom-left
- Metro capsule always mounted at bottom center
- Back button: clicking logo → triggers reverse iris back to Paris

Framer Motion entrance:
  photo: opacity 0→0.42 (1s)
  children: stagger 120ms per direct child, translateY -22px→0
  MetroCapsule: translateY 40px→0 (0.5s delay)
```

---

## STEP 9 — 5 ROOM SCREENS

### Room 1 — Pyramid / Louvre (RoomPyramid.jsx)

**Prompt:**
```
Build RoomPyramid.jsx using RoomBase with photo: rooms/louvre.jpg

SVG halos: 3 white radial gradient halos positioned at top-center (verrière light)
  Each: mix-blend-mode screen, animate scale+opacity gently

Layout: horizontal triptych (3 equal columns, flex row)
Each panel:
  - Fades in with stagger
  - Has: category label (Montserrat 300 uppercase 0.42rem), laureate name
    (Cormorant Garamond 300, large), artwork title (italic, smaller)
  - Hover: panel expands (flex grows), border-top reveals in accent color
  - Content:
    Panel 1: Émergents / Marie Fontaine / "Éclats de mémoire, 2025"
    Panel 2: Confirmés / Thomas Marchand / "Symphonie Urbaine, 2025"
    Panel 3: Institutions / Fondation Lumière / "50 ans de collection"

Accent color: pure white (#ffffff)
```

### Room 2 — Institut de France (RoomInstitut.jsx)

**Prompt:**
```
Build RoomInstitut.jsx using RoomBase with photo: rooms/institut.jpg

SVG halos: gold radial halos #d4b483, positioned at dome center top
  Animated breathing: scale 1→1.15, opacity 0.6→0.9, 4s ease-in-out infinite

Layout: left side = text content, right side = vertical timeline

Timeline (right, 40% width):
  5 editions listed vertically: 2021, 2022, 2023, 2024, 2026
  Current (2026): font-size 4.5rem, color #d4b483, full opacity
  Past editions: progressively smaller (3rem, 2.5rem, 2.2rem, 2rem), faded
  A vertical line connects them with a dot on each
  Current dot: gold glow box-shadow

Text content (left):
  Surtitre: "Salle II · L'Institution"
  Title: "Institut de France" in Cormorant Garamond, color #d4b483
  Separator: 28px line in gold
  Body: italic Cormorant, "L'histoire du Prix, édition après édition..."

Lenis scroll: allow vertical scroll inside this room only (timeline scrolls)
```

### Room 3 — Opéra Garnier (RoomOpera.jsx)

**Prompt:**
```
Build RoomOpera.jsx using RoomBase with photo: rooms/opera.jpg

SVG halos: warm ivory halos #e8d5c4 at chandelier positions
  6 halos at: top-center (large), two sides (medium), two lower-sides (small), center-low
  All mix-blend-mode screen, breathing animation staggered

Layout: left 55% = text, right = 3D opera boxes

Opera boxes (right side, stacked vertically, 5 boxes):
  Each box: width 120px, height 70px
  CSS: transform perspective(400px) rotateY(-2deg) (alternate even boxes +2deg)
  Background rgba(12,8,5,0.8), border rgba(232,213,196,0.12)
  Content: edition year (large Cormorant) + "Édition" label
  On hover: border brightens, rotateY increases, scale 1.02
  On click: opens Vimeo player overlay (use prop videoId per edition)

Editions: 2021, 2022, 2023, 2024, 2025

Text content:
  Surtitre: "Salle III · La Scène"
  Title: "Opéra Garnier"
  Separator
  Body italic: "Cinq éditions. Cinq moments où l'art a basculé dans l'éternité."

Accent: ivory #e8d5c4
```

### Room 4 — Grand Palais (RoomGrandPalais.jsx)

**Prompt:**
```
Build RoomGrandPalais.jsx using RoomBase with photo: rooms/grandpalais.jpg

SVG halos: amber #c9a35a halos at verrière arch positions (3 halos, top area)

Layout: 50/50 split — left = editorial text block, right = portrait image placeholder

Left text block:
  Surtitre: "Salle IV · L'Empreinte"
  Title: "Grand Palais" in #c9a35a (amber)
  Amber separator line
  Body text: Montserrat 300, 0.9rem, color rgba(201,163,90,0.55)
    "Depuis 2021, le Prix des Arts et de la Culture réunit..."
  Marginal quote block:
    Left border 1px #c9a35a opacity 0.3, padding-left 20px
    Italic Cormorant, "L'art n'est pas ce que vous voyez..."
    Color rgba(201,163,90,0.55)

Right image block:
  Placeholder rect with border rgba(201,163,90,0.08)
  Label "Portrait lauréat" inside, will be replaced with real photo

Accent: amber #c9a35a
```

### Room 5 — Eiffel Tower (RoomEiffel.jsx)

**Prompt:**
```
Build RoomEiffel.jsx using RoomBase with photo: rooms/eiffel.jpg

SVG halos: steel blue #b8c8d4 halos at structural nodes of the tower
  6 halos at grid intersection positions, pulsing with stagger

Layout: constellation of jury members spread across screen

7 jury member nodes (position absolute, spread across screen):
  Each node: 10px white-blue dot + name (Cormorant 0.75rem) + title (0.38rem uppercase)
  President node: 16px dot, position center ~50%/45%

Positions:
  Claire Dumont (Présidente): 50%, 45%
  Jean Moreau (Académicien): 25%, 28%
  Sophie Klein (Critique d'art): 72%, 28%
  Paul Bernard (Commissaire): 18%, 60%
  Hélène Voss (Directrice): 80%, 58%
  Marc Girard (Musicologue): 40%, 72%
  Isabelle Roy (Chorégraphe): 62%, 70%

SVG lines connecting all members to the president:
  stroke rgba(184,200,212,0.08), stroke-width 0.5px
  On hover of any member: their connecting line brightens to 0.3 opacity

Hover each node: dot glows (box-shadow), name scales slightly

Accent: steel blue #b8c8d4
```

---

## STEP 10 — AUDIO HOOK (useAudio.js)

**Prompt:**
```
Build useAudio.js using Howler.js.

Map of audio files per screen:
  paris: 'assets/audio/paris-ambience.mp3'
  pyramid: 'assets/audio/room-pyramid.mp3'
  institut: 'assets/audio/room-institut.mp3'
  opera: 'assets/audio/room-opera.mp3'
  grandpalais: 'assets/audio/room-grandpalais.mp3'
  eiffel: 'assets/audio/room-eiffel.mp3'

Behavior:
- On screen change: crossfade out current audio (2s), fade in next (2s)
- Volume: 0.35 max
- Loop: true
- Spatial: use Howler's stereo pan slightly based on screen position
- Export: useAudio(currentScreen) — handles everything internally
- Do not autoplay until user has interacted with the page (click/touch)
- Add a mute toggle button (fixed, bottom-right corner, small)
```

---

## STEP 11 — CUSTOM CURSOR (CustomCursor.jsx)

**Prompt:**
```
Build CustomCursor.jsx — hide default cursor, show custom one.

Two elements:
  1. Small dot (8px, white, border-radius 50%)
  2. Larger ring (28px, border 0.5px rgba(255,255,255,0.4), border-radius 50%)

Behavior:
  - Dot follows mouse exactly (no lag)
  - Ring follows with lerp factor 0.12 via requestAnimationFrame
  - On hover of clickable elements (a, button, [data-cursor="hover"]):
    ring expands to 48px, opacity increases
  - On hover of monument rings: ring matches the SVG ring size (64px)
  - Position: fixed, z-index 9999, pointer-events none
  - Hide on mobile (pointer: coarse)
  - Add data-cursor="hover" to all interactive elements in other components
```

---

## STEP 12 — ENGRAVING TEXT ANIMATION

**Prompt:**
```
Create a reusable EngravingText.jsx component.

Props: text (string), delay (number, default 0)

Animation:
  clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)
  Duration: 1.2s
  Easing: cubic-bezier(0.77, 0, 0.18, 1)
  Uses Framer Motion

Use this component for:
  - All room titles
  - The edition plaque text in Paris
  - The maxim words in VelvetBlack (as alternative to stagger)

Apply it to existing room titles in all 5 room components.
```

---

## STEP 13 — WIRING EVERYTHING (App.jsx)

**Prompt:**
```
Rewrite App.jsx to wire all components together.

State:
  currentScreen: 'velvet' | 'paris' | 'room'
  currentRoom: 'pyramid' | 'institut' | 'opera' | 'grandpalais' | 'eiffel' | null
  irisOpen: boolean
  irisDirection: 'enter' | 'exit'

Flow:
  1. Mount: show VelvetBlack
  2. VelvetBlack.onComplete → set currentScreen = 'paris'
  3. Paris MonumentRing.onClick(room) → set irisOpen=true, irisDirection='enter', pendingRoom=room
  4. MetroCapsule.onNavigate(room) → same as above
  5. IrisTransition.onComplete (entering) → set currentScreen='room', currentRoom=pendingRoom, irisOpen=false
  6. Room back button / logo click → irisOpen=true, irisDirection='exit'
  7. IrisTransition.onComplete (exiting) → set currentScreen='paris', currentRoom=null

Always mounted:
  - GrainCanvas (z-index 1)
  - CustomCursor (z-index 9999)
  - IrisTransition (z-index 50, only visible when irisOpen=true)
  - Audio hook running

Use Framer AnimatePresence for screen-level transitions.
Pass useAudio(currentRoom || currentScreen) at App level.
```

---

## STEP 14 — MOBILE RESPONSIVENESS

**Prompt:**
```
Add mobile responsiveness across all components.

Breakpoint: 768px

Changes at mobile:
  - MetroCapsule: width 300px, hide station name labels, show dots only
  - Paris parallax: use DeviceOrientationEvent (already in hook), amplitude ÷2
  - Iris: use touch events instead of click for monument entry
  - Room triptych (Pyramid): stack vertically instead of horizontal
  - Room opera boxes: stack horizontally, smaller
  - Room eiffel constellation: reduce spread, nodes closer together
  - Custom cursor: hidden (pointer-events: coarse)
  - Font sizes: reduce clamp minimums by ~15%
  - VelvetBlack words: reduce stagger to 280ms on mobile
```

---

## STEP 15 — PERFORMANCE + FINAL POLISH

**Prompt:**
```
Optimize the project for performance and polish.

1. GPU optimization:
   Add will-change: transform to all parallax layers
   Add transform: translateZ(0) to force GPU compositing on animated elements

2. Image loading:
   Paris layers: load lazily using IntersectionObserver
   Room photos: preload next room when hovering a monument ring
   Vimeo embeds: lazy load with placeholder until click

3. Reduced motion:
   Wrap all animations in:
   @media (prefers-reduced-motion: reduce) { animation: none; transition: none; }
   In Framer: use useReducedMotion() hook

4. SEO / meta:
   Add to index.html:
   - title: "Prix des Arts et de la Culture — Paris 2026"
   - description meta tag
   - og:image meta (use a static Paris panorama screenshot)

5. Final CSS:
   - Remove all scrollbars globally
   - Ensure #080808 background is never exposed (no flash)
   - Add font preloading for Cormorant Garamond + Montserrat in <head>

6. Deploy:
   Run: npm run build
   Deploy dist/ folder to Netlify or Vercel
   Set custom domain: prixdesarts.org
   Enable HTTPS auto (both platforms do this automatically)
```

---

## ASSET CHECKLIST (have these ready before starting)

| Asset | File name | Format |
|---|---|---|
| Paris layer 1 | layer_sky.webp | WebP |
| Paris layer 2 | layer_skyline.webp | WebP |
| Paris layer 3 | layer_clouds.webp | WebP |
| Paris layer 4 | layer_far_city.webp | WebP |
| Paris layer 5 | layer_mid_city.webp | WebP |
| Paris layer 6 | layer_eiffel.webp | WebP |
| Paris layer 7 | layer_institut.webp | WebP |
| Paris layer 8 | layer_opera.webp | WebP |
| Paris layer 9 | layer_bridges.webp | WebP |
| Paris layer 10 | layer_seine.webp | WebP |
| Paris layer 11 | layer_water.webp | WebP |
| Paris layer 12 | layer_pyramid_bridge.webp | WebP |
| Paris layer 13 | layer_boats.webp | WebP |
| Paris layer 14 | layer_pyramide.webp | WebP |
| Paris layer 15 | layer_foreground.webp | WebP |
| Louvre photo | rooms/louvre.jpg | JPG |
| Institut photo | rooms/institut.jpg | JPG |
| Opéra photo | rooms/opera.jpg | JPG |
| Grand Palais photo | rooms/grandpalais.jpg | JPG |
| Eiffel interior photo | rooms/eiffel.jpg | JPG |
| Logo light | logo-light.svg | SVG |
| Logo dark | logo-dark.svg | SVG |
| Paris ambience audio | audio/paris-ambience.mp3 | MP3 |
| Room audios (×5) | audio/room-[name].mp3 | MP3 |

---

## ORDER TO RUN PROMPTS

```
0 → Scaffold
1 → GrainCanvas
2 → VelvetBlack
3 → useMouseParallax
4 → ParisPanorama
5 → MonumentRing
6 → IrisTransition
7 → MetroCapsule
8 → RoomBase
9 → All 5 rooms (one prompt at a time)
10 → useAudio
11 → CustomCursor
12 → EngravingText (then apply to rooms)
13 → Wire App.jsx
14 → Mobile
15 → Polish + deploy
```

> **Tip:** After each step, ask your AI coder: *"Does this component work standalone? Show me what it looks like in isolation."* Fix issues per component before wiring them together. Only run Step 13 when all individual pieces work.
