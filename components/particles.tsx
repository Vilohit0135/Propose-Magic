'use client';

import React from 'react';
import { TEMPLATES } from '@/lib/tokens';
import type { TemplateId } from '@/lib/types';

export function Particles({
  template,
  density = 1,
  emoji,
}: {
  template: TemplateId;
  density?: number;
  emoji?: string;
}) {
  const t = TEMPLATES[template] || TEMPLATES.rose_dark;
  const char = emoji || t.particle;
  const layers = [
    { count: Math.round(8 * density), size: [10, 14], speed: [28, 40], opacity: 0.35 },
    { count: Math.round(6 * density), size: [14, 20], speed: [18, 28], opacity: 0.55 },
    { count: Math.round(4 * density), size: [20, 28], speed: [10, 16], opacity: 0.8 },
  ] as const;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {layers.map((L, li) =>
        Array.from({ length: L.count }).map((_, i) => {
          const size = L.size[0] + Math.random() * (L.size[1] - L.size[0]);
          const dur = L.speed[0] + Math.random() * (L.speed[1] - L.speed[0]);
          const delay = -Math.random() * dur;
          const left = Math.random() * 100;
          const drift = (Math.random() - 0.5) * 30;
          const style: React.CSSProperties = {
            position: 'absolute',
            left: `${left}%`,
            bottom: -30,
            fontSize: size,
            opacity: L.opacity,
            animation: `particleRise ${dur}s linear ${delay}s infinite`,
            filter: li === 0 ? 'blur(1.5px)' : 'none',
          };
          (style as Record<string, string>)['--drift'] = `${drift}px`;
          return (
            <div key={`${li}-${i}`} style={style}>
              {char}
            </div>
          );
        })
      )}
    </div>
  );
}

export function Grain() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99,
        opacity: 0.04,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
}
