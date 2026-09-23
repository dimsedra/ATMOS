# ATMOS Next.js Porting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the ATMOS independent music and culture house front-end faithfully from `temp/` to a root Next.js App Router application ready for zero-friction Vercel deployment.

**Architecture:** A lightweight Next.js App Router structure where the root layout and page handle document metadata and static pre-rendering, delegating interactive state (cart persistence, modals, and procedural Web Audio synthesizer) to clean, hydration-safe client components.

**Tech Stack:** Next.js (latest stable 16.x), React 19.3+, Tailwind CSS 4.3+ (`@tailwindcss/postcss`), Motion 13.4+, Lucide React, TypeScript 5.9+.

**Spec:** `docs/superpowers/specs/2026-09-23-atmos-nextjs-porting-design.md`

## Global Constraints

- 1:1 visual, typography, interaction, and sound fidelity with `temp/`.
- No feature bloat, unrequested UI widgets, or premature abstractions.
- All browser-specific APIs (`localStorage`, `AudioContext`) must be hydration-safe and isolated to client components.
- Zero deprecated packages: use latest stable releases.
- Next.js must build cleanly (`npm run build`) with zero TypeScript errors.

---

### Task 1: Initialize Root Next.js Project & Latest Stable Dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`

**Interfaces:**
- Consumes: Node.js runtime, npm
- Produces: Runnable Next.js dev & build toolchain in the root directory

- [ ] **Step 1: Create `package.json` with latest stable dependencies**

```json
{
  "name": "atmos",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^1.47.0",
    "motion": "^13.4.1",
    "next": "^16.3.6",
    "react": "^19.3.0",
    "react-dom": "^19.3.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@types/node": "^22.19.17",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.9.3"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json` configured for Next.js App Router**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "temp"]
}
```

- [ ] **Step 3: Create `next.config.ts` and `postcss.config.mjs`**

`next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

`postcss.config.mjs`:
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 4: Install dependencies and verify npm installation**

