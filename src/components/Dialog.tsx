'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

type DialogProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  drawer?: boolean;
};

export default function Dialog({ title, onClose, children, className = '', drawer = false }: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const reducedMotion = useReducedMotion();
  closeRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus({ preventScroll: true });

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex="0"]');
      const focusable = nodes ? Array.from(nodes).filter((node) => node.getClientRects().length > 0) : [];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const outsidePanel = !panelRef.current?.contains(document.activeElement);
      if (!first) {
        event.preventDefault();
        return;
      }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current || outsidePanel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panelRef.current || outsidePanel)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [mounted]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <motion.div className={`dialog-backdrop ${drawer ? 'is-drawer' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={panelRef} className={`dialog-panel ${className}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} initial={reducedMotion ? false : drawer ? { x: '100%' } : { y: 24, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} exit={drawer ? { x: '100%' } : { y: 16, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <button className="dialog-close icon-button" onClick={onClose} aria-label="Close dialog"><X size={21} /></button>
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
