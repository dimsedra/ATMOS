# ATMOS Design Canon & Agent Directives

> **Project:** ATMOS — Independent Music & Culture House (Seoul)  
> **Core Creed:** *"Atmosphere, Not Spectacle."*  
> **Target Aesthetic:** High-End Editorial Print meets Architectural Minimalism  

This document serves as the permanent design memory, art direction philosophy, and engineering directive for ATMOS. Any AI agent, designer, or engineer contributing to this codebase must study and strictly adhere to these principles.

---

## 1. The Core Creed: Atmosphere, Not Spectacle

Most AI-generated front-ends fall into the trap of **"AI Slop"**:
- Purple/blue saturated neon glows on generic dark backgrounds.
- Bloated cards with heavy drop shadows (`shadow-2xl`) and round pill containers (`rounded-2xl`).
- Symmetrical, uninspired 3-column card layouts with generic Lucide icon badges.
- Excessive, dizzying hover animations with bouncy springs.

**ATMOS rejects all of this.**  
ATMOS is built like a physical, museum-grade monograph or an independent Seoul fashion/music publication:
- **Restraint Over Noise:** White space is active structural material, not empty gap.
- **Physical Print Warmth:** Everything feels printed on tactile, heavy-stock paper rather than glowing on a generic OLED screen.
- **Architectural Crispness:** Sharp rectangular planes, hairline ink rules, and deliberate asymmetry create tension and prestige.

---

## 2. Color System: Organic Tonal Architecture

ATMOS does not use generic digital white (`#FFFFFF`) or pure pitch black (`#000000`). Its palette is grounded in warm, organic, and earth-derived tones:

| Token | Hex Value | Semantic Role & Psychology |
| :--- | :--- | :--- |
| `--color-paper` | `#f2f1e9` | Primary canvas. A warm, tactile, unbleached newsprint/linen off-white. It eliminates eye strain and establishes immediate editorial credibility. |
| `--color-ink` | `#20221e` | Primary text and solid CTA buttons. Deep charcoal with an olive/earth undertone. It behaves like heavy printer's ink rather than harsh digital pixels. |
| `--color-citron` | `#e4ecaa` | Accent & energy highlight. An electric, pale acid-citron lime. Used sparingly for interactive hovers, text selection (`::selection`), active release state, and full-bleed culture callouts. |
| `--line` | `#20221e30` / `#20221e0d` | Hairline editorial dividers. Ultra-subtle ink rules (10% to 20% opacity) that partition content like grid lines in an architectural drawing. |
| `--color-muted` | `#6b6f62` / `#8b8f97` | Secondary copy, photographer credits, and quiet studio metadata. |

### Atmospheric Room Shifts (Sectional Palette Shifting)
Instead of a uniform background from top to bottom, ATMOS creates emotional rhythm by shifting room palettes:
1. **Hero Room (`#5f6b6a` + photographic depth):** Atmospheric dawn fog with gradient scrim.
2. **Collection Room (`var(--color-paper)`):** Crisp daylight gallery floor.
3. **Artists Showcase (`#e7e8df`):** A slightly cooler concrete/linen plaster gallery wall.
4. **Releases Room (`#1d201b`):** A dark, subterranean listening room where typography reverses to paper on ink and citron glows.
5. **House Manifesto (`var(--color-citron)`):** A sudden, vibrant blast of electric energy that re-energizes the reader before the footer.

---

## 3. Typographic Triad & Extreme Scale Tension

The visual power of ATMOS comes from the calculated tension among three distinct font families, paired with deliberate extreme scale contrast:

```mermaid
flowchart LR
    A["Inter Tight\n(Display Narrow)"] ---|Headline Tension| B["DM Sans\n(Humanist Body)"]
    B ---|Structural Counterweight| C["IBM Plex Mono\n(Studio Metadata)"]
    C ---|Art Direction Accent| D["Serif Italic\n(Georgia / Rare Releases)"]
```

### 1. Inter Tight (Display / Headline)
- **Role:** Commanding, poster-scale titles.
- **Characteristics:** Tight vertical proportion, narrow set width, heavy tracking compaction (`letter-spacing: -0.035em` to `-0.055em`), and ultra-tight line height (`line-height: 0.81` to `1.05`).
- **Usage:** Never use for paragraphs. Reserved for hero statements, artist names, and section headlines.

### 2. DM Sans (Humanist Body & Actions)
- **Role:** Editorial storytelling, product descriptions, dialog bodies, buttons.
- **Characteristics:** Generous, warm, open counters, high legibility, unhurried line-height (`1.7` to `1.9`).

### 3. IBM Plex Mono (Technical Studio Metadata)
- **Role:** City ticker, track timecodes, collection codes (`COLLECTION 001 / EVERYDAY OBJECTS`), garment dimensions, release dates.
- **Characteristics:** Monospaced precision, small font sizes (7px to 10px), wide tracking (`letter-spacing: 0.07em` to `0.12em`), uppercase (`text-transform: uppercase`).

