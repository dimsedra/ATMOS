'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { readLocal, writeLocal } from '../lib/data';

function hasSavedInterest() {
  const saved = readLocal<{ email?: unknown } | null>('atmos-newsletter', null);
  return typeof saved?.email === 'string' && saved.email.includes('@');
}

export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setJoined(hasSavedInterest());
    const sync = () => {
      setJoined(hasSavedInterest());
      setEmail('');
    };
    const syncStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === 'atmos-newsletter') sync();
    };
    window.addEventListener('atmos:newsletter-change', sync);
    window.addEventListener('storage', syncStorage);
    return () => {
      window.removeEventListener('atmos:newsletter-change', sync);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (writeLocal('atmos-newsletter', { email: email.trim().toLowerCase(), date: new Date().toISOString() })) {
      setJoined(true);
      window.dispatchEvent(new Event('atmos:newsletter-change'));
    } else setError('Browser storage is unavailable. Please allow local storage and try again.');
  };

  return (
    <div className={`newsletter ${compact ? 'newsletter-compact' : ''}`}>
      {joined ? (
        <div className="newsletter-success" role="status"><Check size={25} /><div><strong>You're in the atmosphere.</strong><p>Your interest is saved on this device. No email is sent by this concept site.</p></div></div>
      ) : (
        <form onSubmit={subscribe}>
          <label htmlFor={id} className="sr-only">Your email address</label>
          <div className="newsletter-input"><input id={id} type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} aria-describedby={`${id}-note`} /><button aria-label="Join the ATMOS mailing list" type="submit"><ArrowUpRight size={28} strokeWidth={1.5} /></button></div>
          <p id={`${id}-note`} className="newsletter-note">New music. Good things. No unnecessary noise.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
      )}
    </div>
  );
}
