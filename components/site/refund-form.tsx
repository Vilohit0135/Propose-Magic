'use client';

import { useState } from 'react';

type Status =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'success'; id: string }
  | { phase: 'error'; message: string };

const FIELD_CLS =
  'mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20';

const LABEL_CLS = 'text-xs font-semibold uppercase tracking-wider text-ink-muted';

const ERROR_LABELS: Record<string, string> = {
  missing_name: 'Please enter your name.',
  invalid_email: 'That email doesn\'t look right.',
  missing_order_id: 'Please include your order ID (the 12-character code in your page URL).',
  reason_too_short: 'Tell us a little more — at least a sentence.',
  invalid_json: 'Something went wrong. Please try again.',
};

export function RefundForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<Status>({ phase: 'idle' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ phase: 'submitting' });
    try {
      const res = await fetch('/api/refund/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          order_short_id: orderId,
          reason,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        const message = ERROR_LABELS[data.error ?? ''] ?? 'Something went wrong. Please try again.';
        setStatus({ phase: 'error', message });
        return;
      }
      setStatus({ phase: 'success', id: data.id! });
      setName('');
      setEmail('');
      setOrderId('');
      setReason('');
    } catch {
      setStatus({
        phase: 'error',
        message: 'Could not reach the server. Please try again in a moment.',
      });
    }
  };

  if (status.phase === 'success') {
    return (
      <div className="rounded-2xl border border-rose/40 bg-rose-soft p-7 md:p-10">
        <div className="text-4xl">✉</div>
        <h3 className="mt-4 font-playfair text-2xl text-ink">We&apos;ve got your request.</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Reference <code className="rounded bg-white px-1.5 py-0.5 text-[11px]">{status.id.slice(0, 8)}</code>.
          We&apos;ll reply to the email you gave us within the same business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ phase: 'idle' })}
          className="mt-6 rounded-full border border-ink/20 px-5 py-2 text-sm font-semibold text-ink hover:border-ink/40"
        >
          Submit another
        </button>
      </div>
    );
  }

  const submitting = status.phase === 'submitting';

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-black/10 bg-white p-6 md:p-8"
    >
      <h3 className="font-playfair text-2xl text-ink">Request a refund</h3>
      <p className="mt-2 text-sm text-ink-muted">
        Fill this in and we&apos;ll reply within the same business day.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className={LABEL_CLS} htmlFor="refund-name">
            Your name
          </label>
          <input
            id="refund-name"
            className={FIELD_CLS}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Arjun Sharma"
            maxLength={100}
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="refund-email">
            Email (used at checkout)
          </label>
          <input
            id="refund-email"
            type="email"
            className={FIELD_CLS}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            maxLength={200}
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={LABEL_CLS} htmlFor="refund-order">
          Order ID
        </label>
        <input
          id="refund-order"
          className={FIELD_CLS + ' font-mono text-sm tracking-wider'}
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="aX3k9QpV1n2w"
          maxLength={20}
          required
        />
        <p className="mt-1.5 text-xs text-ink-soft">
          The 12-character code at the end of your page URL (proposemagic.in/p/<strong>…</strong>).
        </p>
      </div>

      <div className="mt-5">
        <label className={LABEL_CLS} htmlFor="refund-reason">
          What happened
        </label>
        <textarea
          id="refund-reason"
          className={FIELD_CLS + ' min-h-[120px] resize-y'}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="A sentence or two is fine — no need to justify."
          maxLength={2000}
          required
        />
        <p className="mt-1.5 text-xs text-ink-soft">{reason.length}/2000</p>
      </div>

      {status.phase === 'error' && (
        <div className="mt-5 rounded-xl border border-rose-deep/30 bg-rose-soft px-4 py-3 text-sm text-rose-deep">
          {status.message}
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-rose px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send refund request →'}
        </button>
        <span className="text-xs text-ink-soft">
          We&apos;ll confirm via email to{' '}
          <span className="text-ink-muted">refunds@proposemagic.in</span>.
        </span>
      </div>
    </form>
  );
}
