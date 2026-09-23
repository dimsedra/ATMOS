# ATMOS Dedicated Apparel Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the dedicated `/apparel` full-page route as an editorial lookbook and object catalog embodying Pillar IV (*Lifestyle — Worn Without the Group Being the Point*), while extracting a reusable navigation header and maintaining shared shopping bag persistence.

**Architecture:** Next.js App Router route (`src/app/apparel/page.tsx`) rendering an interactive client shell (`src/components/ApparelExperience.tsx`) with hydration-safe `localStorage` bag synchronization, reusing common components (`Header`, `ExperienceDialogs`, `AudioPlayer`, `Brand`, `Newsletter`).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion, Lucide React, TypeScript 5.9.

**Spec:** `docs/superpowers/specs/2026-09-23-apparel-page-design.md`

## Global Constraints

- Strict adherence to `AGENTS.md`: paper/ink/citron palette, 0 border-radius on containers, 50% circular action pills, typography triad (`Inter Tight`, `DM Sans`, `IBM Plex Mono`).
- Anti-hype copywriting canon: zero exclamation marks (`!`), zero idol jargon, short declarative poetic sentences.
- Hydration-safe state: no server/client mismatch when reading `localStorage` for the bag.
- Clean Next.js build (`npm run build`) with zero TypeScript errors.

---

### Task 1: Extract Reusable `<Header />` Component & Verify Landing Page Parity

**Files:**
- Create: `src/components/Header.tsx`
- Modify: `src/components/AtmosExperience.tsx`
- Modify: `src/lib/data.ts` (update `navLinks` href from `#apparel` to `/apparel`)

**Interfaces:**
- Consumes: `src/components/Brand.tsx`, `lucide-react`, `src/lib/data.ts`
- Produces: `<Header activeRoute="home" | "apparel" | ... bagCount={number} onOpenBag={fn} onOpenMenu={fn} />`

- [ ] **Step 1: Update `navLinks` in `src/lib/data.ts`**

Update the Apparel link to point to `/apparel`:
```typescript
export const navLinks = [
  { href: '/apparel', label: 'Apparel' },
  { href: '#sound', label: 'Sound' },
  { href: '#artists', label: 'Artists' },
  { href: '#stories', label: 'Stories' },
  { href: '#house', label: 'House' },
];
```

- [ ] **Step 2: Create `src/components/Header.tsx`**

```typescript
'use client';

import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import { Wordmark } from './Brand';
import { navLinks } from '../lib/data';

type HeaderProps = {
  activeRoute?: 'home' | 'apparel' | 'sound' | 'artists' | 'stories' | 'house';
  bagCount: number;
  onOpenBag: () => void;
  onOpenMenu: () => void;
};

export default function Header({
  activeRoute = 'home',
  bagCount,
  onOpenBag,
  onOpenMenu,
}: HeaderProps) {
  return (
    <header className="site-header">
      <Link className="header-brand" href="/" aria-label="ATMOS home">
        <Wordmark />
      </Link>
      <span className="header-tagline">
        SOUND. CULTURE.
        <br />
        EVERYWHERE.
      </span>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navLinks.map((link) => {
          const isApparel = link.href === '/apparel';
          const isActive = isApparel
            ? activeRoute === 'apparel'
            : activeRoute === link.href.slice(1);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? 'active' : ''}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        className="header-bag"
        onClick={onOpenBag}
        aria-label={`Open bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
      >
        <ShoppingBag size={17} strokeWidth={1.6} />
        <span>Bag</span>
        <span className="bag-count">({bagCount.toString().padStart(2, '0')})</span>
      </button>
      <button
        className="mobile-menu-button icon-button"
        aria-label="Open navigation menu"
        onClick={onOpenMenu}
      >
        <Menu size={23} />
      </button>
    </header>
  );
}
```

- [ ] **Step 3: Replace inline header in `src/components/AtmosExperience.tsx`**

Import and render `<Header activeRoute={activeSection as any || 'home'} bagCount={bagCount} onOpenBag={() => setDialog({ type: 'bag' })} onOpenMenu={() => setDialog({ type: 'menu' })} />`.

- [ ] **Step 4: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/AtmosExperience.tsx src/lib/data.ts
git commit -m "refactor: extract reusable Header component and link /apparel in navLinks"
```

---

### Task 2: Build `<ApparelExperience />` Shell & Movements 1–2 (Hero & Lookbook Grid)

**Files:**
- Create: `src/components/ApparelExperience.tsx`

**Interfaces:**
- Consumes: `src/components/Header.tsx`, `src/components/ExperienceDialogs.tsx`, `src/components/AudioPlayer.tsx`, `src/lib/data.ts`, `src/lib/audio.ts`
- Produces: Complete interactive client component for the Apparel experience

- [ ] **Step 1: Scaffold `src/components/ApparelExperience.tsx` with shared bag & dialog state**

Set up `'use client'`, cart synchronization with `localStorage` (`'atmos-bag'`), `dialog` state (`ActiveDialog | null`), and audio player integration (`useAudioPlayer`).

- [ ] **Step 2: Implement Movement 1 (Collection Hero Spread)**

Render:
- Breadcrumb / Eyebrow: `COLLECTION 001 / EVERYDAY OBJECTS`
- Monumental Title in `Inter Tight`: *"Cut to feel like it has always been yours."*
- Curatorial Body in `DM Sans`: *"Not proof-of-fandom gear. Taste-signaling essentials engineered in Seoul, made for everywhere. Zero tour slogans. Just cut, weight, and silhouette."*
- Full-bleed campaign visual frame (`/images/atmos-campaign.jpg`) with rectangular zero-border-radius framing, dark gradient scrim, and credit: *"SEOUL ROOFTOP / 37.5665° N, 126.9780° E"*.

