'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { TemplateDef, PhotoLayoutId, VideoTreatmentId } from '@/lib/types';
import { RevealingName } from './identity-reveal';
import {
  FilmstripLayout,
  GridLayout,
  PolaroidLayout,
  SlideshowLayout,
} from '../scenes-1-4';

function incomingBubbleStyle(t: TemplateDef): React.CSSProperties {
  return {
    background: withAlpha(t.palette.accent2, 0.1),
    border: `1px solid ${withAlpha(t.palette.text, 0.09)}`,
    color: t.palette.text,
    backdropFilter: 'blur(10px)',
    borderRadius: 18,
    padding: '12px 16px',
    maxWidth: '78%',
    fontFamily: t.fonts.body,
    fontSize: 14.5,
    lineHeight: 1.5,
    wordBreak: 'break-word',
  };
}

function BubbleRow({
  children,
  align = 'left',
  style,
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        padding: '0 14px',
        animation: 'bubbleIn 0.45s cubic-bezier(.2,.9,.3,1.1) both',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function TextBubble({
  text,
  t,
  italic,
  emphasis,
}: {
  text: string;
  t: TemplateDef;
  italic?: boolean;
  emphasis?: boolean;
}) {
  return (
    <BubbleRow>
      <div
        style={{
          ...incomingBubbleStyle(t),
          fontFamily: emphasis ? t.fonts.display : t.fonts.body,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: emphasis ? 20 : 14.5,
          letterSpacing: emphasis ? 0.3 : 0,
        }}
      >
        {text}
      </div>
    </BubbleRow>
  );
}

export function PhotoBubble({ url, t }: { url: string; t: TemplateDef }) {
  return (
    <BubbleRow>
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${withAlpha(t.palette.text, 0.12)}`,
          background: withAlpha(t.palette.accent2, 0.08),
          maxWidth: 240,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          style={{
            display: 'block',
            width: '100%',
            maxHeight: 300,
            objectFit: 'cover',
          }}
        />
      </div>
    </BubbleRow>
  );
}

export function PhotoAlbumBubble({
  urls,
  layout,
  t,
  onOpen,
}: {
  urls: string[];
  layout: PhotoLayoutId;
  t: TemplateDef;
  onOpen: () => void;
}) {
  const preview = urls.slice(0, 4);
  const extra = Math.max(0, urls.length - 4);
  return (
    <BubbleRow>
      <button
        onClick={onOpen}
        style={{
          padding: 8,
          borderRadius: 18,
          border: `1px solid ${withAlpha(t.palette.text, 0.12)}`,
          background: withAlpha(t.palette.accent2, 0.1),
          cursor: 'pointer',
          maxWidth: 260,
          fontFamily: t.fonts.body,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 4,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {preview.map((u, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={u}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: layout === 'filmstrip' ? 'sepia(0.2) saturate(1.1)' : 'none',
                }}
              />
              {i === 3 && extra > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.55)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  +{extra}
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: t.palette.muted,
            textAlign: 'center',
          }}
        >
          Tap to see all {urls.length}
        </div>
      </button>
    </BubbleRow>
  );
}

export function VideoBubble({
  url,
  videoUrl,
  treatment,
  t,
}: {
  url: string;
  videoUrl: string | null;
  treatment: VideoTreatmentId;
  t: TemplateDef;
}) {
  const filter =
    treatment === 'vintage'
      ? 'sepia(0.4) contrast(1.1)'
      : treatment === 'dreamy'
        ? 'blur(2px) brightness(1.1)'
        : treatment === 'fullbleed'
          ? 'none'
          : 'brightness(0.85)';

  const [playing, setPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const startPlayback = () => {
    if (!videoUrl) return;
    setPlaying(true);
    // Small tick so the element mounts before we call play().
    requestAnimationFrame(() => {
      void videoRef.current?.play();
    });
  };

  return (
    <BubbleRow>
      <div
        style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${withAlpha(t.palette.text, 0.12)}`,
          background: '#000',
          maxWidth: 260,
        }}
      >
        {playing && videoUrl ? (
          /* eslint-disable-next-line jsx-a11y/media-has-caption */
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            style={{
              display: 'block',
              width: '100%',
              maxHeight: 320,
              objectFit: 'cover',
              filter,
            }}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              style={{
                display: 'block',
                width: '100%',
                maxHeight: 320,
                objectFit: 'cover',
                filter,
              }}
            />
            {treatment === 'letterbox' && (
              <>
                <div style={letterboxBar(true)} />
                <div style={letterboxBar(false)} />
              </>
            )}
            <button
              onClick={startPlayback}
              disabled={!videoUrl}
              aria-label={videoUrl ? 'Play video' : 'Video preview'}
              style={{
                position: 'absolute',
                inset: 0,
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: videoUrl ? 'pointer' : 'default',
              }}
            >
              <span
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 99,
                  background: 'rgba(0,0,0,0.55)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                ▶
              </span>
            </button>
            {!videoUrl && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 10,
                  fontSize: 10,
                  letterSpacing: 1.5,
                  color: '#fff',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                0:47
              </div>
            )}
          </>
        )}
      </div>
    </BubbleRow>
  );
}

