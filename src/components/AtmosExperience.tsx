'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight, ArrowUp, ArrowUpRight, Check, Menu, Pause, Play, Plus, ShoppingBag, X } from 'lucide-react';
import { AtmosGlobe, Wordmark } from './Brand';
import AudioPlayer from './AudioPlayer';
import ExperienceDialogs, { type ActiveDialog } from './ExperienceDialogs';
import Newsletter from './Newsletter';
import { useAudioPlayer } from '../lib/audio';
import { articles, artists, money, navLinks, products, readLocal, releases, writeLocal, type CartItem, type Product } from '../lib/data';

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0.65, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function initialBag(): CartItem[] {
  const stored = readLocal<unknown>('atmos-bag', []);
  if (!Array.isArray(stored)) return [];
  return stored.filter((item): item is CartItem => {
    if (!item || typeof item !== 'object') return false;
    const product = products.find((entry) => entry.id === item.productId);
    return !!product && product.sizes.includes(item.size) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10;
  });
}

function getDialogKey(dialog: ActiveDialog) {
  if (dialog.type === 'product') return `product-${dialog.product.id}`;
  if (dialog.type === 'artist') return `artist-${dialog.artist.id}`;
  if (dialog.type === 'article') return `article-${dialog.article.id}`;
  if (dialog.type === 'social') return `social-${dialog.channel}`;
  return dialog.type;
}