### 4. Extreme Scale Contrast (Macro meets Micro)
ATMOS creates drama by placing monumental typography right next to delicate, miniature metadata:
- Huge 90px+ headlines directly paired with 8px uppercase monospaced labels (`.eyebrow`, `.micro`).
- No mid-tier mush: either typography is commanding and monumental, or it is tiny, precise, and understated.

---

## 4. Layout & Grid Composition: Asymmetrical Tension

Symmetrical layouts feel static and algorithmic. ATMOS uses intentional **asymmetry** to guide the eye and grant visual weight to lead elements:

- **Apparel Grid:** `grid-template-columns: 1.15fr 1fr 1fr;`  
  The first campaign look is intentionally wider than the secondary product objects.
- **Artist Roster:** `grid-template-columns: 2.15fr 1fr 1fr;`  
  The flagship group (SORA) commands more than double the horizontal real estate of solo artists.
- **Footer Navigation:** `grid-template-columns: 2fr 1fr 1fr 1.1fr;`  
  The brand purpose statement holds deep breathing space before the column links unfold.
- **Fluid Proportions:** All margins, paddings, and font sizes use mathematical fluid clamps rather than rigid media query jumps:
  ```css
  --page-gutter: clamp(24px, 3.45vw, 72px);
  font-size: clamp(39px, 3.75vw, 64px);
  ```

---

## 5. Architectural Restraint & Shape Language

- **Zero Container Border Radius:**
  ```css
  button, input, select, textarea { border-radius: 0; }
  ```
  Containers, image frames, and input fields never have soft rounded corners. They meet the page at sharp 90-degree right angles, evoking architectural blueprints and printed editorial spreads.
- **The Circular Micro-Anchor Counterweight:**
  To counterbalance the razor-sharp rectangles, micro-action touchpoints are rendered as pristine 50% circular pills:
  - Quick-add trigger (`37px x 37px`, `border-radius: 50%`)
  - Artist profile arrow (`40px x 40px`, `border-radius: 50%`)
  - Release play button (`47px x 47px`, `border-radius: 50%`)
  - Dialog close button (`border-radius: 50%`)
- **Zero Drop-Shadow Clutter:**
  No cards cast diffuse digital shadows. Elevation is achieved purely through color contrast, borders, and layered planar overlap. The only shadows in the entire system are subtle, tinted atmospheric dialog scuffs (`box-shadow: 0 15px 100px #00000026;`).

---

## 6. Micro-Interactions & Choreographed Motion

Motion in ATMOS is restrained, physical, and unhurried:

- **The Governing Ease Curve:**
  ```css
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  ```
  A custom quintic deceleration curve. It accelerates briskly and glides to a stop like a luxury physical drawer.
- **Micro-Hover Transformations:**
  - **Image zoom:** Subtle and disciplined (`transform: scale(1.035)` to `scale(1.045)`). Never aggressive.
  - **Diagonal arrow drift:** External link indicators shift subtly up and right (`transform: translate(3px, -3px)`).
  - **Circular action triggers:** On hover, rotate 90 degrees and fill with citron accent:
    ```css
    .product-preview-button:hover .quick-add {
      transform: rotate(90deg);
      background: var(--color-citron);
    }
    ```
- **Quiet Header:**
  The navigation header is sticky, slim (80px), and has a faint hairline border (`#20221e0d`). It stays completely out of the way, allowing the campaign hero imagery to dominate.
- **Reduced Motion Respect:**
  Every Motion component and CSS animation respects `prefers-reduced-motion: reduce`, dropping transitions to zero or minimal fades.

---

## 7. Directives for Future Agents & Engineers

When adding new pages, dialogs, features, or components to ATMOS, follow these immutable rules:

### DO:
1. **Always use `--color-paper` (`#f2f1e9`) and `--color-ink` (`#20221e`)** as your foundational contrast pair.
2. **Use `IBM Plex Mono` for all metadata, counters, timecodes, and eyebrows**, styled uppercase with wide tracking (`0.07em`).
3. **Use `Inter Tight` with tight negative tracking (`-0.035em` to `-0.05em`)** for display titles.
4. **Use `clamp()` for responsive layout and typography** so the experience feels continuous from 320px mobile to 2560px ultra-wide displays.
5. **Keep containers flat with 0 border-radius**, using 1px hairline rules (`var(--line)`) for structure.
6. **Provide keyboard accessibility and focus trapping** for all overlay dialogs.

### DO NOT:
1. **DO NOT use generic rounded cards (`rounded-lg`, `rounded-2xl`)** or Tailwind drop-shadow utilities (`shadow-lg`, `shadow-xl`).
2. **DO NOT add gradient borders, neon glowing buttons, or glassmorphic blur overlays** unless explicitly instructed.
3. **DO NOT create symmetrical, boring 3-column card layouts** without first considering visual hierarchy and editorial scale.
4. **DO NOT use pure white (`#fff`) or pure black (`#000`)**; always respect the tactile paper and ink palette.
5. **DO NOT add unrequested decorative badges, counters, chips, or pill wrappers.**
6. **DO NOT introduce new font families** outside the established triad (`Inter Tight`, `DM Sans`, `IBM Plex Mono`).