function letterboxBar(top: boolean): React.CSSProperties {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    [top ? 'top' : 'bottom']: 0,
    height: '12%',
    background: '#000',
  };
}

export function LetterBubble({
  text,
  signatureName,
  anonSignature,
  t,
  onReact,
}: {
  text: string;
  signatureName: string;
  anonSignature: boolean;
  t: TemplateDef;
  onReact: (emoji: string) => void;
}) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(iv);
  }, [text]);

  const handleReact = (emoji: string) => {
    setPicked(emoji);
    onReact(emoji);
  };

  return (
    <BubbleRow>
      <div
        style={{
          ...incomingBubbleStyle(t),
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 17,
          lineHeight: 1.65,
          maxWidth: '86%',
          padding: '18px 20px',
          position: 'relative',
          userSelect: 'text',
          WebkitUserSelect: 'text',
        }}
      >
        <span style={{ whiteSpace: 'pre-wrap' }}>{typed}</span>
        {!done && (
          <span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>|</span>
        )}
        {done && (
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              color: t.palette.accent,
              textAlign: 'right',
              opacity: done ? 1 : 0,
              transition: 'opacity 0.6s',
            }}
          >
            — <RevealingName
              name={signatureName}
              reveal={!anonSignature}
              color={t.palette.accent}
              accent={t.palette.accent}
            />
          </div>
        )}
        {done && (
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginTop: 12,
              flexWrap: 'wrap',
              animation: 'fadeInUp 0.5s both',
            }}
          >
            {['😍', '🥹', '💕', '😭', '🤗'].map((e) => (
              <button
                key={e}
                onClick={() => handleReact(e)}
                aria-label={`React ${e}`}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 99,
                  border: `1px solid ${withAlpha(t.palette.text, 0.1)}`,
                  background:
                    picked === e
                      ? withAlpha(t.palette.accent, 0.25)
                      : withAlpha(t.palette.accent2, 0.08),
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.2s',
                  transform: picked === e ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        )}
        {picked && done && (
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              right: 14,
              background: t.palette.bg,
              border: `1px solid ${withAlpha(t.palette.text, 0.12)}`,
              borderRadius: 99,
              padding: '2px 8px',
              fontSize: 12,
              animation: 'bubbleIn 0.4s both',
            }}
          >
            {picked}
          </div>
        )}
      </div>
    </BubbleRow>
  );
}

export function ChapterTitle({ text, t }: { text: string; t: TemplateDef }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease: [0.2, 0.9, 0.3, 1] }}
      style={{
        padding: '28px 18px 8px',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, letterSpacing: '1px' }}
        animate={{ opacity: 1, letterSpacing: '4px' }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          fontSize: 10,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: t.palette.accent,
          marginBottom: 10,
          fontFamily: t.fonts.body,
        }}
      >
        Chapter one
      </motion.div>
      <div
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 30,
          lineHeight: 1.15,
          color: t.palette.text,
          textShadow: `0 0 30px ${withAlpha(t.palette.accent, 0.35)}`,
        }}
      >
        {text}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        style={{
          width: 48,
          height: 1,
          background: t.palette.accent,
          margin: '18px auto 0',
          opacity: 0.6,
          transformOrigin: 'center',
        }}
      />
    </motion.div>
  );
}

export function InlineGallery({
  urls,
  layout,
  t: _t,
}: {
  urls: string[];
  layout: PhotoLayoutId;
  t: TemplateDef;
}) {
  const photos = urls.length ? urls : [];
  if (photos.length === 0) return null;
  // Polaroid and filmstrip are horizontal rows that own their own scroll — let
  // them use the full chat width. Slideshow and grid stay centered.
  const fullBleed = layout === 'polaroid' || layout === 'filmstrip';
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.0, delay: 0.2, ease: [0.2, 0.8, 0.3, 1] }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: fullBleed ? '8px 0 24px' : '8px 14px 24px',
        minHeight:
          layout === 'polaroid'
            ? 210
            : layout === 'slideshow'
              ? 340
              : layout === 'grid'
                ? 300
                : 220,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: fullBleed ? undefined : 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {layout === 'polaroid' && <PolaroidLayout photos={photos} />}
        {layout === 'slideshow' && <SlideshowLayout photos={photos} />}
        {layout === 'filmstrip' && <FilmstripLayout photos={photos} />}
        {layout === 'grid' && <GridLayout photos={photos} />}
      </div>
    </motion.div>
  );
}

