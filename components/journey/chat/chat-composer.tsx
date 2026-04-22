'use client';

import React, { useState } from 'react';
import type { TemplateDef } from '@/lib/types';
import { withAlpha } from './bubbles';

export function ChatComposer({
  t,
  hearts,
  onHeart,
  disabled,
}: {
  t: TemplateDef;
  hearts: number;
  onHeart: () => void;
  disabled?: boolean;
}) {
  const [floaters, setFloaters] = useState<{ id: number; x: number }[]>([]);

  const handle = () => {
    if (disabled) return;
    onHeart();
    const id = Math.random();
    setFloaters((f) => [...f, { id, x: (Math.random() - 0.5) * 60 }]);
    setTimeout(() => setFloaters((f) => f.filter((fl) => fl.id !== id)), 1600);
  };

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 20,
        padding: '10px 14px 14px',
        background: `linear-gradient(180deg, transparent 0%, ${withAlpha(t.palette.bg, 0.9)} 40%, ${t.palette.bg} 100%)`,
        backdropFilter: 'blur(14px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 6px 6px 18px',
          borderRadius: 99,
          background: withAlpha(t.palette.text, 0.06),
          border: `1px solid ${withAlpha(t.palette.text, 0.1)}`,
        }}
      >
        <div
          style={{
            flex: 1,
            color: t.palette.muted,
            fontSize: 13,
            fontFamily: t.fonts.body,
            fontStyle: 'italic',
            opacity: 0.7,
          }}
        >
          tap the heart to send love →
        </div>
        <button
          onClick={handle}
          aria-label="Send heart"
          disabled={disabled}
          style={{
            position: 'relative',
            width: 42,
            height: 42,
            borderRadius: 99,
            border: `1px solid ${withAlpha(t.palette.accent, 0.6)}`,
            background: withAlpha(t.palette.accent, 0.18),
            color: t.palette.accent,
            fontSize: 20,
            cursor: disabled ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 ${Math.min(hearts * 2, 30)}px ${withAlpha(t.palette.accent, 0.6)}`,
            transition: 'box-shadow 0.3s, transform 0.1s',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          ♥
          {hearts > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                background: t.palette.accent,
                color: t.palette.bg,
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 99,
                padding: '1px 6px',
                minWidth: 16,
              }}
            >
              {hearts}
            </span>
          )}
          {floaters.map((f) => {
            const s: React.CSSProperties = {
              position: 'absolute',
              left: '50%',
              top: '50%',
              color: t.palette.accent,
              fontSize: 18,
              pointerEvents: 'none',
              animation: 'heartFloat 1.6s ease-out forwards',
            };
            (s as Record<string, string>)['--fx'] = `${f.x}px`;
            return (
              <span key={f.id} style={s}>
                ♥
              </span>
            );
          })}
        </button>
      </div>
    </div>
  );
}
