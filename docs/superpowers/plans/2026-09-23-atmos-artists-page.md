# Dedicated Artists Room (`/artists`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Implement task-by-task inline with clean verification checkpoints. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the dedicated `/artists` room presenting the ATMOS creative roster with an editorial 3-column directory, candid photography, progressive disclosure via profile modal, and seamless audio synthesis previews.

**Architecture:** A Next.js App Router route (`/artists`) serving a Server Component page for metadata and SEO, backed by a client-interactive shell (`ArtistsExperience.tsx`) reusing existing dialog systems (`ExperienceDialogs.tsx`), persistent header navigation, and the procedural Web Audio engine.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion, Web Audio API.

**Spec:** [docs/superpowers/specs/2026-09-23-artists-page-design.md](file:///D:/Project%20Hub/kpop/ATMOS/docs/superpowers/specs/2026-09-23-artists-page-design.md)

## Global Constraints

- 100% adherence to `AGENTS.md` (warm paper `#f2f1e9`, ink `#20221e`, citron `#e4ecaa`, zero container border radius).
- Scalable 3-column grid (`repeat(3, minmax(0, 1fr))`) without bespoke asymmetric hardcoding.
- No feature bloat: no filter tabs, search bars, or decorative badges.
- Progressive disclosure: extended bio and direct audio trigger inside the contextual modal.
- Hydration-safe client state and clean compilation (`npx tsc --noEmit` and `npm run build`).

---

### Task 1: Navigation Link & Header Route State Alignment

**Files:**
- Modify: `src/lib/data.ts:25-33`
- Modify: `src/components/Header.tsx:10-30`

**Interfaces:**
- Consumes: `navLinks` in `data.ts`
- Produces: `Header` active link highlighting for `activeRoute="artists"`

- [ ] **Step 1: Update navigation links in `src/lib/data.ts`**
  Ensure the navigation link points cleanly to `/artists` instead of `#artists` anchor.

- [ ] **Step 2: Update `Header.tsx` activeRoute logic**
  Ensure `'artists'` is an accepted `activeRoute` prop and renders the active indicator properly.

- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Clean pass with 0 errors.

- [ ] **Step 4: Commit navigation updates**
  ```bash
  git add src/lib/data.ts src/components/Header.tsx
  git commit -m "feat(nav): update artists navigation link and active route state"
  ```

---

### Task 2: CSS Styles for Editorial Artists Directory

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS classes `.artists-directory-grid`, `.artist-card-editorial`, `.artist-portrait-frame`, `.artist-circle-btn`

- [ ] **Step 1: Add scalable artists directory CSS in `src/app/globals.css`**
  Add repeatable 3-column grid rules with responsive tablet (2-col) and mobile (1-col) adaptations, 4:5 aspect ratio portrait frames, and unhurried hover ease transitions.

- [ ] **Step 2: Verify CSS syntax and build**
  Run: `npm run build`
  Expected: Successful compilation without Tailwind v4 syntax warnings.

- [ ] **Step 3: Commit CSS changes**
  ```bash
  git add src/app/globals.css
  git commit -m "style: add editorial directory grid styles for artists room"
  ```

---

### Task 3: Interactive Shell Component (`ArtistsExperience.tsx`) & Page Route (`/artists`)

**Files:**
- Create: `src/components/ArtistsExperience.tsx`
- Create: `src/app/artists/page.tsx`

**Interfaces:**
- Consumes: `artists`, `releases` from `src/lib/data.ts`, `ExperienceDialogs` from `src/components/ExperienceDialogs.tsx`, `useAudioPlayer` from `src/lib/audio.ts`
- Produces: `/artists` route rendering the complete editorial room experience

- [ ] **Step 1: Create `src/components/ArtistsExperience.tsx`**
  Implement the client component with:
  - Sticky `Header` with `activeRoute="artists"` and live bag count.
  - Room statement header (`ROSTER / 001`, `THE VOICES`).
  - Repeatable 3-column artist card grid displaying index, city coordinates, 4:5 candid portrait, display typography name, poetic tagline, and circular detail trigger.
  - Integration with `ExperienceDialogs` and `AudioPlayer`.
  - Unhurried footer.

- [ ] **Step 2: Create `src/app/artists/page.tsx`**
  Export metadata (`title: 'ATMOS / ARTISTS'`, description) and render `ArtistsExperience`.

- [ ] **Step 3: Verify with typecheck and production build**
  Run: `npx tsc --noEmit` and `npm run build`
  Expected: Clean pass with Turbopack and 0 warnings.

- [ ] **Step 4: Commit dedicated artists page implementation**
  ```bash
  git add src/components/ArtistsExperience.tsx src/app/artists/page.tsx
  git commit -m "feat(artists): implement dedicated artists room with scalable directory"
  ```
