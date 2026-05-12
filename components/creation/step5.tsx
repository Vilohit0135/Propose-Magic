'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OrderState } from '@/lib/types';
import { Grain } from '../particles';
import { RosePetals } from '../site/rose-petals';

type Phase = 'generating' | 'delivered' | 'failed';

// Step 5 is now a pure "watch generation" screen. The order is created
// (and paid for, in production) by the parent CreationFlow before this
// step renders, and the resulting id + short_id are passed in.
export function Step5({
  state,
  orderId,
  shortId: initialShortId,
}: {
  state: OrderState;
  orderId: string;
  shortId: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('generating');
  const [progress, setProgress] = useState(0);
  const [shortId] = useState<string | null>(initialShortId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        try {
          const res = await fetch(`/api/order/${orderId}/status`);
          if (res.ok) {
            const data = (await res.json()) as { status: string };
            if (data.status === 'COMPLETED') {
              if (!cancelled) {
                setProgress(100);
                setPhase('delivered');
              }
              return;
            }
            if (data.status === 'FAILED') {
              if (!cancelled) {
                setError('generation_failed');
                setPhase('failed');
              }
              return;
            }
          }
        } catch {
          // transient; retry
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  useEffect(() => {
    if (phase !== 'generating') return;
    const iv = setInterval(() => setProgress((p) => Math.min(p + 2, 95)), 80);
    return () => clearInterval(iv);
  }, [phase]);

  const openPage = () => {
    if (shortId) router.push(`/p/${shortId}`);
  };

  // No retry button on failure: payment has already gone through, so a
  // client-side "try again" would be misleading. Show a contact-us
  // message instead. (Future: a /api/order/{id}/regenerate endpoint
  // could re-fire generation without re-charging.)
  if (phase === 'failed') return <FailedScreen error={error} email={state.email} />;
  if (phase === 'delivered' && shortId)
    return <DeliveredScreen state={state} shortId={shortId} onOpen={openPage} />;
  return <GeneratingScreen progress={progress} />;
}

function GeneratingScreen({ progress }: { progress: number }) {
  const steps = [
    { at: 10, label: 'Saving your details' },
    { at: 30, label: 'Writing your message with AI' },
    { at: 55, label: 'Laying out your photos' },
    { at: 78, label: 'Composing your cinematic page' },
    { at: 92, label: 'Finalising the link' },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #1a0a12 0%, #2a0e1c 100%)',
        color: '#fbeae1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        fontFamily: '"Inter", system-ui',
        textAlign: 'center',
      }}
    >
      <RosePetals />
      <Grain />
      <div style={{ fontSize: 48, marginBottom: 16, filter: 'drop-shadow(0 0 20px #d4a57480)' }}>
        ♥
      </div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          fontSize: 26,
          lineHeight: 1.25,
          color: '#fff',
        }}
      >
        Your page is being created…
      </div>
      <div style={{ fontSize: 13, color: '#c9a2a0', marginTop: 10, lineHeight: 1.5 }}>
        This usually takes under a minute.
        <br />
        You&apos;ll get an email when it&apos;s ready.
      </div>
      <div
        style={{
          width: 220,
          height: 3,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 99,
          marginTop: 28,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #d4a574, #f4c6a8)',
            transition: 'width 0.2s',
          }}
        />
      </div>
      <div
        style={{
          fontSize: 11,
          color: '#c9a2a0',
          marginTop: 14,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {progress}%
      </div>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
        {steps.map((s) => (
          <div
            key={s.at}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 12,
              color: progress >= s.at ? '#fbeae1' : '#6d4a5a',
              transition: 'color 0.3s',
            }}
          >
            <span style={{ width: 14, textAlign: 'center' }}>{progress >= s.at ? '✓' : '·'}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveredScreen({
  state,
  shortId,
  onOpen,
}: {
  state: OrderState;
  shortId: string;
  onOpen: () => void;
}) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Direct same-origin link — no third-party shortener. We tried
  // TinyURL (now adds an ad interstitial that breaks YouTube embeds) and
  // is.gd (flagged the destination as suspicious for some receivers).
  // Both costs (slightly longer URL, domain visible in WhatsApp preview)
  // are smaller than the cost of unreliable music playback.
  //
  // origin is empty on first render (set in useEffect above), so we
  // render an empty string until it's available. NEVER hardcode a
  // domain fallback — the prod domain has changed in the past
  // (proposemagic.in -> magic.supercx.co) and a stale fallback string
  // shipped a wrong URL into share text.
  const fullUrl = origin ? `${origin}/p/${shortId}` : '';
  const displayUrl = fullUrl.replace(/^https?:\/\//, '');
  const shareText = `I made something for you ♥ ${fullUrl}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#fafaf7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        fontFamily: '"Inter", system-ui',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 10 }}>✉</div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          fontSize: 28,
          color: '#1a1a1a',
        }}
      >
        Your page is ready.
      </div>
      <div style={{ fontSize: 14, color: '#666', marginTop: 8, lineHeight: 1.5, maxWidth: 280 }}>
        We sent the link to <strong>{state.email}</strong>. Share it with {state.toName} on
        WhatsApp.
      </div>
      <div
        style={{
          marginTop: 20,
          padding: '10px 16px',
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 99,
          fontSize: 13,
          color: '#1a1a1a',
          fontFamily: 'ui-monospace, monospace',
          minWidth: 220,
        }}
      >
        {displayUrl}
      </div>
      <button
        onClick={onOpen}
        style={{
          marginTop: 24,
          padding: '16px 32px',
          borderRadius: 99,
          border: 'none',
          background: '#1a1a1a',
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Open their page →
      </button>
      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        style={{
          marginTop: 10,
          padding: '12px 24px',
          borderRadius: 99,
          border: '1px solid #25D366',
          background: '#25D366',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
      >
        Share on WhatsApp
      </a>
    </div>
  );
}

function FailedScreen({ error, email }: { error: string | null; email: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#fafaf7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        fontFamily: '"Inter", system-ui',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 48 }}>💔</div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          fontSize: 24,
          color: '#1a1a1a',
          marginTop: 12,
        }}
      >
        Something went wrong.
      </div>
      <div style={{ fontSize: 13, color: '#888', marginTop: 8, maxWidth: 280, lineHeight: 1.55 }}>
        Your payment went through, but the page didn&apos;t generate. Email us at{' '}
        <a href="mailto:founders@powersmy.biz" style={{ color: '#c9748a' }}>
          founders@powersmy.biz
        </a>{' '}
        with your email <strong>{email}</strong> and we&apos;ll fix it within hours.
      </div>
      {error && (
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 12 }}>
          Reference: {error}
        </div>
      )}
    </div>
  );
}
