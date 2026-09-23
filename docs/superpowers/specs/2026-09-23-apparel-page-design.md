# ATMOS Apparel Page Design Spec (`/apparel`)

**Date:** 2026-09-23  
**Status:** Approved  
**Author:** Eds & Antigravity  

---

## 1. Overview & Context

ATMOS is an independent music and culture house based in Seoul, operating on the core creed *"Atmosphere, Not Spectacle."* 

While the landing page (`/`) serves as a curated monograph overview summarizing all facets of ATMOS (Sound, Apparel, Artists, Stories, House), each navigation destination represents a dedicated full-room experience. This specification defines the architecture, visual layout, and editorial content for the first dedicated destination: **`/apparel`** (*COLLECTION 001 / EVERYDAY OBJECTS*).

The page embodies **Pillar IV of the ATMOS Manifesto**:
> *"Not Merch. Fandom merch is proof-of-fandom gear — value only exists inside knowing the group. Lifestyle is taste-signaling — value exists whether or not the wearer has ever heard the music. The test: Does the piece get complimented by someone who doesn't know who the group is?"*

---

## 2. Design Principles & Anti-AI-Slop Governance

In strict compliance with `AGENTS.md`:
1. **Physical Monograph Aesthetic:** Tactile warm paper canvas (`--color-paper: #f2f1e9`), deep printer's ink (`--color-ink: #20221e`), electric citron energy highlight (`--color-citron: #e4ecaa`), and hairline rules (`--line: #20221e30`).
2. **Sharp Architectural Planes:** 0 border-radius on all rectangular containers, image frames, and input fields.
3. **Circular Micro-Anchors:** Pristine 50% circular pills for micro-actions (quick-add trigger rotating 90 degrees on hover, dialog close button, bag counter).
4. **Typographic Scale Tension:** Monumental display titles in `Inter Tight` (`-0.035em` to `-0.055em` tracking) paired directly with miniature 8px–10px uppercase metadata in `IBM Plex Mono`. Editorial narratives in warm, humanist `DM Sans`.
5. **Anti-Hype Copywriting Voice:** Zero exclamation marks (`!`), zero idol jargon (*"comeback", "merch drop", "stanning", "bias"*). Short, declarative, poetic sentences.

---

## 3. Route & Component Architecture

```text
src/
├── app/
│   ├── layout.tsx              # Root HTML, fonts, and metadataBase
│   ├── page.tsx                # Monograph Overview (Landing Page)
│   └── apparel/
│       └── page.tsx            # Dedicated Apparel Page Route
├── components/
│   ├── AtmosExperience.tsx     # Landing page interactive client shell
│   ├── ApparelExperience.tsx   # Apparel page interactive client shell ('use client')
│   ├── Header.tsx              # Reusable navigation bar with active route highlight
│   ├── ExperienceDialogs.tsx   # Shared product detail and shopping bag modals
│   ├── AudioPlayer.tsx         # Docked Web Audio preview player
│   ├── Brand.tsx               # Wordmark and AtmosGlobe SVG vectors
│   └── Newsletter.tsx          # Subscription interest block
└── lib/
    ├── data.ts                 # Catalog products, sizes, prices, details
    └── audio.ts                # Web Audio synthesizer hook
```

### 3.1 Architectural Decomposition & Reusability
- **Header Extraction (`src/components/Header.tsx`)**:
  - Extracts the existing sticky header from `AtmosExperience.tsx` into an isolated, reusable component.
  - Accepts props: `activeRoute: 'home' | 'apparel' | 'sound' | 'artists' | 'journal'`, `bagCount: number`, `onOpenBag: () => void`, `onOpenMenu: () => void`.
  - On `/apparel`, the "Apparel" link receives the active underline indicator (`active` class).
- **Client Boundary (`ApparelExperience.tsx`)**:
  - Marked with `'use client'`.
  - Maintains hydration-safe state synchronization with `localStorage` (`'atmos-bag'`).
  - Hosts the modal dialogs (`<ExperienceDialogs />`) so that clicking any product instantly opens the full product specification drawer with size picker, image view, and cart controls.

