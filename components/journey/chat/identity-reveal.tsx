'use client';

import React, { useEffect, useState } from 'react';

// Renders a name that, when `reveal` flips to true, animates the
// character-by-character transition from hidden text ("???") to the real name.
// Kept tiny on purpose — this is the only post-reveal animation we have.
export function RevealingName({
  name,
  reveal,
  hiddenText = '???',
  color,
  accent,
  delayMs = 0,
}: {
  name: string;
  reveal: boolean;
  hiddenText?: string;
  color?: string;
  accent?: string;
  delayMs?: number;
}) {
  const target = name;
  const [displayed, setDisplayed] = useState<string>(reveal ? target : hiddenText);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (!reveal) {
      setDisplayed(hiddenText);
      setGlow(false);
      return;
    }
    let cancelled = false;
    const start = setTimeout(() => {
      if (cancelled) return;
      setGlow(true);
      const letters = target.split('');
      letters.forEach((_, i) => {
        setTimeout(
          () => {
            if (cancelled) return;
            setDisplayed(target.slice(0, i + 1));
          },
          60 * (i + 1),
        );
      });
    }, delayMs);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [reveal, target, hiddenText, delayMs]);

  return (
    <span
      style={{
        color: glow && accent ? accent : color,
        textShadow: glow && accent ? `0 0 12px ${accent}` : 'none',
        transition: 'color 0.6s, text-shadow 0.6s',
      }}
    >
      {displayed}
    </span>
  );
}
