# MASTER PROMPT V3 — PRIX DES ARTS ET DE LA CULTURE

prixdesarts.org — A New Kind of User Experience

# I. PHILOSOPHY — THE ARCHITECTURE OF SENSATION

This site is not used. It is lived. Three principles govern every decision:

1. Light as narrative — Every transition is a metaphor of light. We enter rooms the way we step into a spotlight.
   We navigate the way we move through a city at night.
2. The logo as protagonist — The "A" and "C" of the logo are not graphic elements. They are architectures.
   They structure the visual space of every room.
3. Time as material — Animations are never decorative. They signify. A text that falls line by line does not
   animate — it settles, the way an engraving forms in stone.

# II. SEQUENCE 1 — THE VELVET BLACK (Preloader)

A. Texture of darkness Background #080808. SVG grain texture overlay (feTurbulence baseFrequency="0.65"

- feColorMatrix for a slightly warm tint). Opacity 0.035. Animates very slowly (seed changes every 4s,
  crossfade transition 2s) so the grain breathes — imperceptible but alive.

B. The maxim Cormorant Garamond 300 italic, #f0ece4, clamp(1.8rem, 4vw, 3.2rem), letter-spacing: 0.12em.
Words appear one by one, center screen, fade-in + translateY(+8px → 0), interval 380ms.
recognize — what — will — become — heritage

C. Disappearance & transformation Words fade out in reverse order — except "heritage" which holds its
position. The moment all other words are gone, a "." appears immediately after "heritage" (same typeface,
same color, no space). Pause 1.2s. Then "heritage" dissolves in a very slow fade (1.5s — like an exhalation).
The "." remains alone. During its journey toward the riverbank, it leaves a fleeting luminous trail (motion trail via
2D canvas or CSS blur trail) — as if the first light traced its path through the darkness before settling. Trail
duration: 0.6s, decreasing opacity.

# III. SEQUENCE 2 — PARIS AWAKENS

15 WebP layers, all filtered grayscale(100%) contrast(1.05) brightness(0.82) — black & white is the permanent
signature of the site, never altered. Z-index stack ascending:
layer_sky / layer_skyline / layer_clouds / layer_far_city /
layer_mid_city / layer_eiffel / layer_institut / layer_opera /
layer_bridges / layer_seine / layer_water /
layer_pyramid_bridge / layer_boats / layer_pyramide / layer_foreground

Mouse parallax: Foreground layers: ±12px X / ±6px Y. Sky layers: ±2px X / ±1px Y. Transition linear 0.08s.

Illumination: From the "." position, nocturnal lights ignite in a left-to-right wave — lanterns on riverbanks,
streetlights on bridges, glows on monument façades. Each light = SVG circle with radial-gradient(#fff8e7 →
transparent), scale 0.3 → 1, opacity 0 → 1, duration 0.4s, stagger 100ms. ~20 points. They remain lit
permanently.

The luminous ring on monuments: Once city lights are established, each interactive monument is marked by a
white luminous ring (circle SVG, stroke: #fff8e7, stroke-width: 0.5px, radius 32px) rotating very slowly (rotate
360deg, 12s, linear, infinite). At rest: opacity 0.15, near invisible. On hover: opacity rises to 0.7, ring slightly
accelerates (8s), beam emerges from rooftop. Directly inspired by the reference video — the same gesture,
transposed onto the Paris panorama.

Animated layers:

- layer_seine + layer_water: translateX 0 → -8px → 0, 8s, ease-in-out, infinite
- layer_boats: translateX 0 → -15px, 20s, linear, infinite alternate
- layer_clouds: translateX 0 → -6px, 30s, linear, infinite

Edition plaque — On the Pont des Arts, floating as if engraved:
NOVEMBER 2026
PARIS
Montserrat 300, uppercase, letter-spacing: 0.35em, #f0ece4 opacity 0.6, font-size: 0.62rem. Permanent,
discreet — like a date on marble.

Logo birth: Once illumination is complete (~4s), the white logo version emerges: opacity 0 → 1 over 2s + scale
0.92 → 1 + filter: blur(4px) → blur(0). Emergence from the mist. Centered horizontally, bottom: 7vh, max-width:
220px. The logo is always clickable — it returns to the panorama from anywhere in the site.

# IV. SEQUENCE 3 — ENTERING THE ROOMS