---

## 4. Page Layout & Content Anatomy

The `/apparel` page is structured into 5 editorial movements:

### Movement 1: Collection Hero Spread
- **Eyebrow (IBM Plex Mono, uppercase, tracking 0.08em):**  
  `COLLECTION 001 / EVERYDAY OBJECTS`
- **Headline (Inter Tight, fluid clamp 42px to 80px, line-height 0.95):**  
  *"Cut to feel like it has always been yours."*
- **Curatorial Statement (DM Sans, line-height 1.8, max-width 560px):**  
  *"Not proof-of-fandom gear. Taste-signaling essentials engineered in Seoul, made for everywhere. Zero tour slogans. Just cut, weight, and silhouette."*
- **Visual:** Full-width campaign lookbook frame (`/images/atmos-campaign.jpg`) with subtle dark gradient scrim and micro photographer credit.

### Movement 2: The Objects Spread (Asymmetrical Lookbook Grid)
- Asymmetrical 2-column or 3-column layout showcasing the core collection objects:
  1. **The Everyday Tee ($58 / Bone)**:
     - Photo: `/images/atmos-tee.jpg`
     - Category code: `HEAVYWEIGHT COTTON / 260 GSM`
     - Quick-add circular button (rotates 90° on hover into a plus icon with citron fill).
     - Direct button to inspect full specs.
  2. **The Studio Cap ($38 / Faded Black)**:
     - Photo: `/images/atmos-cap.jpg`
     - Category code: `WASHED COTTON TWILL / UNSTRUCTURED 6-PANEL`
     - Quick-add circular button and specification modal trigger.

### Movement 3: Material & Textile Archive (Pilar IV Depth)
An editorial deep-dive into fabric selection and tactility:
- **01 / The Weight (260 GSM Organic Cotton)**:  
  *Dense enough to hold a clean boxy drape without clinging. Breathable, durable, and softened through an enzymatic wash.*
- **02 / The Wash (Garment-Washed Cotton Twill)**:  
  *Washed down before assembly to remove all industrial stiffness. Feels like a piece you’ve owned for ten years.*
- **03 / The Palette (Bone & Faded Black)**:  
  *Earth-derived, unbleached hues designed to pair naturally with any wardrobe. Quiet dignity over loud seasonal trends.*

### Movement 4: Architectural Fit Matrix
A clinical, monospaced measurement blueprint table:
- Displayed with hairline dividers (`1px solid var(--line)`).
- Dimensions in centimeters for sizes XS, S, M, L, XL:
  - Chest width (54cm to 66cm)
  - Body length (64cm to 76cm)
  - Shoulder drop (51cm to 61cm)
- Tailoring notes: *"Cut with a boxy torso and dropped shoulders. Take your true size for the intended relaxed fit, or size down for a standard silhouette."*

### Movement 5: Room Transition & Footer
- Inter-room teaser:
  - Eyebrow: `CONTINUE THE EXPERIENCE`
  - Title: *"02 Sound — Built to Pass the Car Test"*
  - Link leading back to `#sound` or home.
- Footer with newsletter subscription, legal dialog triggers, and full-width ATMOS wordmark.

---

## 5. Hydration & State Safety

- **Shared Cart (`'atmos-bag'`)**: Hydrated safely post-mount using `useEffect`, preventing any server/client mismatch.
- **Custom Event Sync (`'atmos:bag-change'`)**: Changes to the bag in one tab or dialog instantly trigger UI re-renders across header badge and drawers.

---

## 6. Verification & Acceptance Criteria

1. **Clean Turbopack Build:** `npm run build` succeeds with 0 TypeScript errors and static generation of both `/` and `/apparel`.
2. **Visual Parity with `AGENTS.md`:** 100% adherence to typography triad, color tokens, fluid `clamp()` responsive math, and zero border-radius.
3. **Interactive Parity:**
   - Quick-add and modal inspection work flawlessly.
   - Header active states dynamically reflect the `/apparel` route.
   - Shopping bag count updates accurately and persists across page reloads.
