'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Small circular (?) icon that reveals a plain-language explanation.
 * - Desktop: hover to reveal.
 * - Mobile / keyboard: tap or focus to toggle.
 * - Closes on outside click or Escape.
 *
 * Used throughout the app to demystify jargon (API key, prompt caching,
 * "Fast mode", etc.) for non-technical users.
 */
export function Help({
  title,
  children,
  side = 'top'
}: {
  title?: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pos =
    side === 'bottom'
      ? 'top-full mt-2 left-0'
      : side === 'left'
      ? 'right-full mr-2 top-0'
      : side === 'right'
      ? 'left-full ml-2 top-0'
      : 'bottom-full mb-2 left-0';

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={title ? `Help: ${title}` : 'Help'}
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="help-dot"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className={`help-pop absolute ${pos} w-64 sm:w-72 z-30`}
        >
          {title && <span className="block font-semibold mb-1 text-zinc-100">{title}</span>}
          <span className="block text-zinc-300 leading-relaxed">{children}</span>
        </span>
      )}
    </span>
  );
}