The "iris" effect — directly inspired by the reference video
On monument click, the transition creates a threshold crossing in three movements:
Movement 1 — The ring closes (0.4s) The luminous ring orbiting the monument rapidly scales up (scale 1 →
3), its stroke thickens (0.5px → 2px), its luminosity explodes (#ffffff, SVG feGlow filter). It becomes a
full-screen circle of light.
Movement 2 — The crossing (0.6s) The circle of light acts as a photographic iris: from its center, a clip-path:
circle(0% → 100%) reveals the room content behind it, while the Paris panorama remains visible in the
shrinking ring at the edges. The user literally passes through the light to enter the room. Framer Motion:
clipPath animated with spring(stiffness: 80, damping: 20).
Movement 3 — The room settles (1.2s) The room does not appear all at once. It reveals itself in strata, exactly
as in the reference video:

- First: background image (monument interior, sculpture, architectural detail) — fades from black, opacity 0 →
  0.4(remains dark, in shadow)
- Then: text lines fall one by one top to bottom — title, subtitle, separator, first paragraph — each line
  translateY(-20px) opacity(0) → translateY(0) opacity(1), stagger 120ms, duration 0.6s per line
- Finally: metro navigation slides up from bottom (translateY(30px) → 0)

# V. THE MÉTRO NAVIGATION — PEAK EXPERIENCE

The upgraded concept: the "Plan Lumière" (Light Map)

This is no longer simply a line with circles. It is a living metro map, miniature and elegant, drawing from the
graphic codes of the Paris RATP plan but within the site's aesthetic. It lives permanently in a floating capsule at
the bottom of the screen.
Capsule design Horizontal rounded rectangle (border-radius: 40px), background rgba(8,8,8,0.85) +
backdrop-filter: blur(12px) + border: 1px solid rgba(255,255,255,0.08). Dimensions: 400px × 52px (desktop),
centered. Floats at bottom: 3vh.
Inside the capsule A single fine line (1.5px), color rgba(255,255,255,0.3), crosses the capsule horizontally.
Five stations on this line:
[ Eiffel Tower ] ——— [ Institut ] ——— [ Opéra ] ——— [ Grand Palais ] ——— [ Louvre ]
Each station = 10px circle, border: 1.5px solid rgba(255,255,255,0.4), transparent background at rest. Active
station = solid white circle #ffffff with pulsing halo (box-shadow: 0 0 0 4px rgba(255,255,255,0.15), pulse
animation 2s infinite). On station hover: monument name appears above the capsule in Cormorant Garamond
italic light, font-size: 0.75rem, letter-spacing: 0.15em — soft fade 0.2s.
The animated displacement When changing stations (click on another): a point of light runs along the line
between the two stations, duration 0.6s, cubic-bezier(0.4, 0, 0.2, 1). Like a miniature train connecting stations.
Simultaneously the iris transition fires for the room.
On the Paris panorama The capsule is overlaid on the panorama too, in an even more discreet version
(opacity 0.5). On capsule hover: it rises to opacity 1 and lifts slightly (translateY -4px, transition 0.3s).
The narrative upgrade: the line name Above the line inside the capsule, in Montserrat 300 uppercase
letter-spacing: 0.3em font-size: 0.55rem opacity: 0.35: "LIGNE DES ARTS". As if it were a real Paris metro
line. A cultivated, discreet nod.

# VI. THE ROOMS — DESIGN

Each room is a distinct work, belonging to the same collection.
The common thread: a background architectural motif (vault, colonnade, moulding) at opacity 0.03, black &
white, specific to each building. And typography — Cormorant Garamond throughout, like the same hand that
engraved every pediment.
Each room has its own light accent color, used solely for beams and micro-accents:
Room Light tint
Pyramid / Consecration Pure white #ffffff
Institut / Institution Pale gold #d4b
Opéra / Stage Rose ivory #e8d5c
Grand Palais / Imprint Amber #c9a35a
Eiffel / Light Steel blue #b8c8d
n ROOM 1 — THE PYRAMID / THE CONSECRATION
Background: Detail of the Louvre Pyramid — glass triangles in darkness, filtered light. B&W;, brightness(0.35).
The "A" from the logo as watermark at center, opacity 0.03.
Iris entry: Opens from the pyramid's apex.
Design: Horizontal triptych (three laureate profiles: emerging / established / institutions). Each panel scrolls
horizontally. Each laureate: full-frame B&W; portrait left, text right. Laureate name in very large Cormorant

Garamond 300, clamp(3rem, 6vw, 5rem) — like a painting title.

nn ROOM 2 — THE INSTITUT / THE INSTITUTION
Background: Institut de France dome seen from inside. Golden ribs in darkness. B&W;, brightness(0.3). The
"C" from the logo as watermark, opacity 0.025.
Iris entry: Opens from the dome's center.
Design: A vertical timeline — the history of the Prix from 2021 to today. Each edition: its year in large type
(clamp(4rem, 8vw, 7rem), Cormorant Garamond, opacity 0.15 for past years, 1 for current), its key moment, its
jury. Scroll advances through time.

n ROOM 3 — THE OPÉRA / THE STAGE
Background: Opéra Garnier auditorium — red balconies, chandelier, Chagall ceiling. B&W;, brightness(0.25).
Iris entry: Opens from the central chandelier — the circle of light expands from above.
Design: The 5 previous editions (2021–2025) presented as opera boxes — 5 slightly tilted vertical rectangles
(subtle CSS 3D perspective, rotateY(2deg) alternating), each with the year large at top and a video thumbnail.
On hover: the box "straightens" (rotateY(0deg), scale(1.02)), brightens slightly. On click: video opens
full-screen with black fade, clean interface (thin progress bar, discreet close button in corner).

