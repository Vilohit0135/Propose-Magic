import React from 'react';

type Petal = {
  left: string;
  delay: string;
  duration: string;
  size: number;
  sway: string;
  spin: string;
  fill: string;
  opacity: number;
  blur?: number;
};

// Deterministic petal layout — hand-tuned for a calm, believable fall.
// Mixed palette of rose / blush / gold-cream petals drifting across the hero.
const PETALS: Petal[] = [
  { left: '3%',  delay: '-2s',  duration: '13s', size: 16, sway: '55px',  spin: '520deg',  fill: '#c9748a', opacity: 0.7, blur: 0.4 },
  { left: '8%',  delay: '-7s',  duration: '16s', size: 12, sway: '-40px', spin: '-680deg', fill: '#e8a6b4', opacity: 0.55, blur: 0.8 },
  { left: '14%', delay: '-4s',  duration: '11s', size: 20, sway: '70px',  spin: '480deg',  fill: '#f4c6a8', opacity: 0.75 },
  { left: '19%', delay: '-11s', duration: '15s', size: 14, sway: '-55px', spin: '-540deg', fill: '#d4a574', opacity: 0.5, blur: 0.6 },
  { left: '24%', delay: '-1s',  duration: '12s', size: 18, sway: '35px',  spin: '620deg',  fill: '#c9748a', opacity: 0.8 },
  { left: '29%', delay: '-9s',  duration: '17s', size: 11, sway: '-30px', spin: '-420deg', fill: '#e8a6b4', opacity: 0.45, blur: 1 },
  { left: '34%', delay: '-5s',  duration: '10s', size: 22, sway: '60px',  spin: '560deg',  fill: '#8b1538', opacity: 0.6 },
  { left: '40%', delay: '-13s', duration: '14s', size: 15, sway: '-65px', spin: '-720deg', fill: '#f4c6a8', opacity: 0.7 },
  { left: '46%', delay: '-3s',  duration: '12s', size: 13, sway: '40px',  spin: '500deg',  fill: '#c9748a', opacity: 0.65, blur: 0.5 },
  { left: '52%', delay: '-8s',  duration: '15s', size: 19, sway: '-45px', spin: '-600deg', fill: '#d4a574', opacity: 0.7 },
  { left: '58%', delay: '-10s', duration: '11s', size: 14, sway: '50px',  spin: '540deg',  fill: '#e8a6b4', opacity: 0.55, blur: 0.7 },
  { left: '64%', delay: '-6s',  duration: '13s', size: 17, sway: '-50px', spin: '-460deg', fill: '#c9748a', opacity: 0.75 },
  { left: '70%', delay: '-12s', duration: '16s', size: 12, sway: '35px',  spin: '660deg',  fill: '#f4c6a8', opacity: 0.5, blur: 0.9 },
  { left: '76%', delay: '-2s',  duration: '10s', size: 21, sway: '-60px', spin: '-580deg', fill: '#8b1538', opacity: 0.65 },
  { left: '82%', delay: '-14s', duration: '14s', size: 15, sway: '45px',  spin: '520deg',  fill: '#d4a574', opacity: 0.6, blur: 0.5 },
  { left: '87%', delay: '-4s',  duration: '12s', size: 13, sway: '-35px', spin: '-640deg', fill: '#e8a6b4', opacity: 0.7 },
  { left: '92%', delay: '-9s',  duration: '15s', size: 18, sway: '55px',  spin: '480deg',  fill: '#c9748a', opacity: 0.75 },
  { left: '96%', delay: '-1s',  duration: '13s', size: 11, sway: '-25px', spin: '-520deg', fill: '#f4c6a8', opacity: 0.5, blur: 0.8 },
];

export function RosePetals() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {PETALS.map((p, i) => {
        const style: React.CSSProperties = {
          left: p.left,
          width: p.size,
          height: Math.round(p.size * 1.2),
          animation: `petalFall ${p.duration} linear ${p.delay} infinite`,
          filter: p.blur
            ? `drop-shadow(0 2px 4px rgba(139,21,56,0.15)) blur(${p.blur}px)`
            : 'drop-shadow(0 2px 4px rgba(139,21,56,0.18))',
        };
        (style as Record<string, string>)['--petal-sway'] = p.sway;
        (style as Record<string, string>)['--petal-spin'] = p.spin;
        (style as Record<string, string>)['--petal-opacity'] = String(p.opacity);
        return (
          <span key={i} className="rose-petal absolute top-0 will-change-transform" style={style}>
            <svg width="100%" height="100%" viewBox="0 0 20 24" fill="none">
              <path
                d="M10 0 C4 5 2 11 3 16 C4 20 6 23 10 23 C14 23 16 20 17 16 C18 11 16 5 10 0 Z"
                fill={p.fill}
                opacity="0.95"
              />
              <path
                d="M10 2 C6 7 5 12 6 16 C7 19 8 21 10 21"
                stroke={p.fill}
                strokeOpacity="0.3"
                strokeWidth="0.5"
                fill="none"
              />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
