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
  // `muted` is the actual audio state of the iframe player. Starts true
  // because we spawn the iframe with mute=1 so autoplay is honored. The
  // first user gesture flips it via the effect below. The floating
  // speaker pill is always visible so the receiver can toggle at will.
  const [muted, setMuted] = useState(true);
  // Mirrors `muted` so the long-lived gesture-listener effect below can
  // read the current state without re-subscribing on every change.
  // Specifically: once the user explicitly mutes via the pill, we stop
  // re-unmuting them on every subsequent tap.
  const userMutedRef = useRef(false);

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
    setMuted(false);
    // User re-enabled audio explicitly — clear the latch so casual
    // gestures can keep the song unmuted if something pauses it later.
    userMutedRef.current = false;
  };

  const mute = () => {
    command('mute');
    setMuted(true);
    // Latch so the gesture listeners below stop fighting the user's
    // deliberate mute. The pill is the only way to unmute after this.
    userMutedRef.current = true;
  };

  const toggleMute = () => {
    if (muted) unmute();
    else mute();
  };

  // Try to unmute as early as possible. Strategy:
  //   1. On mount, optimistically fire unmute — works on Chrome desktop
  //      when the site has a high MEI score, on Android Chrome when the
  //      receiver arrived via a click (carried-over user activation), and
  //      in Edge/Opera under similar conditions.
  //   2. Listen for anything vaguely engagement-like — pointerdown, touch,
  //      click, scroll, mousemove, wheel, keydown. The first one fires the
  //      real unmute. iOS Safari still requires an actual tap, no way
  //      around that — but on any other browser, casual interaction is
  //      enough.
  //   3. Retry for ~2s after each attempt, since the iframe often drops
  //      commands issued before YouTube finishes loading on its side.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const retryTimers: number[] = [];

    const attempt = () => {
      command('unMute');
      command('setVolume', [55]);
      command('playVideo');
    };

    // Every gesture re-asserts unmuted playback — unless the user has
    // explicitly silenced it via the pill (tracked via userMutedRef).
    // This means the entry-gate tap, the ready-check tap, the letter
    // close, and casual scrolling all get a fresh chance at unmuting,
    // which covers the case where the iframe wasn't ready on the very
    // first gesture.
    const fire = () => {
      if (userMutedRef.current) return;
      attempt();
      setMuted(false);
      [180, 420, 900].forEach((ms) => {
        retryTimers.push(window.setTimeout(attempt, ms));
      });
    };

    // Optimistic tries on mount — harmless if the browser blocks them.
    const earlyTries: number[] = [];
    [600, 1400, 2400].forEach((ms) => {
      earlyTries.push(window.setTimeout(attempt, ms));
    });

    const events: Array<[keyof DocumentEventMap, AddEventListenerOptions?]> = [
      ['pointerdown'],
      ['touchstart', { passive: true }],
      ['click'],
      ['keydown'],
      ['mousemove'],
      ['wheel', { passive: true }],
      ['scroll', { passive: true, capture: true }],
    ];
    events.forEach(([name, opts]) =>
      document.addEventListener(name, fire, opts),
    );

    return () => {
      earlyTries.forEach((id) => window.clearTimeout(id));
      retryTimers.forEach((id) => window.clearTimeout(id));
      events.forEach(([name, opts]) =>
        document.removeEventListener(name, fire, opts),
      );
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
      {/* Persistent mute/unmute pill. Stays visible the whole time the
          receiver is on the page so she can quiet the song any time. */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Turn on sound' : 'Mute sound'}
        aria-pressed={!muted}
        title={muted ? 'Turn on sound' : 'Mute'}
        style={{
          position: 'fixed',
          bottom: 88,
          right: 18,
          zIndex: 180,
          width: 42,
          height: 42,
          padding: 0,
          borderRadius: '50%',
          border: `1px solid ${withAlpha(t.palette.accent, muted ? 0.7 : 0.4)}`,
          background: withAlpha(t.palette.accent, muted ? 0.22 : 0.12),
          color: t.palette.text,
          fontSize: 16,
          cursor: 'pointer',
          fontFamily: t.fonts.body,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: `0 4px 14px ${withAlpha(t.palette.accent, muted ? 0.4 : 0.2)}`,
          // Pulse only while muted — once audio is flowing, the button
          // becomes a quiet background control that doesn't demand
          // attention.
          animation: muted ? 'pulseBreath 2.4s infinite' : undefined,
          transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
      </button>
    </>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
