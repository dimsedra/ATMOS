# ATMOS Next.js Porting Design Spec

**Date:** 2026-09-23  
**Status:** Approved  
**Author:** Eds & Antigravity  

---

## 1. Overview & Context

ATMOS is a front-end concept and digital platform for an independent Seoul-based music and culture house (lifestyle, apparel, K-Pop/R&B roster, editorial journal, and procedural Web Audio synthesizer).

The design currently exists as a standalone Vite + React 19 + Tailwind v4 + Motion application in the `temp/` folder. The goal of Phase 1 is a clean, 1:1 faithful port to Next.js App Router deployed at the repository root, ready for zero-friction Vercel hosting. Full-stack ecosystem capabilities (e.g., database, CMS, auth) will be built in subsequent phases.

---

## 2. Architecture & Design Principles

- **1:1 Visual & Functional Fidelity:** Replicate the exact design, spacing, typography, motion curves, and interaction flows from `temp/`.
- **YAGNI (You Aren't Gonna Need It):** No unsolicited features, bloatware, or premature abstractions. Keep the codebase clean, lean, and focused.
- **Client/Server Boundary Separation:**
  - Next.js App Router (`src/app/page.tsx`, `src/app/layout.tsx`) handles root HTML, document metadata (title, OpenGraph, icons), and server pre-rendering.
  - Interactive islands (`src/components/AtmosExperience.tsx`, `AudioPlayer.tsx`, `ExperienceDialogs.tsx`) operate as Client Components (`'use client'`).
- **Hydration Safety:** Browser-only primitives (`localStorage` for cart persistence, `window.AudioContext` for audio synthesis) are executed strictly post-mount or on user gesture, preventing SSR hydration mismatches.
- **Modern & Stable Dependencies:** Only current stable releases (Next.js 16+, React 19+, Tailwind CSS 4.3+, Motion 13.4+).

---

## 3. Tech Stack & Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `next` | `^16.3` / latest stable | App Router, SSR metadata, Vercel optimization |
| `react` | `^19.3` / latest stable | UI library |
| `react-dom` | `^19.3` / latest stable | DOM renderer |
| `tailwindcss` | `^4.3` / latest stable | Utility-first styling engine |
| `@tailwindcss/postcss` | `^4.3` / latest stable | PostCSS plugin for Tailwind v4 |
| `postcss` | `^8.5` | PostCSS runner |
| `motion` | `^13.4` / latest stable | UI animation & layout transitions |
| `lucide-react` | `^1.47` / latest stable | Clean iconography |
| `clsx` | `^2.1` | Conditional class names |
| `tailwind-merge` | `^3.4` | Tailwind utility conflict resolution |
| `typescript` | `^5.9` | Static type checking |

---

## 4. Directory & File Structure

```text
ATMOS/
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   └── 2026-09-23-atmos-nextjs-porting-design.md
│       └── plans/
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── after-hours.jpg
│       ├── artist-june.jpg
│       ├── artist-noa.jpg
│       ├── atmos-campaign.jpg
│       ├── atmos-cap.jpg
│       ├── atmos-hero.jpg
│       ├── atmos-tee.jpg
│       ├── in-between.jpg
│       └── soft-focus.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── AtmosExperience.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── Brand.tsx
│   │   ├── Dialog.tsx
│   │   ├── ExperienceDialogs.tsx
│   │   └── Newsletter.tsx
│   ├── lib/
│   │   ├── audio.ts
│   │   └── data.ts
│   └── utils/
│       └── cn.ts
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## 5. Component Breakdown & Data Flow

### 5.1 Root Layout & Page
- `src/app/layout.tsx`: Configures standard font families (inter/system), sets `<meta>` tags, viewport, and imports `globals.css`.
- `src/app/page.tsx`: Server Component rendering the metadata and serving `<AtmosExperience />`.

### 5.2 Interactive Shell (`src/components/AtmosExperience.tsx`)
- Centralizes single-page UI state:
  - `activeDialog`: Tracks active modal (`null | 'product' | 'bag' | 'artist' | 'release' | 'story' | 'newsletter' | 'privacy' | 'social'`).
  - `selectedProductId`, `selectedArtistId`, `selectedReleaseId`, `selectedStoryId`: Contextual data for dialog rendering.
  - `bag`: Array of `CartItem` (`{ productId, size, quantity }`), hydrated safely from `localStorage` in `useEffect`.
- Renders page sections:
  - Navigation bar with wordmark & bag counter.
  - Campaign Hero section with full-bleed visual.
  - Apparel/Merch collection grid.
  - Artists roster showcase.
  - Filterable discography.
  - Editorial stories & Seoul house profile.
  - City ticker & clean footer.

### 5.3 Audio Engine (`src/lib/audio.ts` & `src/components/AudioPlayer.tsx`)
- Procedural Web Audio API engine synthesizing 30-second preview sketches for ATMOS releases without external audio files.
- Safe client-only execution (`AudioContext` initialized only upon explicit user play interaction).
- Smooth playback lifecycle, timeline scrubbing, and audio node cleanup upon unmount.

### 5.4 Experience Dialogs (`src/components/Dialog.tsx` & `ExperienceDialogs.tsx`)
- Accessible modal dialogs with focus trapping, ESC key listener, and backdrop click dismissal.
- Full details for:
  - Product modal with size picker and Add to Bag.
  - Shopping Bag drawer with quantity controls and simulated checkout.
  - Artist profile modal with biography and discography links.
  - Release player modal with track details and interactive audio controls.
  - Editorial story reader.
  - Newsletter interest signup and Privacy policy info.

---

## 6. Verification & Acceptance Criteria

1. **Clean Build:** `npm run build` succeeds with zero TypeScript errors and zero Next.js linting errors.
2. **Visual Parity:** Every section and modal matches the original `temp/` layout, typography, colors, and motion fidelity.
3. **Interactive Parity:**
   - Bag items can be added, updated, removed, and persist in `localStorage` without hydration warnings.
   - All modals open and close smoothly.
   - Audio synthesizer plays procedural audio on user click and handles pause/resume without glitches.
4. **Vercel Readiness:** Root directory is fully self-contained; no reliance on `temp/`.
