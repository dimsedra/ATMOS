'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Plus } from 'lucide-react';
import Header from './Header';
import AudioPlayer from './AudioPlayer';
import ExperienceDialogs, { type ActiveDialog } from './ExperienceDialogs';
import Newsletter from './Newsletter';
import { Wordmark } from './Brand';
import { useAudioPlayer } from '../lib/audio';
import {
  products,
  readLocal,
  writeLocal,
  money,
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

export function ApparelExperience() {
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

  useEffect(() => () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
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
        activeRoute="apparel"
        bagCount={bagCount}
        onOpenBag={() => setDialog({ type: 'bag' })}
        onOpenMenu={() => setDialog({ type: 'menu' })}
      />

      <main id="main">
        {/* =================================================================
            Hero Section: Collection Overview
            ================================================================= */}
        <section className="apparel-page-hero" aria-label="Collection 001 Overview">
          <div className="apparel-hero-header">
            <div>
              <p className="eyebrow">
                <span>01</span> COLLECTION 001 / EVERYDAY OBJECTS
              </p>
              <h1 className="apparel-hero-title">
                Cut to feel like it
                <br />
                has always been yours.
              </h1>
            </div>
            <p className="apparel-hero-statement">
              Cut, weight, and silhouette.
              <br />
              Made for everywhere.
            </p>
          </div>

          <div className="apparel-campaign-frame">
            <img
              src="/images/atmos-campaign.jpg"
              alt="ATMOS Collection 001 Lookbook Spread"
            />
            <div className="apparel-campaign-credit">
              <span>SEOUL ROOFTOP / 37.5665° N, 126.9780° E</span>
              <span>PHOTO BY ATMOS STUDIO / KOREA</span>
            </div>
          </div>
        </section>

        {/* =================================================================
            Scalable Product Catalog Grid
            ================================================================= */}
        <section className="section" aria-label="Collection Objects Catalog">
          <Reveal className="section-header">
            <div>
              <p className="eyebrow">
                <span>02</span> CATALOGUE
              </p>
              <h2>The Objects</h2>
            </div>
            <p className="section-aside">
              {products.length.toString().padStart(2, '0')} OBJECTS AVAILABLE
            </p>
          </Reveal>

          <div className="apparel-grid-scalable">
            {products.map((product) => (
              <article key={product.id} className="apparel-card">
                <div
                  className="apparel-card-media product-preview-button cursor-pointer"
                  onClick={() => setDialog({ type: 'product', product })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setDialog({ type: 'product', product });
                    }
                  }}
                  aria-label={`Inspect ${product.name}`}
                >
                  <img src={product.image} alt={product.name} />
                  <span className="quick-view-label">INSPECT OBJECT</span>
                  <button
                    className="quick-add"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDialog({ type: 'product', product });
                    }}
                    aria-label={`Choose size for ${product.name}`}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="apparel-card-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p className="product-meta">
                      {product.category}
                      <span>/</span>
                      {product.color.toUpperCase()}
                    </p>
                  </div>
                  <span className="body-copy font-medium">{money(product.price)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-newsletter">
            <div>
              <p className="eyebrow">ATMOS JOURNAL / PRIVATE DISPATCH</p>
              <h2>Sound. Culture. Everywhere.</h2>
            </div>
            <Newsletter />
          </div>

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
              <Link href="/#artists">Roster</Link>
            </div>

            <div className="footer-link-group">
              <span className="eyebrow">HOUSE</span>
              <Link href="/#stories">Journal</Link>
              <button onClick={() => setDialog({ type: 'manifesto' })}>
                Manifesto
              </button>
              <button onClick={() => setDialog({ type: 'privacy' })}>
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
              <button onClick={() => setDialog({ type: 'terms' })}>Terms</button>
              <button onClick={() => setDialog({ type: 'privacy' })}>
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

export default ApparelExperience;
