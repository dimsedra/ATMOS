'use client';

import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Dialog from './Dialog';
import Newsletter from './Newsletter';
import { AtmosGlobe, Wordmark } from './Brand';
import { money, navLinks, products, releases, writeLocal, type Article, type Artist, type CartItem, type Product, type Release } from '../lib/data';

export type ActiveDialog =
  | { type: 'product'; product: Product }
  | { type: 'artist'; artist: Artist }
  | { type: 'article'; article: Article }
  | { type: 'social'; channel: string }
  | { type: 'bag' | 'collection' | 'manifesto' | 'privacy' | 'terms' | 'menu' };

type DialogsProps = {
  dialog: ActiveDialog;
  onClose: () => void;
  open: (dialog: ActiveDialog) => void;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  addToCart: (product: Product, size: string, quantity: number) => boolean;
  play: (release: Release) => void;
  notify: (message: string) => void;
};

function Quantity({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  return <div className="quantity-control"><button aria-label={`Decrease ${label} quantity`} onClick={() => onChange(value - 1)} disabled={value <= 1}><Minus size={14} /></button><span aria-live="polite">{value}</span><button aria-label={`Increase ${label} quantity`} onClick={() => onChange(value + 1)} disabled={value >= 10}><Plus size={14} /></button></div>;
}

function ProductDetail({ product, addToCart, openBag }: { product: Product; addToCart: DialogsProps['addToCart']; openBag: () => void }) {
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div className="product-detail">
      <div className="product-detail-image"><img src={product.image} alt={`${product.name} in ${product.color}`} /></div>
      <div className="product-detail-info">
        <span className="eyebrow">COLLECTION 001 / EVERYDAY OBJECTS</span>
        <h2>{product.name}</h2>
        <div className="product-detail-price"><span>{money(product.price)}</span><span className="micro">USD</span></div>
        <p className="body-copy">{product.description}</p>
        <p className="product-color"><span className={`color-dot ${product.id === 'studio-cap' ? 'color-black' : ''}`} />{product.color}</p>
        <fieldset className="size-selector"><legend className="eyebrow">SELECT SIZE</legend><div>{product.sizes.map((option) => <button key={option} type="button" aria-pressed={size === option} className={size === option ? 'selected' : ''} onClick={() => { setSize(option); setAdded(false); }}>{option}</button>)}</div></fieldset>
        <div className="product-quantity"><span className="eyebrow">QUANTITY</span><Quantity label={product.name} value={quantity} onChange={(next) => { setQuantity(next); setAdded(false); }} /></div>
        <button className="solid-button" disabled={!size} onClick={() => { if (addToCart(product, size, quantity)) setAdded(true); }}><span>{added ? 'Add another' : size ? 'Add to bag' : 'Select a size'}</span>{added ? <Check size={19} /> : <Plus size={19} />}</button>
        {added && <button className="text-link added-link" onClick={openBag}><span>Added. Take a look at your bag</span><ArrowUpRight size={17} /></button>}
        <details className="product-details-list"><summary>Details & care <Plus size={16} /></summary><ul>{product.details.map((detail) => <li key={detail}>{detail}</li>)}<li>Cold wash. Air dry. Wear again.</li></ul></details>
        {product.sizes.length > 1 && <details className="product-details-list"><summary>Find your fit <Plus size={16} /></summary><p>Designed for a relaxed fit. Choose your usual size, or size down for a closer fit.</p><table><caption className="sr-only">Garment dimensions in centimeters</caption><thead><tr><th>CM</th>{product.sizes.map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody><tr><th>Chest</th><td>54</td><td>57</td><td>60</td><td>63</td><td>66</td></tr><tr><th>Length</th><td>64</td><td>67</td><td>70</td><td>73</td><td>76</td></tr></tbody></table></details>}
        <p className="micro concept-note">CONCEPT COLLECTION. EXPLORE THE FIT, NOT A LIVE SALE.</p>
      </div>
    </div>
  );
}

function Bag({ cart, setCart, close, notify }: { cart: CartItem[]; setCart: DialogsProps['setCart']; close: () => void; notify: DialogsProps['notify'] }) {
  const [stage, setStage] = useState<'bag' | 'checkout' | 'saved'>('bag');
  const [reference, setReference] = useState('');
  const subtotal = cart.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const update = (index: number, quantity: number) => setCart((previous) => previous.map((item, i) => i === index ? { ...item, quantity } : item).filter((item) => item.quantity > 0));

  const saveReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = `ATM-${Date.now().toString(36).slice(-6).toUpperCase()}`;
    const saved = writeLocal('atmos-reservation', { reference: code, name: String(form.get('name')).trim(), email: String(form.get('email')).trim(), cart, subtotal, date: new Date().toISOString() });
    if (!saved) {
      notify('Your browser could not save the preview. Please enable local storage and try again.');
      return;
    }
    setReference(code);
    setStage('saved');
    setCart([]);
  };

  if (stage === 'saved') return <div className="bag-content bag-confirmation"><AtmosGlobe className="confirmation-globe" /><span className="eyebrow">A GOOD CHOICE.</span><h2>Consider it<br />remembered.</h2><p>Your selection has been saved on this device. No payment was taken, and no order was placed.</p><p className="micro">PREVIEW REFERENCE / {reference}</p><button className="solid-button" onClick={close}>Back to the atmosphere <ArrowUpRight size={19} /></button></div>;

  if (stage === 'checkout') return <div className="bag-content"><button className="text-link back-link" onClick={() => setStage('bag')}><ArrowLeft size={16} /> Back to bag</button><span className="eyebrow">ONE LAST THING</span><h2>Make it yours.<br />Someday.</h2><p className="body-copy">This is a concept store. Save your selection locally to explore the experience. Nothing will be charged or sent.</p><form className="checkout-form" onSubmit={saveReservation}><label>Your name<input name="name" autoComplete="name" required placeholder="First and last name" maxLength={120} /></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" maxLength={254} /></label><div className="bag-subtotal"><span>Preview subtotal</span><strong>{money(subtotal)}</strong></div><button className="solid-button" type="submit">Save my selection <ArrowUpRight size={19} /></button><p className="micro">SAVED ONLY IN THIS BROWSER. NO EMAIL IS SENT.</p></form></div>;

  return <div className="bag-content"><span className="eyebrow">THE EVERYDAY COLLECTION</span><h2>Your bag <span className="bag-title-count">({count.toString().padStart(2, '0')})</span></h2>{cart.length === 0 ? <div className="empty-bag"><ShoppingBag size={40} strokeWidth={1} /><h3>A little room for something good.</h3><p>Your bag is empty. The everyday essentials are waiting.</p><button className="solid-button" onClick={() => { close(); document.getElementById('apparel')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}>Explore apparel <ArrowUpRight size={19} /></button></div> : <><div className="bag-items">{cart.map((item, index) => { const product = products.find((entry) => entry.id === item.productId)!; return <div className="bag-item" key={`${item.productId}-${item.size}`}><img src={product.image} alt={product.name} /><div className="bag-item-info"><h3>{product.name}</h3><p>{product.color} / {item.size}</p><Quantity label={`${product.name}, size ${item.size}`} value={item.quantity} onChange={(next) => update(index, next)} /></div><div className="bag-item-end"><span>{money(product.price * item.quantity)}</span><button className="icon-button" aria-label={`Remove ${product.name}, size ${item.size}`} onClick={() => update(index, 0)}><Trash2 size={16} /></button></div></div>; })}</div><div className="bag-summary"><div className="bag-subtotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Good things, considered. All prices in USD.</p><button className="solid-button" onClick={() => setStage('checkout')}>Continue to preview <ArrowUpRight size={19} /></button><p className="micro">A CONCEPT STOREFRONT. NO PAYMENT REQUIRED.</p></div></>}</div>;
}

export default function ExperienceDialogs({ dialog, onClose, open, cart, setCart, addToCart, play, notify }: DialogsProps) {
  if (dialog.type === 'product') return <Dialog title={dialog.product.name} onClose={onClose} className="product-dialog"><ProductDetail product={dialog.product} addToCart={addToCart} openBag={() => open({ type: 'bag' })} /></Dialog>;

  if (dialog.type === 'bag') return <Dialog title="Your shopping bag" onClose={onClose} drawer><Bag cart={cart} setCart={setCart} close={onClose} notify={notify} /></Dialog>;

  if (dialog.type === 'collection') return <Dialog title="Collection 001" onClose={onClose} className="collection-dialog"><div className="collection-intro"><img src="/images/atmos-campaign.jpg" alt="The ATMOS everyday uniform, on location in Seoul" /><div><span className="eyebrow">ATMOS OBJECTS / COLLECTION 001</span><h2>No occasion<br />necessary.</h2><p>A considered beginning to an everyday wardrobe. Made for repeat wear, not a single era.</p></div></div><div className="collection-products">{products.map((product) => <button key={product.id} onClick={() => open({ type: 'product', product })}><img src={product.image} alt={product.name} /><div><span>{product.name}</span><span>{money(product.price)} <ArrowUpRight size={17} /></span></div></button>)}</div></Dialog>;

  if (dialog.type === 'artist') {
    const artist = dialog.artist;
    const release = releases.find((item) => item.id === artist.releaseId)!;
    return <Dialog title={`Meet ${artist.name}`} onClose={onClose} className="artist-dialog"><div className={`artist-dialog-image artist-dialog-${artist.id}`}><img src={artist.image} alt={artist.name} /><h2>{artist.name}<span className="micro">ATMOS ARTIST</span></h2></div><div className="artist-dialog-copy"><span className="eyebrow">{artist.location}</span><h3>{artist.intro}</h3><p>{artist.bio}</p><button className="solid-button" onClick={() => { play(release); onClose(); }}>Listen to {release.title} <ArrowUpRight size={19} /></button><span className="micro concept-note">FICTIONAL ARTIST / ORIGINAL CONCEPT AUDIO</span></div></Dialog>;
  }

  if (dialog.type === 'article') {
    const article = dialog.article;
    return <Dialog title={article.title} onClose={onClose} className="article-dialog"><img className="article-hero" src={article.image} alt={article.imageAlt} /><article className="article-body"><div className="article-meta"><span>{article.category}</span><span>{article.date} / 3 MIN READ</span></div><h2>{article.title}</h2><p className="article-intro">{article.intro}</p>{article.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 30)}>{paragraph}</p>)}<div className="article-signoff"><Wordmark /><span className="micro">FROM INSIDE THE ATMOSPHERE.</span></div><button className="text-link" onClick={onClose}><ArrowLeft size={16} /> Back to the journal</button></article></Dialog>;
  }

  if (dialog.type === 'manifesto') return <Dialog title="The ATMOS point of view" onClose={onClose} className="manifesto-dialog"><span className="eyebrow">THE ATMOS POINT OF VIEW</span><h2>Atmosphere,<br />not spectacle.</h2><p className="manifesto-intro">What if K-pop met the world where it already stands?</p><p className="body-copy">We are a music and culture house built around a feeling in the room. Not one world exported. Many worlds, connected. Four ideas hold it all together.</p><div className="pillar-list">{[{ n: '01', title: 'Sound comes first.', text: 'The song has to survive with nothing else attached. Warm production, a committed groove, and a hook that stays. Music that belongs on your shuffle, not just on a stage.' }, { n: '02', title: 'In the pocket. Not in formation.', text: 'Individual expression inside a shared groove. Real people feeling the music, not a machine executing it. Charisma over choreography. Loose over precise.' }, { n: '03', title: 'Lived in. Never translated.', text: 'Real fluency in Seoul, Tokyo, London, California, and Bangkok. Built with people who belong to those scenes, not a mood board of them.' }, { n: '04', title: 'Good taste needs no context.', text: 'Things you would wear even if you had never heard the music. Considered cut, fabric, and silhouette. A wardrobe that builds over years, not a comeback cycle.' }].map((pillar) => <section key={pillar.n}><span className="micro">{pillar.n}</span><div><h3>{pillar.title}</h3><p>{pillar.text}</p></div></section>)}</div><p className="manifesto-ending">A music and culture house first.<br />A K-pop label, on our own terms.</p><Wordmark className="manifesto-wordmark" /></Dialog>;

  if (dialog.type === 'social') return <Dialog title={`ATMOS on ${dialog.channel}`} onClose={onClose} className="simple-dialog social-dialog"><AtmosGlobe className="social-globe" /><span className="eyebrow">THE NEXT FREQUENCY</span><h2>Soon, on<br />{dialog.channel}.</h2><p>Our world is still taking shape. ATMOS is a concept label, and our social channels are not live yet. Leave a little sign of interest for what comes next.</p><Newsletter compact /></Dialog>;

  if (dialog.type === 'menu') return <Dialog title="Navigation" onClose={onClose} drawer className="mobile-menu-dialog"><Wordmark className="menu-wordmark" /><nav aria-label="Mobile navigation">{navLinks.map((link, index) => <a key={link.href} href={link.href} onClick={onClose}><span className="micro">0{index + 1}</span>{link.label}<ArrowUpRight size={26} /></a>)}</nav><p className="eyebrow">SOUND. CULTURE. EVERYWHERE.</p><AtmosGlobe className="menu-globe" /></Dialog>;

  const privacy = dialog.type === 'privacy';
  const clearLocalData = () => {
    try {
      ['atmos-newsletter', 'atmos-reservation', 'atmos-bag'].forEach((key) => localStorage.removeItem(key));
      setCart([]);
      window.dispatchEvent(new Event('atmos:newsletter-change'));
      notify('Your local ATMOS data has been cleared.');
      onClose();
    } catch {
      notify('Your browser could not clear storage. Please use your browser settings.');
    }
  };

  return (
    <Dialog title={privacy ? 'Your privacy' : 'Terms of the atmosphere'} onClose={onClose} className="simple-dialog legal-dialog">
      <span className="eyebrow">A LITTLE TRANSPARENCY</span>
      <h2>{privacy ? 'Your data. Your space.' : 'A world in the making.'}</h2>
      {privacy ? <>
        <p>This is a front-end concept experience. Newsletter entries, shopping bags, and preview selections are saved only in your browser's local storage. They are not sent to a mailing service or an order system.</p>
        <p>Images and fonts may load from third-party providers. This experience does not include advertising trackers or an analytics integration.</p>
        <p>You can remove your locally saved information at any time using the button below. This also empties your bag.</p>
        <button className="solid-button" onClick={clearLocalData}>Clear my local data <Trash2 size={17} /></button>
      </> : <>
        <p>ATMOS is a conceptual independent music and culture house. The artists, releases, products, and editorial stories shown here are illustrative creations for this front-end experience.</p>
        <p>Products are not available for sale. Previewing a checkout does not place an order, process a payment, or reserve physical inventory.</p>
        <p>Audio previews are original, synthesized musical sketches for this concept, not recordings by the fictional artists. Campaign and product visuals are generated imagery.</p>
        <p>Explore freely. Find your frequency.</p>
        <button className="text-link" onClick={onClose}>Back to ATMOS <ArrowRight size={17} /></button>
      </>}
    </Dialog>
  );
}