Run:
```bash
npm install
```
Expected: All packages installed cleanly with zero dependency conflicts.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs
git commit -m "chore: initialize Next.js root configuration with latest stable dependencies"
```

---

### Task 2: Migrate Static Assets, Utilities & Tailwind CSS System

**Files:**
- Create: `public/favicon.svg`
- Create: `public/images/*` (all 9 images copied from `temp/public/images/`)
- Create: `src/utils/cn.ts`
- Create: `src/app/globals.css`

**Interfaces:**
- Consumes: Assets from `temp/public/images/` and styles from `temp/src/index.css`
- Produces:
  - `cn(...inputs: ClassValue[]): string` utility
  - Global CSS styles and custom marquee / typography animations ready for Next.js

- [ ] **Step 1: Copy public assets from `temp/public/` to root `public/`**

Run:
```powershell
Copy-Item -Path "temp/public/*" -Destination "public" -Recurse -Force
```
Verify: Check that `public/favicon.svg` and `public/images/` contains all 9 images (`after-hours.jpg`, `artist-june.jpg`, `artist-noa.jpg`, `atmos-campaign.jpg`, `atmos-cap.jpg`, `atmos-hero.jpg`, `atmos-tee.jpg`, `in-between.jpg`, `soft-focus.jpg`).

- [ ] **Step 2: Create `src/utils/cn.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Create `src/app/globals.css`**

Migrate Tailwind v4 setup and custom utility classes from `temp/src/index.css`:
```css
@import "tailwindcss";

@layer base {
  :root {
    --color-bg: #090a0c;
    --color-fg: #f4f4f2;
    --color-muted: #8b8f97;
    --color-border: #1e2229;
    --color-surface: #12141a;
    --color-surface-hover: #191c24;
    --color-accent: #e5b982;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-fg);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
```
Ensure all custom typography rules, button utilities, dialog backdrops, and scrollbar styling from `temp/src/index.css` are ported with 100% fidelity.

- [ ] **Step 4: Verify CSS syntax and asset paths**

Run: Check that files exist and image assets are in place.
- [ ] **Step 5: Commit**

```bash
git add public/ src/utils/cn.ts src/app/globals.css
git commit -m "feat: migrate public assets, styling system and class utilities"
```

---

### Task 3: Migrate Core Data Layer & Web Audio Engine

**Files:**
- Create: `src/lib/data.ts`
- Create: `src/lib/audio.ts`

**Interfaces:**
- Consumes: TypeScript definitions and Web Audio API
- Produces:
  - `products`, `artists`, `releases`, `stories` typed data constants
  - `playPreview(release: Release, onProgress?: (time: number) => void): AudioController`
  - `stopPreview(): void`

- [ ] **Step 1: Create `src/lib/data.ts`**

Port types (`Product`, `CartItem`, `Artist`, `Release`, `EditorialStory`) and their corresponding data arrays verbatim from `temp/src/lib/data.ts`.

- [ ] **Step 2: Create `src/lib/audio.ts` with client-side guards**

Port the procedural 30-second synthesizer engine from `temp/src/lib/audio.ts`. Ensure `typeof window !== 'undefined'` guard is in place so importing or referencing it during SSR cannot throw `ReferenceError: AudioContext is not defined`.

- [ ] **Step 3: Verify TypeScript compilation of `lib/`**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/data.ts src/lib/audio.ts
git commit -m "feat: migrate data models and procedural audio engine"
```

---

### Task 4: Port Base UI Components & Modals

**Files:**
- Create: `src/components/Brand.tsx`
- Create: `src/components/Dialog.tsx`
- Create: `src/components/AudioPlayer.tsx`
- Create: `src/components/Newsletter.tsx`
- Create: `src/components/ExperienceDialogs.tsx`

**Interfaces:**
- Consumes: `src/lib/data.ts`, `src/lib/audio.ts`, `src/utils/cn.ts`, `lucide-react`, `motion/react`
- Produces:
  - `<Brand />`: Custom SVG wordmark and logomark
  - `<Dialog />`: Accessible modal with keyboard trap and animations
  - `<AudioPlayer />`: Interactive timeline, play/pause controls
  - `<Newsletter />`: Email subscription form with local feedback
  - `<ExperienceDialogs />`: Modals for Product, Cart/Bag, Artist, Release, Story, Privacy

- [ ] **Step 1: Port `src/components/Brand.tsx` and `src/components/Dialog.tsx`**

Mark with `'use client'` on interactive components. Port exact SVG coordinates, accessible attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), and Motion transitions.

- [ ] **Step 2: Port `src/components/AudioPlayer.tsx`**

Ensure play/pause buttons, progress scrubbing, volume, and song info match `temp/src/components/AudioPlayer.tsx`.

- [ ] **Step 3: Port `src/components/Newsletter.tsx` and `src/components/ExperienceDialogs.tsx`**

Migrate all dialog contents:
- Product dialog: size selector, price, description, Add to Bag action.
- Bag drawer: item list, quantity adjustment, subtotal, simulated checkout button.
- Artist modal: photo, discipline, location, extended bio, linked releases.
- Release modal: release metadata, cover art, embedded audio controller.
- Story reader & Privacy modal with local storage clearing trigger.

- [ ] **Step 4: Verify component types and exports**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: port base UI components and experience dialogs"
```

---

### Task 5: Port Interactive Shell (`AtmosExperience`), Layout & Page Entry Point

**Files:**
- Create: `src/components/AtmosExperience.tsx`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**
- Consumes: All components from Task 4, styles from Task 2, data from Task 3
- Produces: Working full-bleed ATMOS culture house digital platform

- [ ] **Step 1: Create `src/components/AtmosExperience.tsx` (`'use client'`)**

Port the entire layout composition and state orchestrator from `temp/src/App.tsx`:
- State: `activeDialog`, `selectedProductId`, `selectedArtistId`, `selectedReleaseId`, `selectedStoryId`, `bag`.
- Hydration-safe `localStorage` synchronization:
  ```typescript
  const [bag, setBag] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('atmos_bag');
      if (saved) setBag(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('atmos_bag', JSON.stringify(bag));
    } catch (e) {
      console.error(e);
    }
  }, [bag, mounted]);
  ```
- Sections:
  1. Sticky/Floating Navigation bar (Wordmark, quick links, Bag counter pill)
  2. Full-bleed Campaign Hero (`atmos-hero.jpg` with typography overlays)
  3. Apparel & Objects Collection grid
  4. Roster & Artists showcase
  5. Discography table/grid
  6. Editorial stories / Journal
  7. About Seoul house section
  8. City Ticker ("SEOUL 02:00 / TOKYO 02:00 / LONDON 17:00 / NEW YORK 12:00 / LOS ANGELES 09:00")
  9. Footer with newsletter trigger, legal & credits

- [ ] **Step 2: Create `src/app/layout.tsx` and `src/app/page.tsx`**

`src/app/layout.tsx`:
- Configure `<html lang="en">`, standard viewport meta, favicon link to `/favicon.svg`.
- Metadata: `title: "ATMOS — Independent Music & Culture House"`, description.

`src/app/page.tsx`:
```tsx
import { AtmosExperience } from '@/components/AtmosExperience';

export default function HomePage() {
  return <AtmosExperience />;
}
```

- [ ] **Step 3: Verify TypeScript and Dev Server execution**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AtmosExperience.tsx src/app/layout.tsx src/app/page.tsx
git commit -m "feat: complete interactive AtmosExperience shell and Next.js page entry point"
```

---

### Task 6: Full Verification & Vercel Production Build Test

**Files:**
- Modify / Verify: `package.json`, `src/**`

**Interfaces:**
- Consumes: Complete project
- Produces: Verified production build artifacts in `.next/`

- [ ] **Step 1: Run production build**

Run:
```bash
npm run build
```
Expected: Build succeeds with static pages generated and zero errors.

- [ ] **Step 2: Verify interactive flows**
- Verify that `public/images/` are loaded properly without 404s.
- Verify modal open/close actions.
- Verify audio preview synthesizer triggers without errors.
- Verify shopping bag add/remove functionality.

- [ ] **Step 3: Final clean commit**

```bash
git add .
git commit -m "chore: verify production build and finalize Next.js porting"
```
