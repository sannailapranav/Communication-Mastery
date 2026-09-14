import React, { useState, useEffect, useMemo } from 'react';

interface LessonGuidanceMarqueeProps {
  text?: string;
  className?: string;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handler);
      return () => (mediaQuery as any).removeListener(handler);
    }
  }, []);

  return prefersReducedMotion;
}

export const LessonGuidanceMarquee: React.FC<LessonGuidanceMarqueeProps> = ({
  text,
  className = ''
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Clean and prepare guidance text
  const cleanText = useMemo(() => {
    let raw = (text || '').trim();
    if (!raw) {
      return 'Understand the question first → Find the main point → Give your reason → Add an example';
    }
    // Remove wrapping quotes if present
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      raw = raw.slice(1, -1).trim();
    }
    // Strip trailing arrows or periods to avoid redundant formatting
    raw = raw.replace(/[\s→]+$/, '').trim();
    return raw || 'Clear communication starts with structure.';
  }, [text]);

  // Repeat items in each track to ensure full coverage on any screen resolution
  const items = useMemo(() => {
    // If text is short, repeat 3 times per track; if longer, repeat 2 times
    const repetitions = cleanText.length < 50 ? 3 : 2;
    return Array.from({ length: repetitions }, () => cleanText);
  }, [cleanText]);

  // Calculate speed: constant smooth linear pace
  const duration = useMemo(() => {
    const baseLength = cleanText.length * items.length;
    // ~25s for medium strings, scaled proportionally so the pixel velocity stays constant
    return Math.max(18, Math.min(45, Math.round(baseLength * 0.18)));
  }, [cleanText, items.length]);

  if (prefersReducedMotion) {
    return (
      <div className={`w-full overflow-hidden text-left ${className}`}>
        <p className="text-xs sm:text-[13px] text-zinc-700 font-medium leading-relaxed italic">
          "{cleanText}"
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden select-none py-0.5 group ${className}`}
      aria-label={`Lesson Guidance: ${cleanText}`}
    >
      {/* Subtle edge gradient fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-8 bg-gradient-to-r from-zinc-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-8 bg-gradient-to-l from-zinc-50 to-transparent z-10" />

      {/* Marquee conveyor track */}
      <div
        className="animate-guidance-marquee flex items-center whitespace-nowrap will-change-transform"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {/* Track Segment 1 */}
        <div className="flex items-center shrink-0">
          {items.map((it, idx) => (
            <span key={`s1-${idx}`} className="inline-flex items-center shrink-0">
              <span className="font-medium text-zinc-800 text-xs sm:text-[13px] tracking-tight">
                {it}
              </span>
              <span className="text-zinc-400 mx-3 sm:mx-4 text-xs font-mono select-none">→</span>
            </span>
          ))}
        </div>

        {/* Track Segment 2 (Identical twin creating mathematically seamless continuous loop) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {items.map((it, idx) => (
            <span key={`s2-${idx}`} className="inline-flex items-center shrink-0">
              <span className="font-medium text-zinc-800 text-xs sm:text-[13px] tracking-tight">
                {it}
              </span>
              <span className="text-zinc-400 mx-3 sm:mx-4 text-xs font-mono select-none">→</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
