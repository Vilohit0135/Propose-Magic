'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { TemplateDef, VideoTreatmentId } from '@/lib/types';
import { withAlpha } from './bubbles';

// Full-screen Instagram Reels experience. Each clip is its own 100dvh
// panel stacked vertically in a scroll-snap container, so the receiver
// swipes up to advance. Only the visible clip plays; the rest are
// paused via IntersectionObserver. Chrome (progress bar, action rail,
// collab handle, caption) is rendered per-panel so every reel feels
// self-contained, matching Instagram's UX exactly.

export function VideoPopup({
  open,
  poster,
  videoUrl,
  videoUrls,
  treatment,
  fromName,
  toName,
  t,
  onClose,
}: {
  open: boolean;
  poster: string;
  videoUrl: string | null;
  videoUrls?: string[];
  treatment: VideoTreatmentId;
  fromName: string;
  toName: string;
  t: TemplateDef;
  onClose: () => void;
}) {
  const clips = useMemo(() => {
    if (videoUrls && videoUrls.length > 0) return videoUrls;
    return videoUrl ? [videoUrl] : [];
  }, [videoUrls, videoUrl]);

  const firstFrom = firstName(fromName);
  const firstTo = firstName(toName);
  const handle = `${slug(firstFrom)}_${slug(firstTo)}`.slice(0, 30) || 'someone_special';
  const stats = useMemo(() => seededStats(handle), [handle]);

  const [activeIdx, setActiveIdx] = useState(0);

  const filter = useMemo(() => videoFilter(treatment), [treatment]);

  // If she swipes past the last reel, close the popup. Detected by a
  // scroll position past the end + inertia settling. Keeps the flow
  // moving forward without forcing an explicit close tap.
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 180,
            background: '#000',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.3, 1] }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 440,
                height: '100%',
                background: '#000',
                overflow: 'hidden',
              }}
            >
              {/* Fixed top chrome — "Reels" label + close X. Lives above
                  the scroller so the page scrolls under it. */}
              <TopChrome onClose={onClose} />

              {/* Swipe hint only shown before any scroll happens */}
              {clips.length > 1 && activeIdx === 0 && <SwipeHint />}

              {/* Vertical snap scroller. One panel per clip. */}
              <div
                ref={scrollerRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  scrollSnapType: 'y mandatory',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                  scrollbarWidth: 'none',
                }}
              >
                {clips.length === 0 ? (
                  <ReelPanel
                    active
                    poster={poster}
                    clip={null}
                    filter={filter}
                    firstFrom={firstFrom}
                    firstTo={firstTo}
                    handle={handle}
                    stats={stats}
                    t={t}
                    clipIndex={0}
                    totalClips={0}
                    onSelfEnded={() => {}}
                  />
                ) : (
                  clips.map((clip, i) => (
                    <ReelPanel
                      key={`${clip}-${i}`}
                      active={i === activeIdx}
                      poster={poster}
                      clip={clip}
                      filter={filter}
                      firstFrom={firstFrom}
                      firstTo={firstTo}
                      handle={handle}
                      stats={stats}
                      t={t}
                      clipIndex={i}
                      totalClips={clips.length}
                      onVisible={() => setActiveIdx(i)}
                      onSelfEnded={() => {
                        // Auto-scroll to next reel on end — mimics
                        // Instagram's natural advance behavior when a
                        // short clip finishes before the user swipes.
                        const el = scrollerRef.current;
                        if (!el) return;
                        if (i + 1 < clips.length) {
                          el.scrollTo({
                            top: (i + 1) * el.clientHeight,
                            behavior: 'smooth',
                          });
                        }
                      }}
                    />
                  ))
                )}

                {/* Trailing "Keep going →" panel — shows after the last
                    reel so she can exit with a clear CTA instead of
                    over-scrolling into nothingness. */}
                {clips.length > 0 && (
                  <EndPanel firstTo={firstTo} t={t} onClose={onClose} />
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReelPanel({
  active,
  poster,
  clip,
  filter,
  firstFrom,
  firstTo,
  handle,
  stats,
  t,
  clipIndex,
  totalClips,
  onVisible,
  onSelfEnded,
}: {
  active: boolean;
  poster: string;
  clip: string | null;
  filter: string;
  firstFrom: string;
  firstTo: string;
  handle: string;
  stats: SeededStats;
  t: TemplateDef;
  clipIndex: number;
  totalClips: number;
  onVisible?: () => void;
  onSelfEnded: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [liked, setLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [elapsedPct, setElapsedPct] = useState(0);

  const likeCount = stats.likes + (liked ? 1 : 0);

  // Play exactly the reel that is in view. IntersectionObserver root is
  // the scroll container (inferred by passing null — the observer walks
  // up looking for the nearest scrollable ancestor).
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const vis = e.intersectionRatio >= 0.6;
          setIsVisible(vis);
          if (vis) onVisible?.();
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [onVisible]);

  // Drive play/pause from visibility. Muted autoplay stays allowed on
  // all browsers without a gesture.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isVisible) {
      v.currentTime = 0;
      v.muted = true;
      void v.play().catch(() => {
        // Autoplay blocked despite muted — give up, user can swipe back.
      });
    } else {
      v.pause();
    }
  }, [isVisible]);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setElapsedPct(Math.min(100, (v.currentTime / v.duration) * 100));
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Media layer */}
      {clip ? (
        /* eslint-disable-next-line jsx-a11y/media-has-caption */
        <video
          ref={videoRef}
          src={clip}
          playsInline
          muted
          loop={totalClips === 1}
          preload={active ? 'auto' : 'metadata'}
          onTimeUpdate={onTimeUpdate}
          onEnded={onSelfEnded}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter,
            background: '#000',
          }}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={poster}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter,
          }}
        />
      )}

      {/* Per-panel progress bar (just this clip) */}
      <div
        style={{
          position: 'absolute',
          top: 54,
          left: 14,
          right: 14,
          height: 2,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.25)',
          overflow: 'hidden',
          zIndex: 3,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${elapsedPct}%`,
            background: '#fff',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Clip index pill */}
      {totalClips > 1 && (
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 10px',
            borderRadius: 99,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.4,
            zIndex: 3,
            fontFamily: t.fonts.body,
          }}
        >
          {clipIndex + 1} / {totalClips}
        </div>
      )}

      {/* Right-side action rail */}
      <div
        style={{
          position: 'absolute',
          right: 10,
          bottom: 130,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          color: '#fff',
          zIndex: 3,
          fontFamily: t.fonts.body,
        }}
      >
        <ActionButton
          onClick={() => setLiked((v) => !v)}
          icon={<HeartIcon filled={liked} accent={t.palette.accent} />}
          count={formatCount(likeCount)}
          highlight={liked}
        />
        <ActionButton icon={<CommentIcon />} count={formatCount(stats.comments)} />
        <ActionButton icon={<ShareIcon />} count={formatCount(stats.shares)} />
        <ActionButton icon={<MusicIcon />} />
      </div>

      {/* Bottom-left: collab handle + caption */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 90,
          bottom: 22,
          color: '#fff',
          fontFamily: t.fonts.body,
          zIndex: 3,
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CollabAvatar accent={t.palette.accent} accent2={t.palette.accent2} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                @{handle}
              </span>
              <span
                title="Collaboration"
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 99,
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(4px)',
                  fontWeight: 600,
                  letterSpacing: 0.4,
                }}
              >
                collab
              </span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
              {firstFrom} & {firstTo} · {formatCount(stats.views)} views
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.5,
            maxWidth: 320,
          }}
        >
          and then everything changed — softly, completely.
        </div>
        <div
          style={{
            fontSize: 11,
            opacity: 0.8,
            marginTop: 4,
            fontFamily: t.fonts.body,
          }}
        >
          #ourstory · {formatDate()}
        </div>
      </div>
    </div>
  );
}

function TopChrome({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff',
        zIndex: 5,
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 0.4,
          pointerEvents: 'auto',
        }}
      >
        Reels
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          width: 34,
          height: 34,
          borderRadius: 99,
          border: 'none',
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          fontSize: 20,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          pointerEvents: 'auto',
        }}
      >
        ×
      </button>
    </div>
  );
}

function SwipeHint() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      style={{
        position: 'absolute',
        bottom: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 6,
        color: '#fff',
        fontFamily: 'Inter, system-ui',
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        opacity: 0.9,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: 16 }}
      >
        ↑
      </motion.div>
      <span style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>Swipe up</span>
    </motion.div>
  );
}

function EndPanel({
  firstTo,
  t,
  onClose,
}: {
  firstTo: string;
  t: TemplateDef;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        scrollSnapAlign: 'start',
        background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 75%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        color: t.palette.text,
        textAlign: 'center',
        fontFamily: t.fonts.body,
      }}
    >
      <div
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 26,
          lineHeight: 1.3,
          maxWidth: 320,
          color: t.palette.text,
        }}
      >
        That&apos;s all, {firstTo}.
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 14,
          color: t.palette.muted,
          maxWidth: 280,
          lineHeight: 1.6,
        }}
      >
        There&apos;s one more thing I&apos;ve been waiting to ask you.
      </div>
      <button
        onClick={onClose}
        style={{
          marginTop: 28,
          padding: '12px 28px',
          borderRadius: 99,
          border: `1px solid ${t.palette.accent}`,
          background: withAlpha(t.palette.accent, 0.18),
          color: t.palette.text,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1.2,
          cursor: 'pointer',
          fontFamily: t.fonts.body,
          animation: 'pulseBreath 2.5s infinite',
        }}
      >
        Keep going →
      </button>
    </div>
  );
}

function ActionButton({
  icon,
  count,
  onClick,
  highlight,
}: {
  icon: React.ReactNode;
  count?: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        background: 'transparent',
        border: 'none',
        color: '#fff',
        cursor: onClick ? 'pointer' : 'default',
        padding: 0,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
          transform: highlight ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s',
        }}
      >
        {icon}
      </span>
      {count && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.3,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// --- Icons (unchanged from the prior pass) ---

function HeartIcon({ filled, accent }: { filled: boolean; accent: string }) {
  const fill = filled ? '#ff3b5c' : 'none';
  const stroke = filled ? '#ff3b5c' : '#fff';
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: filled ? `drop-shadow(0 0 10px ${accent})` : undefined }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function CollabAvatar({ accent, accent2 }: { accent: string; accent2: string }) {
  return (
    <div style={{ position: 'relative', width: 44, height: 32, flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 28,
          height: 28,
          borderRadius: 99,
          background: `linear-gradient(135deg, ${accent}, ${accent2})`,
          border: '2px solid #000',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 14,
          top: 0,
          width: 28,
          height: 28,
          borderRadius: 99,
          background: `linear-gradient(135deg, ${accent2}, ${accent})`,
          border: '2px solid #000',
        }}
      />
    </div>
  );
}

function videoFilter(t: VideoTreatmentId): string {
  if (t === 'vintage') return 'sepia(0.35) contrast(1.08)';
  if (t === 'dreamy') return 'brightness(1.08) saturate(1.05)';
  if (t === 'fullbleed') return 'none';
  return 'brightness(0.92)';
}

function firstName(full: string): string {
  const trimmed = full.trim();
  if (!trimmed) return 'you';
  return trimmed.split(/\s+/)[0];
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  if (n < 1_000_000) return `${Math.round(n / 1000)}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

function formatDate(): string {
  return new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  });
}

type SeededStats = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

function seededStats(seed: string): SeededStats {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const r = (offset: number) => {
    const x = Math.sin(h + offset) * 10000;
    return Math.abs(x - Math.floor(x));
  };
  return {
    views: 12_400 + Math.floor(r(1) * 88_000),
    likes: 1_800 + Math.floor(r(2) * 14_000),
    comments: 40 + Math.floor(r(3) * 460),
    shares: 12 + Math.floor(r(4) * 180),
  };
}
