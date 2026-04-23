'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import type { OrderState, SubFlow, TemplateDef } from '@/lib/types';
import { withAlpha } from './bubbles';

export function YesCard({
  state,
  sub,
  t,
  hearts,
  reactions,
  startTime,
}: {
  state: OrderState;
  sub: SubFlow;
  t: TemplateDef;
  hearts: number;
  reactions: string[];
  startTime: number;
}) {
  const [showCTA, setShowCTA] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);
  const [saveBusy, setSaveBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const t1 = setTimeout(() => setShowCTA(true), 1800);
    const t2 = setTimeout(() => setShowReply(true), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const mins = Math.max(1, Math.round((Date.now() - startTime) / 60000));
  const firstTo = state.toName.trim().split(/\s+/)[0] || 'they';
  const firstFrom = state.fromName.trim().split(/\s+/)[0] || 'someone';
  const headline = `${firstTo} said YES! ${sub.particle}`;

  // Native share → system sheet on mobile, fall back to copying the URL.
  // Using the current page URL (not a synthetic link) so whoever opens the
  // shared link lands on exactly this receiver page.
  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = `${firstTo} said yes`;
    const text = `${firstTo} said YES to ${firstFrom} ${sub.particle}`;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, text, url });
        return;
      }
    } catch {
      // User dismissed the share sheet — don't treat as error.
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareHint('Link copied');
      setTimeout(() => setShareHint(null), 2000);
    } catch {
      setShareHint("Couldn't copy — long-press the URL bar instead");
      setTimeout(() => setShareHint(null), 2500);
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current || saveBusy) return;
    setSaveBusy(true);
    try {
      const { toPng } = await import('html-to-image');
      // skipFonts: true dodges the cross-origin cssRules error from Google
      // Fonts that was silently killing the export. The PNG renders with
      // system font fallbacks but actually saves reliably across browsers.
      // filter: strips <link> tags from the cloned subtree so remote
      // stylesheet fetches don't block serialization either.
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        backgroundColor: t.palette.bg,
        filter: (node) => {
          if (node instanceof HTMLElement) {
            if (node.tagName === 'LINK') return false;
            if (node.tagName === 'STYLE' && node.innerHTML.includes('@import')) {
              return false;
            }
          }
          return true;
        },
      });
      const link = document.createElement('a');
      link.download = `${firstTo}-said-yes.png`;
      link.href = dataUrl;
      // Some browsers require the anchor to be in the DOM to trigger download.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('[YesCard] save image failed', err);
      setShareHint("Couldn't save — try a screenshot");
      setTimeout(() => setShareHint(null), 2500);
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 170,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        overflow: 'hidden',
      }}
    >
      <Confetti t={t} />
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 22, delay: 0.15 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 400,
          padding: '36px 28px 28px',
          borderRadius: 26,
          background: `linear-gradient(165deg, ${t.palette.bg2}, ${t.palette.bg})`,
          color: t.palette.text,
          border: `1px solid ${withAlpha(t.palette.accent, 0.45)}`,
          boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 80px ${withAlpha(
            t.palette.accent,
            0.35,
          )}`,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          style={{
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 34,
            lineHeight: 1.1,
            color: t.palette.text,
            textShadow: `0 0 30px ${withAlpha(t.palette.accent, 0.6)}`,
          }}
        >
          {headline}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
            marginTop: 22,
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 20,
            color: t.palette.accent,
          }}
        >
          {state.fromName}{' '}
          <span style={{ fontSize: 14, opacity: 0.6 }}>&</span> {state.toName}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          style={{
            fontFamily: t.fonts.body,
            fontSize: 10,
            letterSpacing: 3,
            color: t.palette.muted,
            marginTop: 10,
          }}
        >
          {formatToday()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          style={{
            marginTop: 22,
            padding: '12px 14px',
            background: withAlpha(t.palette.text, 0.06),
            border: `1px solid ${withAlpha(t.palette.text, 0.12)}`,
            borderRadius: 12,
            fontSize: 12,
            color: t.palette.text,
            lineHeight: 1.55,
            fontFamily: t.fonts.body,
          }}
        >
          You took {mins} min · Sent {hearts} hearts
          {reactions.length > 0 &&
            ` · Reacted with ${[...new Set(reactions)].slice(0, 3).join('')}`}
        </motion.div>

        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              marginTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <button
              onClick={handleShare}
              style={{
                padding: '14px 20px',
                borderRadius: 99,
                border: 'none',
                background: `linear-gradient(90deg, ${t.palette.accent}, ${t.palette.accent2})`,
                color: t.palette.bg,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: `0 0 30px ${withAlpha(t.palette.accent, 0.5)}`,
                fontFamily: t.fonts.body,
              }}
            >
              Share this moment →
            </button>
            <button
              onClick={handleSaveImage}
              disabled={saveBusy}
              style={{
                padding: '12px 20px',
                borderRadius: 99,
                border: `1px solid ${withAlpha(t.palette.text, 0.2)}`,
                background: withAlpha(t.palette.text, 0.04),
                color: t.palette.text,
                fontSize: 13,
                cursor: saveBusy ? 'default' : 'pointer',
                opacity: saveBusy ? 0.6 : 1,
                fontFamily: t.fonts.body,
              }}
            >
              {saveBusy ? 'Saving…' : 'Save as image'}
            </button>
            {shareHint && (
              <div
                style={{
                  fontSize: 11,
                  color: t.palette.muted,
                  textAlign: 'center',
                  marginTop: -2,
                  fontFamily: t.fonts.body,
                }}
              >
                {shareHint}
              </div>
            )}
          </motion.div>
        )}

        {showReply && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{ marginTop: 16 }}
          >
            <Link
              href="/create"
              style={{
                display: 'inline-block',
                padding: '10px 18px',
                borderRadius: 99,
                border: `1px dashed ${withAlpha(t.palette.text, 0.3)}`,
                background: 'transparent',
                color: t.palette.accent,
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: t.fonts.body,
                textDecoration: 'none',
              }}
            >
              Now surprise them back — Create yours free →
            </Link>
          </motion.div>
        )}

        <div
          style={{
            marginTop: 20,
            fontSize: 10,
            color: t.palette.muted,
            opacity: 0.6,
            letterSpacing: 0.3,
            fontFamily: t.fonts.body,
          }}
        >
          Made with ProposeMagic ♥
        </div>
      </motion.div>
    </motion.div>
  );
}

function formatToday(): string {
  const d = new Date();
  return d
    .toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase();
}

function Confetti({ t }: { t: TemplateDef }) {
  const pieces = Array.from({ length: 28 });
  const colors = [
    t.palette.accent,
    t.palette.accent2 || t.palette.accent,
    '#fff',
    t.palette.text,
  ];
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {pieces.map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: -20,
            width: 6 + Math.random() * 6,
            height: 10 + Math.random() * 8,
            background: colors[i % colors.length],
            animation: `confettiFall ${2 + Math.random() * 3}s ${Math.random() * 1}s linear forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}
