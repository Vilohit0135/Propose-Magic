'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OrderStatus } from '@/lib/order';

export function NotReadyYet({
  shortId,
  status,
}: {
  shortId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const iv = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 400);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/by-short-id/${shortId}/status`);
        if (res.ok) {
          const data = (await res.json()) as { status: OrderStatus };
          if (data.status === 'COMPLETED') router.refresh();
        }
      } catch {
        // retry next tick
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [router, shortId]);

  const label =
    status === 'FAILED'
      ? "We couldn't create this page."
      : `Still weaving this together${dots}`;

  return (
    <div
      style={{
        minHeight: '100dvh',
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
      <div style={{ fontSize: 48 }}>♥</div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          fontSize: 26,
          marginTop: 16,
          color: '#fff',
          minHeight: 36,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, color: '#c9a2a0', marginTop: 10, maxWidth: 280 }}>
        {status === 'FAILED'
          ? 'Please ask the sender to try again.'
          : 'The page will appear here in a moment. Feel free to wait or check back soon.'}
      </div>
    </div>
  );
}