export function ContactCardBubble({
  title,
  subtitle,
  t,
  onTap,
}: {
  title: string;
  subtitle: string;
  t: TemplateDef;
  onTap: () => void;
}) {
  return (
    <BubbleRow>
      <button
        onClick={onTap}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 18,
          border: `1px solid ${t.palette.accent}`,
          background: withAlpha(t.palette.accent, 0.12),
          color: t.palette.text,
          cursor: 'pointer',
          fontFamily: t.fonts.body,
          textAlign: 'left',
          maxWidth: '78%',
          animation: 'pulseBreath 2.5s infinite',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 99,
            background: withAlpha(t.palette.accent, 0.25),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            filter: 'blur(4px)',
            border: `1px solid ${t.palette.accent}`,
          }}
        >
          ?
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11, color: t.palette.muted, marginTop: 2 }}>
            {subtitle} →
          </div>
        </div>
      </button>
    </BubbleRow>
  );
}

export function ReadyCheckBubble({
  t,
  onConfirm,
}: {
  t: TemplateDef;
  onConfirm: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const choose = (label: string) => {
    if (picked) return;
    setPicked(label);
    setTimeout(onConfirm, 450);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '8px 14px 4px',
        alignItems: 'flex-end',
        width: '100%',
      }}
    >
      {['Yes', 'Of course, yes'].map((label, i) => {
        const isPicked = picked === label;
        return (
          <motion.button
            key={label}
            onClick={() => choose(label)}
            disabled={!!picked}
            initial={{ opacity: 0, x: 12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.25 + i * 0.18 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px 22px',
              borderRadius: 22,
              border: `1px solid ${t.palette.accent}`,
              background: isPicked
                ? t.palette.accent
                : withAlpha(t.palette.accent, 0.15),
              color: isPicked ? t.palette.bg : t.palette.text,
              fontFamily: t.fonts.body,
              fontSize: 14,
              fontWeight: 600,
              cursor: picked ? 'default' : 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 6px 18px ${withAlpha(t.palette.accent, 0.28)}`,
              transition: 'background 0.2s, color 0.2s',
              animation: picked
                ? undefined
                : `pulseBreath ${2.6 + i * 0.3}s infinite`,
            }}
          >
            {label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export function SystemBubble({ text, t }: { text: string; t: TemplateDef }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '8px 14px',
        fontSize: 10,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: t.palette.muted,
        fontFamily: t.fonts.body,
        animation: 'fadeInUp 0.5s both',
      }}
    >
      {text}
    </div>
  );
}

export function TypingDots({ t }: { t: TemplateDef }) {
  return (
    <BubbleRow>
      <div
        style={{
          ...incomingBubbleStyle(t),
          padding: '12px 16px',
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          minWidth: 56,
          animation: 'bubbleIn 0.3s both',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: t.palette.text,
              opacity: 0.5,
              animation: `typingBounce 1.2s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </BubbleRow>
  );
}

export function HeartReplyBubble({ t }: { t: TemplateDef }) {
  return (
    <BubbleRow align="right">
      <div
        style={{
          padding: '10px 14px',
          borderRadius: 18,
          background: withAlpha(t.palette.accent, 0.3),
          border: `1px solid ${t.palette.accent}`,
          color: t.palette.accent,
          fontSize: 20,
        }}
      >
        ♥
      </div>
    </BubbleRow>
  );
}

export function SectionChip({
  label,
  t,
  onTap,
}: {
  label: string;
  t: TemplateDef;
  onTap: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '14px 0 8px',
      }}
    >
      <button
        onClick={onTap}
        style={{
          padding: '10px 22px',
          borderRadius: 99,
          background: withAlpha(t.palette.accent, 0.12),
          border: `1px solid ${t.palette.accent}`,
          color: t.palette.text,
          fontSize: 12,
          letterSpacing: 1.5,
          fontFamily: t.fonts.body,
          cursor: 'pointer',
          animation: 'pulseBreath 2.2s infinite, fadeInUp 0.5s both',
          boxShadow: `0 0 20px ${withAlpha(t.palette.accent, 0.4)}`,
        }}
      >
        {label} ↓
      </button>
    </div>
  );
}

// Utility: take a hex color and apply alpha (treating it as rgb hex).
// Falls back to rgba(255,255,255,a) if it can't parse.
export function withAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(255,255,255,${alpha})`;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
