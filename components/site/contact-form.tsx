'use client';

import { useState } from 'react';

// Visitor contact form. Deliberately mirrors RefundForm's structure,
// status state-machine, and field styling so the two forms on the
// marketing site feel like one family.

type Status =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'success' }
  | { phase: 'error'; message: string };

const FIELD_CLS =
  'mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20';

const LABEL_CLS = 'text-xs font-semibold uppercase tracking-wider text-ink-muted';

const ERROR_LABELS: Record<string, string> = {
  missing_name: 'Please enter your name.',
  invalid_email: "That email doesn't look right.",
  message_too_short: 'Tell us a little more — at least a sentence.',
  invalid_json: 'Something went wrong. Please try again.',
};

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ phase: 'idle' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ phase: 'submitting' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        const msg =
          ERROR_LABELS[data.error ?? ''] ??
          'Something went wrong. Please try again.';
        setStatus({ phase: 'error', message: msg });
        return;
      }
      setStatus({ phase: 'success' });
      setName('');
      setEmail('');
      setMessage('');
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
        <h3 className="mt-4 font-playfair text-2xl text-ink">
          Thanks — your message is in.
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          We read every email and reply within a day, usually sooner. Keep an
          eye on the inbox you gave us.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ phase: 'idle' })}
          className="mt-6 rounded-full border border-ink/20 px-5 py-2 text-sm font-semibold text-ink hover:border-ink/40"
        >
          Send another
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
      <h3 className="font-playfair text-2xl text-ink">Send us a message</h3>
      <p className="mt-2 text-sm text-ink-muted">
        A question, a refund, an idea — write it here and we&apos;ll reply
        within a day.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className={LABEL_CLS} htmlFor="contact-name">
            Your name
          </label>
          <input
            id="contact-name"
            className={FIELD_CLS}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Arjun Sharma"
            maxLength={100}
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="contact-email">
            Your email
          </label>
          <input
            id="contact-email"
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
        <label className={LABEL_CLS} htmlFor="contact-message">
          How can we help?
        </label>
        <textarea
          id="contact-message"
          className={FIELD_CLS + ' min-h-[140px] resize-y'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you need — the more detail, the faster we can help."
          maxLength={4000}
          required
        />
        <p className="mt-1.5 text-xs text-ink-soft">{message.length}/4000</p>
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
          className="rounded-full bg-rose-deep px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(139,21,56,0.3)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send message →'}
        </button>
        <span className="text-xs text-ink-soft">
          Goes straight to{' '}
          <span className="text-ink-muted">magic@supercx.co</span>.
        </span>
      </div>
    </form>
  );
}
