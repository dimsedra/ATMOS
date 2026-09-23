'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Header from './Header';
import AudioPlayer from './AudioPlayer';
import ExperienceDialogs, { type ActiveDialog } from './ExperienceDialogs';
import { Wordmark } from './Brand';
import { useAudioPlayer } from '../lib/audio';
import {
  artists,
  products,
  readLocal,
  writeLocal,
  type CartItem,
  type Product,
} from '../lib/data';

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0.65, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function initialBag(): CartItem[] {
  const stored = readLocal<unknown>('atmos-bag', []);
  if (!Array.isArray(stored)) return [];
  return stored.filter((item): item is CartItem => {
    if (!item || typeof item !== 'object') return false;
    const product = products.find((entry) => entry.id === item.productId);
    return (
      !!product &&
      product.sizes.includes(item.size) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 10
    );
  });
}

export function ArtistsExperience() {
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    setCart(initialBag());
  }, []);

  useEffect(() => {
    if (mounted) {
      writeLocal('atmos-bag', cart);
    }
  }, [cart, mounted]);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  const notify = useCallback((message: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(message);
    toastTimeout.current = setTimeout(() => setToast(''), 5000);
  }, []);

  const player = useAudioPlayer(notify);
  const closeDialog = useCallback(() => setDialog(null), []);
  const bagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, size: string, quantity: number) => {
    const existing = cart.find(
      (item) => item.productId === product.id && item.size === size
    );
    if ((existing?.quantity ?? 0) + quantity > 10) {
      notify('A maximum of 10 pieces per size can be added to this preview.');
      return false;
    }
    setCart((previous) => {
      const found = previous.find(
        (item) => item.productId === product.id && item.size === size
      );
      return found
        ? previous.map((item) =>
            item === found ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...previous, { productId: product.id, size, quantity }];
    });
    notify(`${product.name} added to your bag.`);
    return true;
  };

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header
        activeRoute="artists"
        bagCount={bagCount}
        onOpenBag={() => setDialog({ type: 'bag' })}
        onOpenMenu={() => setDialog({ type: 'menu' })}
      />

      <main id="main">
        {/* Section 01: Room Header & Statement */}
        <section className="artists-page-hero" aria-label="Artists Room Overview">
          <Reveal>
            <div className="eyebrow">ROSTER / 001</div>
            <div className="artists-hero-header">
              <div>
                <h1>THE VOICES</h1>
              </div>
              <p>
                Rooted in cities.
                <br />
                Crossing in one room.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Section 02: Editorial Directory Roster */}
        <section className="artists-catalog-section" aria-label="Artists Directory">
          <div className="artists-directory-grid">
            {artists.map((artist, idx) => {
              const formattedIdx = `[0${idx + 1}]`;
              return (
                <Reveal key={artist.id} delay={idx * 0.08} className="artists-grid-item">
                  <button
                    type="button"
                    className="artist-directory-card"
                    onClick={() => setDialog({ type: 'artist', artist })}
                    aria-label={`View ${artist.name} profile and music`}
                  >
                    <div className="artist-directory-media">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={600}
                        height={750}
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                    <div className="artist-directory-content">
                      <div className="artist-directory-info">
                        <div className="artist-directory-meta">
                          <span className="artist-idx">{formattedIdx}</span>
                          <span>{artist.location}</span>
                        </div>
                        <h2>{artist.name}</h2>
                        <p>{artist.discipline}</p>
                      </div>
                      <div className="artist-directory-btn" aria-hidden="true">
                        <ArrowUpRight size={18} strokeWidth={1.8} />
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Global Footer */}
        <footer className="site-footer">
          <div className="footer-links">
            <div>
              <p className="footer-description">
                ATMOS is an independent music and culture house. Atmosphere, not
                spectacle. Rooted in Seoul, at home everywhere.
              </p>
            </div>

            <div className="footer-link-group">
              <span className="eyebrow">DISPATCH</span>
              <Link href="/apparel">Collection 001</Link>
              <Link href="/#releases">Releases</Link>
              <Link href="/artists">Roster</Link>
            </div>

            <div className="footer-link-group">
              <span className="eyebrow">HOUSE</span>
              <Link href="/#stories">Journal</Link>
              <button type="button" onClick={() => setDialog({ type: 'manifesto' })}>
                Manifesto
              </button>
              <button type="button" onClick={() => setDialog({ type: 'privacy' })}>
                Privacy
              </button>
            </div>

            <div className="footer-back-top">
              <a href="#main">
                <span>Top</span>
                <ArrowRight size={14} className="-rotate-90" />
              </a>
              <span className="micro">SEOUL / 2026</span>
            </div>
          </div>

          <div className="footer-wordmark">
            <Wordmark />
          </div>

          <div className="footer-bottom">
            <span>© 2026 ATMOS HOUSE. ALL RIGHTS RESERVED.</span>
            <div>
              <button type="button" onClick={() => setDialog({ type: 'terms' })}>
                Terms
              </button>
              <button type="button" onClick={() => setDialog({ type: 'privacy' })}>
                Privacy & Data
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Audio Player */}
      <AnimatePresence>
        {player.active && <AudioPlayer player={player} />}
      </AnimatePresence>

      {/* Experience Dialogs */}
      <AnimatePresence>
        {dialog && (
          <ExperienceDialogs
            dialog={dialog}
            onClose={closeDialog}
            open={setDialog}
            cart={cart}
            setCart={setCart}
            addToCart={addToCart}
            play={player.play}
            notify={notify}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
