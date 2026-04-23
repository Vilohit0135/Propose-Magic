'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateDef } from '@/lib/types';
import { withAlpha } from './bubbles';

// Drops a hidden YouTube embed iframe directly (no IFrame API JS bundle) and
// talks to it via postMessage. Skipping the API library shaves ~500-1500ms
// off cold-start because the iframe begins loading the moment React renders
// it — no round-trip to fetch/parse iframe_api.js.
//
// Starts muted so mobile browsers honor autoplay; unmutes on either (a) the
// first user gesture anywhere, or (b) the floating speaker pill above the
// heart button (fallback for iOS/Safari that refuse silent unmute). On first
// play, seeks to `startSeconds` via URL param; subsequent loops restart from
// zero (YouTube's default loop behavior on playlist=1).
export function BackgroundMusic({
  videoId,
  startSeconds,
  t,
}: {
  videoId: string;
  startSeconds: number | null;
  t: TemplateDef;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [unmuted, setUnmuted] = useState(false);

  const src = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: videoId,
      controls: '0',
      disablekb: '1',
      fs: '0',
      iv_load_policy: '3',
      modestbranding: '1',
      playsinline: '1',
      rel: '0',
      enablejsapi: '1',
    });
    if (typeof window !== 'undefined') {
      params.set('origin', window.location.origin);
    }
    if (startSeconds && startSeconds > 0) {
      params.set('start', String(startSeconds));
    }
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, startSeconds]);

  // Fire a YouTube iframe postMessage command. Format matches what the
  // IFrame API library sends internally.
  const command = (func: string, args: unknown[] = []) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        'https://www.youtube.com',
      );
    } catch {
      // Target origin mismatch is safe to swallow.
    }
  };

  const unmute = () => {
    command('unMute');
    command('setVolume', [55]);
    command('playVideo');
    setUnmuted(true);
  };

  // Auto-unmute on the first user gesture anywhere in the page. The
  // command is idempotent on the YouTube side, so we fire it once and
  // retry a few times in case the iframe hadn't finished loading yet.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let fired = false;

    const attempt = () => {
      command('unMute');
      command('setVolume', [55]);
      command('playVideo');
    };

    const onGesture = () => {
      if (fired) return;
      fired = true;
      attempt();
      setUnmuted(true);
      // Retry a few times — the iframe may still be initializing on the
      // YouTube side and silently drop early commands.
      let n = 0;
      const iv = window.setInterval(() => {
        n += 1;
        attempt();
        if (n >= 8) window.clearInterval(iv);
      }, 250);
    };

    document.addEventListener('pointerdown', onGesture);
    document.addEventListener('touchstart', onGesture, { passive: true });
    document.addEventListener('keydown', onGesture);
    return () => {
      document.removeEventListener('pointerdown', onGesture);
      document.removeEventListener('touchstart', onGesture);
      document.removeEventListener('keydown', onGesture);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          width: 1,
          height: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <iframe
          ref={iframeRef}
          src={src}
          title=""
          width={1}
          height={1}
          allow="autoplay; encrypted-media"
          style={{ border: 0 }}
        />
      </div>
      {!unmuted && (
        <button
          onClick={unmute}
          aria-label="Turn on sound"
          title="Turn on sound"
          style={{
            position: 'fixed',
            bottom: 88,
            right: 18,
            zIndex: 180,
            width: 42,
            height: 42,
            padding: 0,
            borderRadius: '50%',
            border: `1px solid ${withAlpha(t.palette.accent, 0.7)}`,
            background: withAlpha(t.palette.accent, 0.22),
            color: t.palette.text,
            fontSize: 16,
            cursor: 'pointer',
            fontFamily: t.fonts.body,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: `0 4px 14px ${withAlpha(t.palette.accent, 0.4)}`,
            animation: 'pulseBreath 2.4s infinite',
          }}
        >
          🔊
        </button>
      )}
    </>
  );
}
