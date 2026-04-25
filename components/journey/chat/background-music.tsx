'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { TemplateDef } from '@/lib/types';
import { withAlpha } from './bubbles';

// Uses YouTube's official IFrame Player API. Earlier revisions used a
// direct iframe + raw postMessage, which was faster to cold-start but
// dropped commands silently when the iframe wasn't ready — which caused
// two recurring bugs:
//   - `seekTo(startSeconds)` never landed, so songs always played from 0.
//   - mute/unmute pill taps did nothing because the postMessage reached
//     YouTube before the player was listening.
// The API library wraps all this with onReady + isMuted etc. that we can
// trust. Cost: ~500-1000ms script download on cold load, which is
// imperceptible given the background song isn't the first thing she's
// watching anyway.

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (v: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy?: () => void;
};

type YTPlayerOptions = {
  videoId: string;
  height?: string | number;
  width?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (e: { target: YTPlayer }) => void;
    onStateChange?: (e: { data: number; target: YTPlayer }) => void;
    onError?: (e: { data: number }) => void;
  };
};

type YTNamespace = {
  Player: new (
    element: string | HTMLElement,
    options: YTPlayerOptions,
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function BackgroundMusic({
  videoId,
  startSeconds,
  t,
}: {
  videoId: string;
  startSeconds: number | null;
  t: TemplateDef;
}) {
  const containerId = useRef(`bgm-${Math.random().toString(36).slice(2, 9)}`);
  const playerRef = useRef<YTPlayer | null>(null);
  const mountedRef = useRef(false);
  // `muted` reflects the *player's* actual mute state. `userMutedRef`
  // latches true when the receiver explicitly mutes via the pill — the
  // background gesture listeners respect that and stop fighting her.
  // `wantsAudioRef` flips true on the very first user gesture (typically
  // the entry-gate tap). When the player finally becomes ready, if this
  // flag is set we start UNMUTED — the gesture has already given us
  // permission. Without this, players that finished loading after the
  // gate tap would stay muted forever because no fresh gesture was
  // available to unmute.
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const userMutedRef = useRef(false);
  const wantsAudioRef = useRef(false);

  useEffect(() => {
    if (!videoId || typeof window === 'undefined') return;
    mountedRef.current = true;

    const createPlayer = () => {
      if (!mountedRef.current) return;
      const YT = window.YT;
      if (!YT) return;
      try {
        playerRef.current = new YT.Player(containerId.current, {
          videoId,
          height: 1,
          width: 1,
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              setReady(true);
              try {
                // Seek first so the song begins at the chosen timestamp
                // rather than zero (only on first play; loop wrap is
                // handled in onStateChange below).
                if (startSeconds && startSeconds > 0) {
                  target.seekTo(startSeconds, true);
                }
                // Decide whether to start with sound. If the user has
                // already tapped the entry gate (or anywhere) before the
                // player finished loading, that gesture grants us audio
                // permission — start unmuted so she doesn't have to
                // reach for the pill. Otherwise, stay muted and rely on
                // the next gesture to unmute via the listeners below.
                if (wantsAudioRef.current && !userMutedRef.current) {
                  target.unMute();
                  target.setVolume(55);
                  setMuted(false);
                }
                target.playVideo();
              } catch {
                // Player sometimes throws before it has a media element;
                // the gesture listeners will retry below.
              }
            },
            onStateChange: ({ data, target }) => {
              // 1 = playing, 0 = ended.
              if (data === 1) {
                // Sync our muted flag with the player's actual state —
                // browsers sometimes force-mute autoplay even though we
                // asked for unmute, and we want the pill to reflect the
                // real audio state.
                try {
                  setMuted(target.isMuted());
                } catch {
                  // ignore
                }
              }
              if (data === 0 && startSeconds && startSeconds > 0) {
                // When the loop wraps, YouTube's default is to restart
                // from 0. Force the seek so *every* repeat begins at
                // the sender's chosen timestamp — not just the first.
                try {
                  target.seekTo(startSeconds, true);
                  target.playVideo();
                } catch {
                  // ignore
                }
              }
            },
            onError: () => {
              // Embed disabled / region-blocked / video removed. Nothing
              // we can do from here; the rest of the page still works.
            },
          },
        });
      } catch {
        // Init error — chat still works without music.
      }
    };

    if (!window.YT?.Player) {
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevReady?.();
        createPlayer();
      };
      if (!document.querySelector('script[data-yt-iframe-api]')) {
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        s.async = true;
        s.setAttribute('data-yt-iframe-api', '');
        document.head.appendChild(s);
      }
    } else {
      createPlayer();
    }

    // Gesture-driven unmute — covers the browser autoplay policy. We
    // respect userMutedRef so this doesn't keep flipping audio back on
    // after the receiver has explicitly silenced it.
    const attemptUnmute = () => {
      const p = playerRef.current;
      if (!p || userMutedRef.current) return;
      try {
        p.unMute();
        p.setVolume(55);
        p.playVideo();
        setMuted(false);
      } catch {
        // player not ready yet
      }
    };

    const onGesture = () => {
      // Latch consent. Even if the player isn't ready yet, onReady
      // (whenever it fires) will read this flag and start unmuted.
      if (!userMutedRef.current) wantsAudioRef.current = true;
      attemptUnmute();
      // Retry for ~1.5s in case the player wasn't ready on the first
      // gesture (common on the entry-gate tap).
      [200, 500, 900, 1500].forEach((ms) => {
        window.setTimeout(attemptUnmute, ms);
      });
    };

    const events: Array<[keyof DocumentEventMap, AddEventListenerOptions?]> = [
      ['pointerdown'],
      ['touchstart', { passive: true }],
      ['click'],
      ['keydown'],
    ];
    events.forEach(([name, opts]) =>
      document.addEventListener(name, onGesture, opts),
    );

    return () => {
      mountedRef.current = false;
      events.forEach(([name, opts]) =>
        document.removeEventListener(name, onGesture, opts),
      );
      try {
        playerRef.current?.destroy?.();
      } catch {
        // already destroyed
      }
      playerRef.current = null;
    };
  }, [videoId, startSeconds]);

  const mute = () => {
    setMuted(true);
    userMutedRef.current = true;
    wantsAudioRef.current = false;
    try {
      playerRef.current?.mute();
      // Belt-and-braces: pause then resume to ensure the mute commits
      // even if the player is in a transitional state.
      playerRef.current?.pauseVideo?.();
      playerRef.current?.playVideo?.();
    } catch {
      // player not ready — state flip is still correct for UI, and the
      // autoplay listener respects userMutedRef so audio stays silent.
    }
  };

  const unmute = () => {
    setMuted(false);
    userMutedRef.current = false;
    wantsAudioRef.current = true;
    try {
      const p = playerRef.current;
      if (p) {
        p.unMute();
        p.setVolume(55);
        p.playVideo();
      }
    } catch {
      // ignore
    }
  };

  const toggleMute = () => {
    if (muted) unmute();
    else mute();
  };

  return (
    <>
      {/* Hidden player container off-screen. The YT.Player replaces this
          div with an <iframe> on mount. */}
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
        <div id={containerId.current} />
      </div>
      {/* Persistent mute/unmute pill. Disabled while the player is
          loading so taps during cold-start don't no-op silently — she
          sees it's not ready yet. */}
      <button
        onClick={toggleMute}
        disabled={!ready}
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
          cursor: ready ? 'pointer' : 'wait',
          opacity: ready ? 1 : 0.5,
          fontFamily: t.fonts.body,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: `0 4px 14px ${withAlpha(t.palette.accent, muted ? 0.4 : 0.2)}`,
          animation: muted && ready ? 'pulseBreath 2.4s infinite' : undefined,
          transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s, opacity 0.2s',
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