- [ ] **Step 3: Implement Movement 2 (The Objects Spread)**

Asymmetrical layout showcasing the collection objects:
- **The Everyday Tee ($58 / Bone)**:
  - Big visual (`/images/atmos-tee.jpg`)
  - Subtitle: `HEAVYWEIGHT COTTON / 260 GSM`
  - Quick-add circular button (`border-radius: 50%`, turns citron and rotates 90deg on hover)
  - Detail trigger button opening `setDialog({ type: 'product', product: tee })`
- **The Studio Cap ($38 / Faded Black)**:
  - Big visual (`/images/atmos-cap.jpg`)
  - Subtitle: `WASHED COTTON TWILL / UNSTRUCTURED 6-PANEL`
  - Quick-add circular button and modal trigger.

- [ ] **Step 4: Verify component compilation**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ApparelExperience.tsx
git commit -m "feat: scaffold ApparelExperience with collection hero and objects gallery"
```

---

### Task 3: Build Movements 3–5 (Material Archive, Architectural Fit Matrix & Room Teaser)

**Files:**
- Modify: `src/components/ApparelExperience.tsx`
- Modify: `src/app/globals.css` (add dedicated apparel page layout styles if needed)

**Interfaces:**
- Consumes: Material data, sizing dimensions, and footer structure
- Produces: Complete editorial depth for `/apparel`

- [ ] **Step 1: Implement Movement 3 (Material & Textile Archive)**

Add 3-column architectural material breakdown with hairline dividers:
- `01 / THE WEIGHT`: 260 GSM Heavyweight Organic Cotton — dense boxy drape, enzyme washed, zero transparency.
- `02 / THE WASH`: Washed Cotton Twill — pre-shrunk and garment washed for broken-in softness from day one.
- `03 / THE PALETTE`: Bone & Faded Black — unbleached, earth-grounded tones that pair with any wardrobe.

- [ ] **Step 2: Implement Movement 4 (Architectural Fit Matrix)**

Add clean monospaced measurement table (`IBM Plex Mono`) with hairline borders:
- Dimensions (CM) for XS, S, M, L, XL:
  - Chest width: 54 / 57 / 60 / 63 / 66
  - Length: 64 / 67 / 70 / 73 / 76
  - Shoulder drop: 51 / 53.5 / 56 / 58.5 / 61
- Fitting guidance note: *"Cut with dropped shoulders and a boxy torso. Take your true size for the intended drape, or size down for a tailored silhouette."*

- [ ] **Step 3: Implement Movement 5 (Room Transition & Footer)**

Render:
- Room transition banner:
  - Eyebrow: `NEXT ROOM / 02 SOUND`
  - Title: *"Built to Pass the Car Test"*
  - Link pointing to `/#sound`.
- Full footer: Newsletter signup, legal dialog triggers, copyright, and full-width ATMOS Wordmark.

- [ ] **Step 4: Verify styles and responsive layout**

Verify compilation and styling consistency across desktop and mobile.
Run:
```bash
npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ApparelExperience.tsx src/app/globals.css
git commit -m "feat: complete Material Archive, Architectural Fit Matrix and footer in ApparelExperience"
```

---

### Task 4: Create Next.js App Route `src/app/apparel/page.tsx` & Metadata

**Files:**
- Create: `src/app/apparel/page.tsx`

**Interfaces:**
- Consumes: `src/components/ApparelExperience.tsx`
- Produces: Next.js App Router static route at `/apparel`

- [ ] **Step 1: Create `src/app/apparel/page.tsx`**

```typescript
import type { Metadata } from 'next';
import { ApparelExperience } from '@/components/ApparelExperience';

export const metadata: Metadata = {
  title: 'Apparel — COLLECTION 001 / EVERYDAY OBJECTS — ATMOS',
  description:
    'Not merch. Taste-signaling essentials engineered in Seoul, made for everywhere. 100% organic cotton, 260 GSM, and garment-washed cotton twill. Cut to feel like it has always been yours.',
  openGraph: {
    title: 'Apparel — COLLECTION 001 / EVERYDAY OBJECTS — ATMOS',
    description: 'Taste-signaling essentials engineered in Seoul, made for everywhere.',
    type: 'website',
    images: ['/images/atmos-campaign.jpg'],
  },
};

export default function ApparelPage() {
  return <ApparelExperience />;
}
```

- [ ] **Step 2: Verify route generation**

Run:
```bash
npm run build
```
Expected: Static route `○ /apparel` generated cleanly alongside `○ /`.

- [ ] **Step 3: Commit**

```bash
git add src/app/apparel/page.tsx
git commit -m "feat: add Next.js /apparel route with SEO metadata"
```

---

### Task 5: Full Verification & Cross-Page Integration Test

**Files:**
- Verify: Entire repository

**Interfaces:**
- Consumes: Complete project
- Produces: Production-ready multi-page ATMOS web ecosystem

- [ ] **Step 1: Run production build**

Run:
```bash
npx tsc --noEmit
npm run build
```
Verify: 0 warnings, 0 errors, static prerender of `/` and `/apparel`.

- [ ] **Step 2: Cross-page functional checks**
- Verify that navigating between `/` and `/apparel` highlights the correct link in `<Header />`.
- Verify that adding a product on `/apparel` updates the bag count in the header.
- Verify that opening the bag drawer on `/apparel` displays the stored items and allows quantity adjustments.
- Verify that audio preview player behaves seamlessly.

- [ ] **Step 3: Push changes to remote origin**

```bash
git push origin main
```
