'use client';

import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import { Wordmark } from './Brand';
import { navLinks } from '../lib/data';

type HeaderProps = {
  activeRoute?: 'home' | 'apparel' | 'artists' | 'releases' | 'journal' | 'about';
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
          const anchorName = link.href.replace('/#', '').replace('#', '');
          const isActive = isApparel
            ? activeRoute === 'apparel'
            : activeRoute === anchorName;

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
