import React from 'react';

// Sister component to RosePetals. Same family of warm rose / blush /
// gold tones, but the motion is *upward* — small glowing orbs rising
// and gently pulsing — so alternating sections still feel ambient
// without literally repeating the petal-fall effect.

type Sparkle = {
  left: string;
  delay: string;
  duration: string;
  size: number;
  drift: string;
  fill: string;
  opacity: number;
};

const SPARKLES: Sparkle[] = [
  { left: '4%',  delay: '-3s',  duration: '14s', size: 8,  drift: '20px',  fill: '#c9748a', opacity: 0.55 },
  { left: '11%', delay: '-9s',  duration: '17s', size: 6,  drift: '-15px', fill: '#e8a6b4', opacity: 0.45 },
  { left: '18%', delay: '-1s',  duration: '12s', size: 10, drift: '25px',  fill: '#d4a574', opacity: 0.5 },
  { left: '25%', delay: '-11s', duration: '15s', size: 7,  drift: '-30px', fill: '#c9748a', opacity: 0.6 },
  { left: '32%', delay: '-5s',  duration: '13s', size: 5,  drift: '18px',  fill: '#e8a6b4', opacity: 0.4 },
  { left: '40%', delay: '-13s', duration: '16s', size: 9,  drift: '-22px', fill: '#f4c6a8', opacity: 0.55 },
  { left: '47%', delay: '-2s',  duration: '14s', size: 6,  drift: '12px',  fill: '#c9748a', opacity: 0.5 },
  { left: '54%', delay: '-8s',  duration: '18s', size: 8,  drift: '-28px', fill: '#d4a574', opacity: 0.6 },
  { left: '61%', delay: '-10s', duration: '13s', size: 5,  drift: '14px',  fill: '#e8a6b4', opacity: 0.45 },
  { left: '68%', delay: '-4s',  duration: '15s', size: 9,  drift: '-20px', fill: '#c9748a', opacity: 0.55 },
  { left: '76%', delay: '-12s', duration: '17s', size: 6,  drift: '24px',  fill: '#f4c6a8', opacity: 0.5 },
  { left: '83%', delay: '-6s',  duration: '12s', size: 10, drift: '-18px', fill: '#d4a574', opacity: 0.6 },
  { left: '90%', delay: '-14s', duration: '14s', size: 7,  drift: '16px',  fill: '#e8a6b4', opacity: 0.5 },
  { left: '96%', delay: '-7s',  duration: '16s', size: 5,  drift: '-12px', fill: '#c9748a', opacity: 0.45 },
];

export function RoseSparkles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SPARKLES.map((s, i) => {
        const style: React.CSSProperties = {
          left: s.left,
          width: s.size,
          height: s.size,
          animation: `sparkleRise ${s.duration} ease-in-out ${s.delay} infinite`,
          background: `radial-gradient(circle, ${s.fill} 0%, ${s.fill}55 50%, transparent 75%)`,
          borderRadius: '50%',
          filter: `drop-shadow(0 0 6px ${s.fill}80)`,
        };
        (style as Record<string, string>)['--sparkle-drift'] = s.drift;
        (style as Record<string, string>)['--sparkle-opacity'] = String(s.opacity);
        return (
          <span
            key={i}
            className="absolute bottom-0 will-change-transform"
            style={style}
          />
        );
      })}
    </div>
  );
}
