'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { OrderState } from '@/lib/types';
import { formatTimeMmSs, parseTimeString, parseYouTubeUrl } from '@/lib/youtube';
import { SectionLabel } from './creation-flow';

type SetState = React.Dispatch<React.SetStateAction<OrderState>>;

type OEmbed = {
  title: string;
  author_name: string;
  thumbnail_url: string;
};

export function MusicUrlInput({
  state,
  setState,
}: {
  state: OrderState;
  setState: SetState;
}) {
  const [info, setInfo] = useState<OEmbed | null>(null);
  const [checking, setChecking] = useState(false);
  const [invalid, setInvalid] = useState(false);
  // Local string mirror of musicStartSeconds so the user can type freely
  // (e.g. "1:30") without clearing partial input on every keystroke.
  const [startField, setStartField] = useState<string>(
    state.musicStartSeconds != null ? formatTimeMmSs(state.musicStartSeconds) : '',
  );
  const [startInvalid, setStartInvalid] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // URL changes → extract ID + auto-populate startSeconds from t= / start=.
  useEffect(() => {
    abortRef.current?.abort();
    const url = state.musicUrl.trim();
    if (!url) {
      setInfo(null);
      setInvalid(false);
      setChecking(false);
      setStartField('');
      setStartInvalid(false);
      setState((s) =>
        s.musicVideoId || s.musicStartSeconds
          ? { ...s, musicVideoId: null, musicStartSeconds: null }
          : s,
      );
      return;
    }

    const parsed = parseYouTubeUrl(url);
    if (!parsed) {
      setInfo(null);
      setInvalid(true);
      setChecking(false);
      setState((s) =>
        s.musicVideoId || s.musicStartSeconds
          ? { ...s, musicVideoId: null, musicStartSeconds: null }
          : s,
      );
      return;
    }

    setInvalid(false);
    setState((s) => {
      const nextId = parsed.id;
      const nextStart = parsed.startSeconds;
      if (s.musicVideoId === nextId && s.musicStartSeconds === nextStart) return s;
      return { ...s, musicVideoId: nextId, musicStartSeconds: nextStart };
    });
    setStartField(
      parsed.startSeconds != null ? formatTimeMmSs(parsed.startSeconds) : '',
    );
    setStartInvalid(false);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setChecking(true);

    const timer = setTimeout(async () => {
      try {
        const resp = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(
            `https://www.youtube.com/watch?v=${parsed.id}`,
          )}&format=json`,
          { signal: ctrl.signal },
        );
        if (!resp.ok) throw new Error('oembed_failed');
        const data = (await resp.json()) as OEmbed;
        if (!ctrl.signal.aborted) setInfo(data);
      } catch {
        if (!ctrl.signal.aborted) setInfo(null);
      } finally {
        if (!ctrl.signal.aborted) setChecking(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
    // We intentionally only react to musicUrl — start field has its own effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.musicUrl]);

  const commitStartField = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setStartInvalid(false);
      setState((s) =>
        s.musicStartSeconds == null ? s : { ...s, musicStartSeconds: null },
      );
      return;
    }
    const parsed = parseTimeString(trimmed);
    if (parsed == null) {
      setStartInvalid(true);
      return;
    }
    setStartInvalid(false);
    setState((s) =>
      s.musicStartSeconds === parsed ? s : { ...s, musicStartSeconds: parsed },
    );
  };

  return (
    <div>
      <SectionLabel>Background song (optional)</SectionLabel>
      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: '#faf7ff',
          border: '1px solid #e4dbf5',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
          🎵 Play a song in the background
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#666',
            marginTop: 3,
            lineHeight: 1.5,
          }}
        >
          Paste a YouTube link and the song plays softly while she reads. Starts
          muted; she can unmute with a tap (a button is always visible as a
          fallback). Short songs (≤3 min) work best.
        </div>
        <input
          type="url"
          value={state.musicUrl}
          onChange={(e) =>
            setState((s) => ({ ...s, musicUrl: e.target.value }))
          }
          placeholder="https://www.youtube.com/watch?v=... (YouTube's native ?t=30 is supported)"
          style={{
            width: '100%',
            marginTop: 10,
            padding: 11,
            borderRadius: 10,
            border: `1px solid ${invalid ? '#ff8da1' : '#e4dbf5'}`,
            fontSize: 13,
            fontFamily: 'inherit',
            background: '#fff',
            boxSizing: 'border-box',
          }}
        />
        {invalid && (
          <div style={{ fontSize: 11, color: '#a33', marginTop: 6 }}>
            That doesn&apos;t look like a YouTube link. Try pasting the full URL.
          </div>
        )}

        {state.musicVideoId && (
          <>
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <label
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#555',
                    letterSpacing: 0.6,
                    textTransform: 'uppercase',
                  }}
                >
                  Start at (optional)
                </div>
                <input
                  type="text"
                  value={startField}
                  onChange={(e) => {
                    setStartField(e.target.value);
                    // Live-commit so the receiver stays in sync as they type
                    commitStartField(e.target.value);
                  }}
                  onBlur={() => commitStartField(startField)}
                  placeholder="e.g. 0:30 or 30"
                  // Regular text keyboard so the colon key is available —
                  // the numeric keypad was hiding it, blocking inputs
                  // like "1:55". Our parser still accepts plain seconds
                  // ("30"), mm:ss ("1:30"), and "1m30s" forms.
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  style={{
                    width: '100%',
                    marginTop: 4,
                    padding: 9,
                    borderRadius: 8,
                    border: `1px solid ${startInvalid ? '#ff8da1' : '#e4dbf5'}`,
                    fontSize: 13,
                    fontFamily: 'inherit',
                    background: '#fff',
                    boxSizing: 'border-box',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                />
              </label>
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4, lineHeight: 1.5 }}>
              First play starts here. When the song loops, it plays from the
              beginning. Accepts <code>30</code>, <code>0:30</code>,{' '}
              <code>1:30</code>, or <code>1m30s</code>.
            </div>
            {startInvalid && (
              <div style={{ fontSize: 11, color: '#a33', marginTop: 4 }}>
                Couldn&apos;t read that time — try a number of seconds or
                mm:ss.
              </div>
            )}
          </>
        )}

        {checking && !info && !invalid && (
          <div
            style={{
              fontSize: 11,
              color: '#888',
              marginTop: 10,
            }}
          >
            Checking the song…
          </div>
        )}
        {info && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              background: '#fff',
              border: '1px solid #e4dbf5',
              borderRadius: 10,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={info.thumbnail_url}
              alt=""
              style={{
                width: 64,
                height: 48,
                objectFit: 'cover',
                borderRadius: 6,
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1a1a1a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {info.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#888',
                  marginTop: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {info.author_name}
                {state.musicStartSeconds != null && (
                  <>
                    {' · '}
                    <span style={{ color: '#8b5cf6' }}>
                      starts at {formatTimeMmSs(state.musicStartSeconds)}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                setState((s) => ({
                  ...s,
                  musicUrl: '',
                  musicVideoId: null,
                  musicStartSeconds: null,
                }))
              }
              aria-label="Remove song"
              style={{
                flexShrink: 0,
                width: 26,
                height: 26,
                borderRadius: 99,
                border: 'none',
                background: '#f2f0eb',
                color: '#555',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ fontSize: 10, color: '#aaa', marginTop: 10, lineHeight: 1.5 }}>
          Heads up: YouTube may play a short ad first. iPhone may need a tap
          before sound starts.
        </div>
      </div>
    </div>
  );
}
