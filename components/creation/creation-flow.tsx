'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import type { OrderState } from '@/lib/types';
import { Step1 } from './step1';
import { Step2 } from './step2';
import { Step3, Step4 } from './step3-4';
import { Step5 } from './step5';
import { RosePetals } from '../site/rose-petals';

type SetState = React.Dispatch<React.SetStateAction<OrderState>>;

export function CreationFlow({
  state,
  setState,
}: {
  state: OrderState;
  setState: SetState;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => {
    if (step === 1) {
      router.push('/');
      return;
    }
    setStep((s) => Math.max(s - 1, 1));
  };

  if (step === 5) {
    return <Step5 state={state} />;
  }

  return (
    <div
      className="creation-flow"
      style={{
        width: '100%',
        minHeight: '100dvh',
        background: '#fafaf7',
        color: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Inter", system-ui',
      }}
    >
      {/* header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(250, 250, 247, 0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <div
          className="creation-flow__lane"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 18,
            paddingBottom: 12,
          }}
        >
          <button
            onClick={back}
            aria-label={step === 1 ? 'Back to home' : 'Previous step'}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 22,
              color: '#1a1a1a',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
            }}
          >
            ←
          </button>
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 18,
              letterSpacing: 0.5,
            }}
          >
            ProposeMagic ♥
          </div>
          <div style={{ fontSize: 12, color: '#888', fontVariantNumeric: 'tabular-nums' }}>
            {step}/5
          </div>
        </div>
        {/* progress */}
        <div className="creation-flow__lane" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ height: 2, background: '#eee', borderRadius: 2 }}>
            <div
              style={{
                height: '100%',
                width: `${(step / 5) * 100}%`,
                background: '#c9748a',
                transition: 'width 0.4s cubic-bezier(.2,.9,.3,1)',
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>

      {/* body: form (main) + aside on desktop */}
      <div className="creation-flow__grid">
        <div className="creation-flow__main">
          <div className="creation-flow__lane" style={{ paddingTop: 28, paddingBottom: 24 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.2, 0.9, 0.3, 1] }}
              >
                {step === 1 && <Step1 state={state} setState={setState} />}
                {step === 2 && <Step2 state={state} setState={setState} />}
                {step === 3 && <Step3 state={state} setState={setState} />}
                {step === 4 && <Step4 state={state} setState={setState} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <aside className="creation-flow__aside">
          <HowItWorksAside step={step} />
        </aside>
      </div>

      {/* footer CTA */}
      {step < 5 && (
        <div
          style={{
            borderTop: '1px solid #eee',
            background: '#fff',
            position: 'sticky',
            bottom: 0,
            zIndex: 5,
          }}
        >
          <div className="creation-flow__footer-grid">
            <div
              className="creation-flow__lane"
              style={{
                paddingTop: 14,
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
              }}
            >
              <button
                onClick={step === 4 ? () => next() : next}
                disabled={!canAdvance(step, state)}
                style={{
                  width: '100%',
                  height: 54,
                  borderRadius: 14,
                  border: 'none',
                  background: canAdvance(step, state) ? '#1a1a1a' : '#d4d4d4',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  cursor: canAdvance(step, state) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}
              >
                {step === 4 ? 'Generate my page →' : 'Continue →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type HowCard = {
  n: string;
  title: string;
  body: string;
  activeSteps: number[];
};

const HOW_CARDS: HowCard[] = [
  {
    n: '01',
    title: 'You tell us a little',
    body: 'Names, the moment, maybe a story. No account, no password.',
    activeSteps: [1, 2, 3, 4],
  },
  {
    n: '02',
    title: 'We write & design',
    body: 'AI drafts the message and lays it into a cinematic template.',
    activeSteps: [5],
  },
  {
    n: '03',
    title: 'You share the link',
    body: 'A private page, ready to send over WhatsApp or email.',
    activeSteps: [],
  },
];

function HowItWorksAside({ step }: { step: number }) {
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        background:
          'linear-gradient(160deg, #fff5f7 0%, #fbeae1 55%, #f4dccf 100%)',
        border: '1px solid rgba(201,116,138,0.18)',
        boxShadow: '0 20px 50px -30px rgba(139,21,56,0.25)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.55,
          pointerEvents: 'none',
        }}
      >
        <RosePetals />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#8b5a66',
              letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            How it works
          </div>
          <motion.div
            key={`title-${step}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.9, 0.3, 1] }}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 24,
              lineHeight: 1.25,
              color: '#1a1a1a',
              marginTop: 6,
            }}
          >
            {stepPrompt(step)}
          </motion.div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HOW_CARDS.map((c, i) => {
            const active = c.activeSteps.includes(step);
            return (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + i * 0.09,
                  duration: 0.45,
                  ease: [0.2, 0.9, 0.3, 1],
                }}
                style={{
                  position: 'relative',
                  padding: 14,
                  borderRadius: 14,
                  border: '1px solid',
                  borderColor: active ? '#c9748a' : 'rgba(255,255,255,0.7)',
                  background: active
                    ? 'rgba(255,255,255,0.96)'
                    : 'rgba(255,255,255,0.62)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: active
                    ? '0 10px 30px -18px rgba(201,116,138,0.55)'
                    : '0 4px 16px -12px rgba(139,21,56,0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontStyle: 'italic',
                      fontSize: 14,
                      color: active ? '#8b1538' : '#c9748a',
                      letterSpacing: 0.5,
                    }}
                  >
                    {c.n}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1a1a1a',
                    }}
                  >
                    {c.title}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="how-active-dot"
                      style={{
                        marginLeft: 'auto',
                        width: 8,
                        height: 8,
                        borderRadius: 99,
                        background: '#c9748a',
                        boxShadow: '0 0 0 4px rgba(201,116,138,0.2)',
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6b5560',
                    marginTop: 6,
                    lineHeight: 1.55,
                  }}
                >
                  {c.body}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 'auto',
            fontSize: 11,
            color: '#8b5a66',
            letterSpacing: 0.3,
            lineHeight: 1.5,
          }}
        >
          Takes about a minute. You&apos;ll get an email with the link.
        </div>
      </div>
    </div>
  );
}

function stepPrompt(step: number): string {
  if (step === 1) return 'Tell us who this moment is for.';
  if (step === 2) return 'Pick the vibe & template.';
  if (step === 3) return 'Add photos or keep it pure.';
  if (step === 4) return 'Almost there — where should we send it?';
  return 'Weaving your page together…';
}

function canAdvance(step: number, s: OrderState): boolean {
  if (step === 1) return !!(s.fromName && s.toName);
  if (step === 2) return !!(s.flow && s.subFlow && s.tone && s.template);
  if (step === 3) return true;
  if (step === 4) return !!(s.email && s.email.includes('@'));
  return true;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#666',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

export function cardBtn(active: boolean): React.CSSProperties {
  return {
    padding: '16px 10px',
    borderRadius: 12,
    border: '1px solid',
    borderColor: active ? '#1a1a1a' : '#e0e0e0',
    background: active ? '#1a1a1a' : '#fff',
    color: active ? '#fff' : '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  };
}

export function rowBtn(active: boolean): React.CSSProperties {
  return {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid',
    borderColor: active ? '#c9748a' : '#e0e0e0',
    background: active ? '#fff5f7' : '#fff',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    color: '#1a1a1a',
  };
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#555',
          textTransform: 'uppercase',
          letterSpacing: 0.8,
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            width: '100%',
            marginTop: 6,
            padding: 14,
            borderRadius: 12,
            border: '1px solid #e0e0e0',
            fontSize: 15,
            fontFamily: 'inherit',
            resize: 'none',
            minHeight: 80,
            boxSizing: 'border-box',
            background: '#fff',
          }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            marginTop: 6,
            padding: '14px',
            borderRadius: 12,
            border: '1px solid #e0e0e0',
            fontSize: 15,
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            background: '#fff',
          }}
        />
      )}
      {maxLength && (
        <div style={{ fontSize: 11, color: '#aaa', textAlign: 'right', marginTop: 4 }}>
          {(value || '').length}/{maxLength}
        </div>
      )}
    </div>
  );
}