export function AtmosExperience() {
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [releaseFilter, setReleaseFilter] = useState<'All' | 'EPs' | 'Singles'>('All');
  const [allReleases, setAllReleases] = useState(false);
  const [allStories, setAllStories] = useState(false);
  const [citiesPaused, setCitiesPaused] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  const notify = useCallback((message: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(message);
    toastTimeout.current = setTimeout(() => setToast(''), 5000);
  }, []);
  const player = useAudioPlayer(notify);
  const closeDialog = useCallback(() => setDialog(null), []);
  const bagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const visibleReleases = releaseFilter === 'All' ? (allReleases ? releases : releases.slice(0, 3)) : releases.filter((release) => release.type === (releaseFilter === 'EPs' ? 'EP' : 'Single'));

  useEffect(() => {
    setMounted(true);
    setCart(initialBag());
  }, []);

  useEffect(() => {
    if (mounted) {
      writeLocal('atmos-bag', cart);
    }
  }, [cart, mounted]);
  useEffect(() => () => { if (toastTimeout.current) clearTimeout(toastTimeout.current); }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const addToCart = (product: Product, size: string, quantity: number) => {
    const existing = cart.find((item) => item.productId === product.id && item.size === size);
    if ((existing?.quantity ?? 0) + quantity > 10) {
      notify('A maximum of 10 pieces per size can be added to this preview.');
      return false;
    }
    setCart((previous) => {
      const found = previous.find((item) => item.productId === product.id && item.size === size);
      return found ? previous.map((item) => item === found ? { ...item, quantity: item.quantity + quantity } : item) : [...previous, { productId: product.id, size, quantity }];
    });
    notify(`${product.name} added to your bag.`);
    return true;
  };

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="header-brand" href="#home" aria-label="ATMOS home"><Wordmark /></a>
        <span className="header-tagline">SOUND. CULTURE.<br />EVERYWHERE.</span>
        <nav className="desktop-nav" aria-label="Main navigation">{navLinks.map((link) => <a key={link.href} href={link.href} className={activeSection === link.href.slice(1) ? 'active' : ''}>{link.label}</a>)}</nav>
        <button className="header-bag" onClick={() => setDialog({ type: 'bag' })} aria-label={`Open bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}><ShoppingBag size={17} strokeWidth={1.6} /><span>Bag</span><span className="bag-count">({bagCount.toString().padStart(2, '0')})</span></button>
        <button className="mobile-menu-button icon-button" aria-label="Open navigation menu" onClick={() => setDialog({ type: 'menu' })}><Menu size={23} /></button>
      </header>

      <main id="main">
        <section className="hero" id="home" aria-label="ATMOS, atmosphere not spectacle">
          <motion.img className="hero-image" src="/images/atmos-hero.jpg" alt="The five members of SORA, finding their own space on a Seoul rooftop" fetchPriority="high" initial={reducedMotion ? false : { scale: 1.055 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
          <div className="hero-shade" />
          <motion.h1 className="hero-wordmark" aria-label="ATMOS" initial={reducedMotion ? false : { y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}><Wordmark /><span className="sr-only">ATMOS</span></motion.h1>
          <motion.div className="hero-bottom" initial={reducedMotion ? false : { y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }}>
            <div className="hero-statement"><p className="hero-headline">Atmosphere,<br />not spectacle.</p><p className="hero-description">A music & culture house. Everywhere, by nature.</p></div>
            <a className="hero-cta" href="#apparel"><span>Enter the atmosphere</span><ArrowDownRight size={25} strokeWidth={1.5} /></a>
          </motion.div>
        </section>

        <div className="city-band" role="region" aria-label="One atmosphere, across Seoul, Tokyo, London, California, and Bangkok">
          <div className="city-band-label"><span className="signal-dot" />ONE WORLD. OUR OWN FREQUENCY.</div>
          <div className="city-marquee" aria-hidden="true"><div className="city-track" style={{ animationPlayState: citiesPaused ? 'paused' : 'running' }}>{[0, 1].map((copy) => <div className="city-group" key={copy}>{['SEOUL', 'TOKYO', 'LONDON', 'CALIFORNIA', 'BANGKOK'].map((city) => <span key={city}>{city}<span className="city-plus">+</span></span>)}</div>)}</div></div>
          {!reducedMotion && <button className="city-pause" onClick={() => setCitiesPaused((value) => !value)} aria-label={citiesPaused ? 'Resume city ticker' : 'Pause city ticker'}>{citiesPaused ? <Play size={11} /> : <Pause size={11} />}</button>}
        </div>

        <section id="apparel" className="section apparel-section">
          <Reveal className="section-header"><div><p className="eyebrow"><span>01</span> THE EVERYDAY</p><h2>Good taste. No context needed.</h2></div><button className="text-link" onClick={() => setDialog({ type: 'collection' })}>Explore apparel <ArrowUpRight size={19} /></button></Reveal>
          <div className="apparel-grid">
            <Reveal className="campaign-preview"><button className="campaign-button" onClick={() => setDialog({ type: 'collection' })}><div className="apparel-image campaign-image"><img src="/images/atmos-campaign.jpg" alt="The ATMOS everyday uniform worn in the city" loading="lazy" /><div className="campaign-overlay"><span className="micro">COLLECTION 001</span><p>Wear it your way.</p><ArrowUpRight size={29} strokeWidth={1.5} /></div></div><div className="apparel-caption"><span>Not merch. Part of the everyday.</span><span className="micro">ATMOS OBJECTS</span></div></button></Reveal>
            {products.map((product, index) => <Reveal key={product.id} delay={0.07 * (index + 1)} className="product-preview"><button className="product-preview-button" onClick={() => setDialog({ type: 'product', product })} aria-label={`View ${product.name}, ${money(product.price)}`}><div className="apparel-image product-image"><img src={product.image} alt={`${product.name} in ${product.color}`} loading="lazy" /><span className="quick-add" aria-hidden="true"><Plus size={20} strokeWidth={1.5} /></span><span className="quick-view-label">TAKE A CLOSER LOOK</span></div><div className="product-caption"><h3>{product.name}</h3><span>{money(product.price)}</span></div><p className="product-meta">{product.color} <span>/</span> {product.category}</p></button></Reveal>)}
          </div>
        </section>

        <section id="artists" className="section artists-section">
          <Reveal className="section-header"><div><p className="eyebrow"><span>02</span> THE PEOPLE</p><h2>Different roots. Same frequency.</h2></div><p className="section-aside">Individual voices.<br />An interconnected world.</p></Reveal>
          <div className="artist-grid">{artists.map((artist, index) => <Reveal className={`artist-preview artist-${artist.id}`} key={artist.id} delay={index * 0.07}><button onClick={() => setDialog({ type: 'artist', artist })} aria-label={`Meet ${artist.name}`}><div className="artist-image"><img src={artist.image} alt={artist.name === 'SORA' ? 'SORA, the five-member group' : `${artist.name}, ATMOS artist`} loading="lazy" /><div className="artist-image-shade" /><div className="artist-image-caption"><h3>{artist.name}</h3><span className="artist-arrow"><ArrowUpRight size={25} strokeWidth={1.4} /></span></div></div><div className="artist-caption"><span className="micro">{artist.location}</span><span className="artist-index micro">0{index + 1}</span></div></button></Reveal>)}</div>
        </section>

        <section id="releases" className="section releases-section">
          <Reveal className="section-header"><div><p className="eyebrow"><span>03</span> ON REPEAT</p><h2>Good music travels.</h2></div><div className="release-filters" role="group" aria-label="Filter releases">{(['All', 'EPs', 'Singles'] as const).map((filter) => <button key={filter} aria-pressed={releaseFilter === filter} className={releaseFilter === filter ? 'selected' : ''} onClick={() => setReleaseFilter(filter)}>{filter}</button>)}</div></Reveal>
          <div className="release-grid" aria-live="polite">{visibleReleases.map((release, index) => <Reveal key={release.id} delay={(index % 3) * 0.07}><article className="release-preview"><button className={`release-art cover-${release.style}`} onClick={() => player.play(release)} aria-label={`${player.active?.id === release.id && player.playing ? 'Pause' : 'Play'} ${release.title} by ${release.artist}, concept preview`}><img src={release.image} alt="" loading="lazy" /><span className="cover-topline"><span>{release.artist}</span><span>ATM / {String(releases.indexOf(release) + 1).padStart(3, '0')}</span></span><span className="cover-title">{release.title}</span><span className="cover-bottomline">AN ATMOS RECORDING<br />FEEL IT BEFORE YOU NAME IT.</span><span className={`release-play ${player.active?.id === release.id && player.playing ? 'is-playing' : ''}`}>{player.active?.id === release.id && player.playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}</span></button><div className="release-caption"><div><h3>{release.title}</h3><p>{release.artist} <span>/</span> {release.type}</p></div><span className="micro release-date">{release.date}</span></div></article></Reveal>)}</div>
          <div className="release-section-bottom"><p className="micro">MUSIC FIRST. EVERYTHING ELSE FOLLOWS.</p><button className="text-link" aria-expanded={allReleases} onClick={() => { setAllReleases((value) => !value); setReleaseFilter('All'); }}>{allReleases ? 'A little less' : 'All releases (06)'}{allReleases ? <ArrowUp size={18} /> : <ArrowUpRight size={19} />}</button></div>
        </section>

        <section id="journal" className="section journal-section">
          <Reveal className="section-header"><div><p className="eyebrow"><span>04</span> THE JOURNAL</p><h2>Inside the atmosphere.</h2></div><button className="text-link" aria-expanded={allStories} onClick={() => setAllStories((value) => !value)}>{allStories ? 'Fewer stories' : 'All stories'}{allStories ? <ArrowUp size={18} /> : <ArrowUpRight size={19} />}</button></Reveal>
          <div className="journal-grid">{(allStories ? articles : articles.slice(0, 3)).map((article, index) => <Reveal key={article.id} delay={(index % 3) * 0.07}><article className="journal-preview"><button onClick={() => setDialog({ type: 'article', article })}><div className={`journal-image journal-image-${article.id}`}><img src={article.image} alt={article.imageAlt} loading="lazy" /></div><div className="journal-meta"><span>{article.category}</span><time>{article.date}</time></div><div className="journal-title"><h3>{article.title}</h3><ArrowUpRight size={22} strokeWidth={1.5} /></div></button></article></Reveal>)}</div>
        </section>

        <section id="about" className="about-section">
          <Reveal className="about-copy"><p className="eyebrow"><span>05</span> THE HOUSE</p><h2>Not a place.<br />A feeling.</h2><p className="about-description">We make music, build culture, and create things to live in. Rooted in Seoul. Connected by feeling, everywhere.</p><button className="text-link" onClick={() => setDialog({ type: 'manifesto' })}>A little more about us <ArrowUpRight size={20} /></button></Reveal>
          <Reveal className="about-art" delay={0.15}><AtmosGlobe className="about-globe" /><p className="micro">NO BORDERS. JUST A SHARED ATMOSPHERE.</p></Reveal>
        </section>
      </main>

      <footer className={`site-footer ${player.active ? 'has-player' : ''}`}>
        <div className="footer-newsletter"><Reveal><p className="eyebrow">LET'S STAY IN EACH OTHER'S ORBIT.</p><h2>Stay in the<br />atmosphere.</h2></Reveal><Newsletter /></div>
        <div className="footer-links"><p className="footer-description">A music & culture house.<br />Rooted in Seoul.<br />At home everywhere.</p><div className="footer-link-group"><p className="eyebrow">EXPLORE</p>{navLinks.map((link) => <a href={link.href} key={link.href}>{link.label}<ArrowUpRight size={12} /></a>)}</div><div className="footer-link-group"><p className="eyebrow">ELSEWHERE</p>{['Instagram', 'YouTube', 'Spotify'].map((channel) => <button key={channel} onClick={() => setDialog({ type: 'social', channel })}>{channel}<ArrowUpRight size={12} /></button>)}</div><div className="footer-back-top"><a href="#home">Back to top <ArrowUp size={18} /></a><span className="micro">ALWAYS FINDING<br />OUR OWN FREQUENCY.</span></div></div>
        <a href="#home" className="footer-wordmark" aria-label="ATMOS, back to top"><Wordmark /></a>
        <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} ATMOS. ALL FEELINGS RESERVED.</span><span className="footer-concept">AN INDEPENDENT CONCEPT.</span><div><button onClick={() => setDialog({ type: 'privacy' })}>Privacy</button><button onClick={() => setDialog({ type: 'terms' })}>Terms</button><span aria-label="Language: English">EN</span></div></div>
      </footer>

      <AnimatePresence mode="wait">{dialog && <ExperienceDialogs key={getDialogKey(dialog)} dialog={dialog} onClose={closeDialog} open={setDialog} cart={cart} setCart={setCart} addToCart={addToCart} play={player.play} notify={notify} />}</AnimatePresence>
      <AnimatePresence>{player.active && <AudioPlayer player={player} key="audio-player" />}</AnimatePresence>
      <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><Check size={17} /><span>{toast}</span><button className="icon-button" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={17} /></button></motion.div>}</AnimatePresence>
    </MotionConfig>
  );
}

export default AtmosExperience;