nn ROOM 4 — THE GRAND PALAIS / THE IMPRINT
Background: Grand Palais glass nave — iron and glass in darkness. B&W;, brightness(0.28).
Iris entry: Opens from the center of the glass roof — the circle grows as if looking up at the dome.
Design: The most "gallery-like" room — full-width alternation of B&W; images and editorial text blocks. Each
text block centered on max-width: 55ch. Between blocks: a very fine amber separator (1px, width: 30px,
#c9a35a, centered) — the only warm color accent. Laureate quotes in italic, slightly right-offset, like marginal
annotations.

n ROOM 5 — THE EIFFEL TOWER / THE LIGHT
Background: Eiffel Tower iron structure, low-angle detail of the beams. B&W;, brightness(0.3).
Iris entry: Opens from the tower's summit — the circle descends from above.
Design: The jury presented as a constellation — members positioned on the page like stars, connected by fine
lines (0.5px, rgba(255,255,255,0.08)). The Jury President at center, slightly enlarged. On member hover:
B&W; portrait fades in, name and title reveal. On mobile: graceful degradation to a vertical list.

# VII. RETURNING TO PARIS — THE REVERSE EFFECT

When the user clicks the logo (top left in rooms) or "← Paris":
The iris closes in reverse: clip-path: circle(100% → 0%) from center — the room's content disappears into a
point of light, exactly like a camera lens closing. Then the Paris panorama reveals itself in a gentle dezoom
from that point.
The city is always alive: the boats have moved, the clouds have drifted, the lights pulse softly. Paris did not
wait — it kept breathing.

# VIII. V3 MICRO-INTERACTIONS

Custom cursor Replace the system cursor with a custom cursor: small white circle (12px, border: 1px solid
rgba(255,255,255,0.6), transparent background) following the mouse with a slight lag (lerp at 0.12 of real
position — it "trails" slightly, like a camera following a subject). On clickable element hover: circle grows (24px)
and partially fills (background: rgba(255,255,255,0.1)). On monuments: the circle takes the form of the
luminous ring (slightly thicker stroke, #fff8e7 glow).
In-room scroll No visible scrollbar. Scroll is intercepted and smoothed (Lenis or equivalent) for a velvet-gliding
sensation. Speed: 0.8 (slightly slower than native scroll — every pixel counts).
Text transitions In rooms, when moving between sections, text does not simply fade — it engraves: letters
reveal left to right via clip-path: inset(0 100% 0 0 → 0 0% 0 0), duration 0.8s, cubic-bezier(0.77, 0, 0.18, 1). As
if someone were engraving the text in real time.
Spatial audio The AudioManager plays Paris ambience (Seine, nocturnal murmurs, distant city sounds). But in
each room, the tonal quality shifts subtly: the Opéra adds a very soft string undertone, the Institut a deeper
silence, the Eiffel Tower a faint wind. All crossfade imperceptibly (2s) during transitions.

# IX. TECHNICAL CONSTRAINTS — LOVABLE V

Framework : React (Lovable)
Animations : Framer Motion — clipPath iris, spring, stagger
Scroll smoothing: Lenis (npm) or custom useSmoothedScroll hook
Custom cursor : useCustomCursor hook with lerp
Animated grain : SVG feTurbulence or 2D canvas overlay
Parallax : useMouseParallax hook (15 layers)
Audio : Howler.js — ambience + per-room crossfade
Video : Optimized embed (Vimeo unlisted recommended)
Lazy load, B&W; poster image, autoplay on viewport enter
Language : navigator.language → /locales/fr.json | en.json
Preload : 15 WebP layers + SVG logo on startup
Rooms lazy loaded (React.lazy + Suspense)
Performance : will-change: transform on all animated layers
GPU acceleration via translateZ(0)
Reduced motion : prefers-reduced-motion → simple fades throughout
Parallax, custom cursor, animated grain all disabled
SEO : Full meta tags, og:image = panorama capture
Per-room titles for direct sharing, dynamic lang attr
Mobile : Touch events for iris and metro navigation
Parallax via deviceorientation (amplitude ÷2)
Metro capsule reduced (300px, stations without text labels)

# X. RECOMMENDED BUILD PHASES FOR LOVABLE

Phase 1 — The core (2 weeks) Complete preloader (velvet black → maxim → point → light) + 15-layer
panorama + parallax + illumination + static metro capsule
Phase 2 — The entrance (2 weeks) Complete iris effect (ring → clip-path opening → room settlement) +
structure of 5 rooms with placeholder content
Phase 3 — The refinement (2 weeks) Custom cursor + animated grain + smooth scroll + audio + text
micro-animations + mobile
Phase 4 — The content (1 week) Integration of real editorial content, videos, portraits, final texts
Phase 5 — Performance & QA (1 week) WebP optimization, lazy load, cross-browser testing, accessibility,
SEO

This document constitutes the specification for development on Lovable. Required assets: 15 WebP layers,
SVG logo (2 versions), Paris ambience audio file, edition videos 2021–2025, B&W; interior photographs for
room backgrounds.
