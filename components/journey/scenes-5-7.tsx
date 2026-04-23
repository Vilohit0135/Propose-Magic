'use client';

import React, { useEffect, useState } from 'react';
import { DEMO_PHOTOS, TEMPLATES } from '@/lib/tokens';
import type { OrderState, SubFlow, TemplateDef } from '@/lib/types';
import { Grain, Particles } from '../particles';

// Per-template rgba helper. Duplicated from chat/bubbles.tsx on purpose so
// this file stays independent of the chat folder.
function alphaOf(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(255,255,255,${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

export function Scene5Pause({
  state,
  onTap,
}: {
  state: OrderState;
  onTap: () => void;
}) {
  const photo = state.photos[2] || DEMO_PHOTOS[3];
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 1)), 60);
    return () => clearInterval(iv);
  }, []);
  return (
    <div
      onClick={progress >= 60 ? onTap : undefined}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000',
        cursor: progress >= 60 ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter:
            state.videoTreatment === 'vintage'
              ? 'sepia(0.4) contrast(1.1)'
              : state.videoTreatment === 'dreamy'
                ? 'blur(4px) brightness(1.1)'
                : 'brightness(0.85)',
        }}
      />
      {state.videoTreatment === 'letterbox' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '15%',
              background: '#000',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '15%',
              background: '#000',
            }}
          />
        </>
      )}
      <Grain />
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, zIndex: 10 }}>
        <div
          style={{
            height: 2,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#fff',
              transition: 'width 0.06s linear',
            }}
          />
        </div>
        {progress >= 60 && (
          <div
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textAlign: 'center',
              color: '#fff',
              marginTop: 10,
              animation: 'fadeInUp 0.6s both',
            }}
          >
            TAP TO CONTINUE
          </div>
        )}
      </div>
    </div>
  );
}

export function Scene5_5Reveal({
  state,
  onTap,
}: {
  state: OrderState;
  onTap: () => void;
}) {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'reveal'>('intro');
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (phase === 'intro') {
      const t = setTimeout(() => setPhase('quiz'), 2600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const style = state.revealStyle || 'three_clues';
  // three_clues only emits once (the final name pick); trivia/sensory emit
  // once per question (3 total).
  const totalNeeded = style === 'three_clues' ? 1 : 3;
  const revealed = Math.min(answers.filter(Boolean).length, state.fromName.length);

  const submit = (correct: boolean) => {
    if (!correct) {
      setWrong(true);
      setTimeout(() => setWrong(false), 600);
      return;
    }
    const nextAns = [...answers, true];
    setAnswers(nextAns);
    if (nextAns.length >= totalNeeded) setTimeout(() => setPhase('reveal'), 500);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `radial-gradient(ellipse at center, #2a1850 0%, #0a0620 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        textAlign: 'center',
      }}
    >
      <Particles template="midnight" density={1.3} />
      <Grain />
      {phase === 'intro' && (
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Silhouette accent="#c0a7ff" glow={20} />
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 22,
              color: '#ece6ff',
              marginTop: 30,
              lineHeight: 1.35,
              animation: 'fadeInUp 1.2s 0.4s both',
            }}
          >
            Before we go any further…
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 22,
              color: '#c0a7ff',
              marginTop: 10,
              animation: 'fadeInUp 1.2s 1.2s both',
            }}
          >
            Can you guess who&apos;s been thinking of you?
          </div>
        </div>
      )}

      {phase === 'quiz' && (
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            animation: wrong ? 'shake 0.5s' : 'fadeInUp 0.8s both',
          }}
        >
          <Silhouette accent="#c0a7ff" glow={10 + revealed * 8} />
          {style !== 'three_clues' && (
            <NameProgress name={state.fromName} revealed={revealed} />
          )}
          {style === 'three_clues' && (
            <ThreeCluesQuiz
              fromName={state.fromName}
              onAnswer={submit}
              t={TEMPLATES.midnight}
            />
          )}
          {style === 'trivia' && (
            <TriviaQuiz
              step={answers.length}
              onAnswer={submit}
              t={TEMPLATES.midnight}
            />
          )}
          {style === 'sensory' && (
            <SensoryQuiz
              step={answers.length}
              onAnswer={submit}
              t={TEMPLATES.midnight}
            />
          )}
          {wrong && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#ffb6c1' }}>
              Not quite — try again 💕
            </div>
          )}
        </div>
      )}

      {phase === 'reveal' && (
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -100,
              background: 'rgba(255,255,255,0.9)',
              animation: 'flashOut 0.8s 0.1s both',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 56,
              color: '#fff',
              lineHeight: 1,
              textShadow: '0 0 40px #c0a7ff, 0 0 80px #c0a7ff80',
              animation: 'nameGlow 1.5s 0.6s both',
            }}
          >
            {state.fromName}
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#c0a7ff',
              marginTop: 20,
              animation: 'fadeInUp 1s 1.4s both',
            }}
          >
            it&apos;s me.
          </div>
          <button
            onClick={onTap}
            style={{
              marginTop: 40,
              padding: '12px 28px',
              borderRadius: 99,
              background: 'rgba(192,167,255,0.15)',
              border: '1px solid #c0a7ff',
              color: '#fff',
              fontSize: 13,
              letterSpacing: 1.5,
              cursor: 'pointer',
              animation: 'fadeInUp 1s 2s both',
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

export function Silhouette({ accent, glow }: { accent: string; glow: number }) {
  return (
    <svg
      width="90"
      height="120"
      viewBox="0 0 90 120"
      style={{ filter: `drop-shadow(0 0 ${glow}px ${accent})`, transition: 'filter 0.6s' }}
    >
      <circle cx="45" cy="32" r="20" fill={accent} opacity="0.25" />
      <path d="M10 120 C10 80, 25 60, 45 60 C65 60, 80 80, 80 120 Z" fill={accent} opacity="0.25" />
    </svg>
  );
}

export function NameProgress({ name, revealed }: { name: string; revealed: number }) {
  const chars = name.split('');
  const perChar = Math.ceil(chars.length / 3);
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 24,
      }}
    >
      {chars.map((c, i) => {
        const visible = i < revealed * perChar;
        return (
          <span
            key={i}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 28,
              color: visible ? '#c0a7ff' : '#3a2860',
              textShadow: visible ? '0 0 20px #c0a7ff' : 'none',
              transition: 'all 0.6s',
              minWidth: 14,
              textAlign: 'center',
            }}
          >
            {visible ? c : '·'}
          </span>
        );
      })}
    </div>
  );
}

function padOrTrim(custom: string[], fallback: string[], n: number): string[] {
  const cleaned = custom.map((s) => s.trim()).filter((s) => s.length > 0);
  const out = cleaned.slice(0, n);
  while (out.length < n) out.push(fallback[out.length] ?? '');
  return out;
}

export function revealBtn(t: TemplateDef): React.CSSProperties {
  return {
    padding: '12px 16px',
    borderRadius: 10,
    background: alphaOf(t.palette.accent, 0.12),
    border: `1px solid ${alphaOf(t.palette.accent, 0.4)}`,
    color: t.palette.text,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  };
}

const FALLBACK_DECOYS = ['Rohan', 'Kabir', 'Aryan', 'Arjun', 'Dev', 'Vikram', 'Nikhil'];

export function ThreeCluesQuiz({
  fromName,
  onAnswer,
  customClues,
  customDecoys,
  t,
}: {
  fromName: string;
  onAnswer: (correct: boolean) => void;
  customClues?: string[];
  customDecoys?: string[];
  t: TemplateDef;
}) {
  const defaultClues = [
    'We met somewhere it was raining',
    'You once laughed so hard you cried',
    "I've held your hand more than once",
  ];
  const defaultDecoys = ['Rohan', 'Kabir', 'Aryan'];

  const clues =
    customClues && customClues.length > 0
      ? padOrTrim(customClues, defaultClues, 3)
      : defaultClues;

  // Build the list of 3 decoys: use custom if provided, else defaults. Filter
  // out any that collide with the sender's name, then top up from a small
  // fallback pool so we always present a 4-option grid.
  const decoys = (() => {
    const base =
      customDecoys && customDecoys.length > 0
        ? padOrTrim(customDecoys, defaultDecoys, 3)
        : defaultDecoys;
    const filtered = base
      .map((d) => d.trim())
      .filter((d) => d.length > 0 && d !== fromName);
    for (const fb of FALLBACK_DECOYS) {
      if (filtered.length >= 3) break;
      if (fb !== fromName && !filtered.includes(fb)) filtered.push(fb);
    }
    return filtered.slice(0, 3);
  })();

  // Internal flow state: read each clue in sequence, then show the name
  // picker. Only the final name pick emits onAnswer(true|false). "Next clue"
  // is pure navigation — it does NOT signal a correct answer.
  const [clueIdx, setClueIdx] = useState(0);
  const [showingPicker, setShowingPicker] = useState(false);
  const [locked, setLocked] = useState(false);
  const [shuffled] = useState(() => {
    const base = [fromName, ...decoys].slice(0, 4);
    return [...base].sort(() => Math.random() - 0.5);
  });

  const advance = () => {
    if (clueIdx < clues.length - 1) {
      setClueIdx((i) => i + 1);
    } else {
      setShowingPicker(true);
    }
  };

  const handlePick = (name: string) => {
    if (locked) return;
    const correct = name === fromName;
    if (correct) setLocked(true);
    onAnswer(correct);
  };

  if (!showingPicker) {
    const isLast = clueIdx === clues.length - 1;
    return (
      <div style={{ padding: 20 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: t.palette.muted,
            marginBottom: 10,
          }}
        >
          Clue {clueIdx + 1} of {clues.length}
        </div>
        <div
          style={{
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 19,
            color: t.palette.text,
            lineHeight: 1.4,
            marginBottom: 20,
          }}
        >
          &quot;{clues[clueIdx]}&quot;
        </div>
        <button onClick={advance} style={revealBtn(t)}>
          {isLast ? 'Show me the options →' : 'Next clue →'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          fontSize: 14,
          color: t.palette.accent,
          marginBottom: 14,
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
        }}
      >
        So — who is it?
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {shuffled.map((n) => (
          <button
            key={n}
            onClick={() => handlePick(n)}
            disabled={locked}
            style={{
              ...revealBtn(t),
              cursor: locked ? 'default' : 'pointer',
              opacity: locked ? 0.6 : 1,
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TriviaQuiz({
  step,
  onAnswer,
  customQuestions,
  t,
}: {
  step: number;
  onAnswer: (correct: boolean) => void;
  customQuestions?: { q: string; choices: string[]; correct: number }[];
  t: TemplateDef;
}) {
  // Defaults framed as personality gut-checks — since the receiver doesn't
  // know who the sender is yet, a "what colour was the shirt" question is
  // unfair. Instead every question probes the *kind of person* behind the
  // letter. All four options are emotionally plausible, so wrong answers
  // still feel like reasonable guesses rather than trick questions.
  const defaults: { q: string; choices: string[]; correct: number }[] = [
    {
      q: 'When I wrote this letter, I was probably…',
      choices: [
        'rehearsing every word',
        'writing in one breath',
        'deleting and restarting',
        'trying not to cry',
      ],
      correct: 0,
    },
    {
      q: "How long have I been holding this in, do you think?",
      choices: [
        'a few weeks',
        'months',
        "longer than I'd like to admit",
        'since the day we met',
      ],
      correct: 2,
    },
    {
      q: 'When you read this, who comes to mind first?',
      choices: [
        'someone unexpected',
        'someone you already love',
        "someone you've been pretending not to notice",
        'someone who has always been there',
      ],
      correct: 2,
    },
  ];
  const pool =
    customQuestions && customQuestions.length === 3 ? customQuestions : defaults;
  const cur = pool[step] || pool[0];
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: t.palette.muted,
          marginBottom: 10,
        }}
      >
        Question {step + 1} of 3
      </div>
      <div
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 19,
          color: t.palette.text,
          marginBottom: 18,
          lineHeight: 1.4,
        }}
      >
        {cur.q}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {cur.choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i === cur.correct)}
            style={revealBtn(t)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SensoryQuiz({
  step,
  onAnswer,
  customQuestions,
  t,
}: {
  step: number;
  onAnswer: (correct: boolean) => void;
  customQuestions?: { q: string; choices: string[]; correct: number }[];
  t: TemplateDef;
}) {
  // Sensory defaults frame the sender through atmosphere rather than
  // specific memories. Each option is evocative enough to "feel" without
  // needing the receiver to remember a concrete shared event.
  const defaults: { q: string; choices: string[]; correct: number }[] = [
    {
      q: 'Pick the colour this moment feels like',
      choices: [
        'deep red — intense',
        'warm amber — safe',
        'soft lavender — quiet',
        'cream — slow',
      ],
      correct: 1,
    },
    {
      q: "Pick the sound you'd hear in the background of this letter",
      choices: [
        'slow piano',
        'a heartbeat',
        'rain on a window',
        'someone breathing close',
      ],
      correct: 3,
    },
    {
      q: 'What kind of ending do you think this letter has?',
      choices: [
        'a question',
        'a confession',
        'a promise',
        'a quiet "it was always you"',
      ],
      correct: 3,
    },
  ];
  const pool =
    customQuestions && customQuestions.length === 3 ? customQuestions : defaults;
  const cur = pool[step] || pool[0];
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: t.palette.muted,
          marginBottom: 10,
        }}
      >
        {step + 1} of 3
      </div>
      <div
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 18,
          color: t.palette.text,
          marginBottom: 18,
          lineHeight: 1.4,
        }}
      >
        {cur.q}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cur.choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i === cur.correct)}
            style={{
              ...revealBtn(t),
              minHeight: 46,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Scene6Question({
  state,
  t,
  sub,
  onYes,
}: {
  state: OrderState;
  t: TemplateDef;
  sub: SubFlow;
  onYes: () => void;
}) {
  const [dodges, setDodges] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);
  const isProposal = state.flow === 'propose';
  const isAnniv = state.flow === 'anniversary';
  const isBday = state.flow === 'birthday';

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const dodge = (e?: React.MouseEvent | React.SyntheticEvent) => {
    e?.stopPropagation?.();
    if (dodges >= 3) return;
    const max = 80 - dodges * 20;
    setNoPos({ x: (Math.random() - 0.5) * max, y: (Math.random() - 0.5) * max });
    setDodges((d) => d + 1);
  };

  const bgPhoto = state.photos[0] || DEMO_PHOTOS[1];
  const noLabels = ['No', 'Really?', 'Fine 😢', ''];
  const primaryLabel = isBday
    ? 'Make a Wish 🎂'
    : isAnniv
      ? 'Still Yes 💍'
      : `Yes, I Will! ${sub.particle}`;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {state.package !== 'basic' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgPhoto})`,
            backgroundSize: 'cover',
            filter: 'blur(14px) brightness(0.3)',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 100%)`,
          }}
        />
      )}
      <Particles template={state.template} density={1.6} />
      <Grain />
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 28,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.body,
            fontStyle: 'italic',
            fontSize: 14,
            color: t.palette.muted,
            animation: 'fadeInUp 1.2s both',
          }}
        >
          And so, {state.toName}…
        </div>
        <div
          style={{
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 40,
            lineHeight: 1.15,
            color: '#fff',
            marginTop: 24,
            textShadow: `0 0 30px ${t.palette.accent}`,
            animation: 'fadeInDown 1.4s 0.8s both',
          }}
        >
          {sub.question}
        </div>
        <div
          style={{
            width: 40,
            height: 1,
            background: t.palette.accent,
            marginTop: 26,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            fontFamily: t.fonts.body,
            fontSize: 12,
            color: t.palette.muted,
            marginTop: 14,
            letterSpacing: 1,
            animation: 'fadeInUp 1s 1.8s both',
          }}
        >
          — {state.fromName}
        </div>
        {revealed && (
          <>
            <button
              onClick={onYes}
              style={{
                marginTop: 40,
                width: '80%',
                maxWidth: 280,
                padding: '18px 24px',
                borderRadius: 99,
                border: 'none',
                background: `linear-gradient(90deg, ${t.palette.accent}, ${t.palette.accent2 || t.palette.accent})`,
                color: t.palette.bg,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: `0 0 30px ${t.palette.accent}80`,
                animation: 'pulseBreath 2.5s infinite, fadeInUp 0.8s both',
              }}
            >
              {primaryLabel}
            </button>
            {isProposal && dodges < 3 && (
              <button
                onMouseEnter={dodge}
                onClick={dodge}
                style={{
                  marginTop: 14,
                  padding: '10px 18px',
                  borderRadius: 99,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: t.palette.muted,
                  fontSize: 13,
                  cursor: 'pointer',
                  transform: `translate(${noPos.x}px, ${noPos.y}px) scale(${1 - dodges * 0.12})`,
                  transition: 'transform 0.3s cubic-bezier(.3,1.5,.5,1)',
                  animation: 'fadeInUp 0.8s 0.3s both',
                }}
              >
                {noLabels[dodges]}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Scene7Yes({
  state,
  t,
  sub,
  hearts,
  reactions,
  startTime,
  onReset,
}: {
  state: OrderState;
  t: TemplateDef;
  sub: SubFlow;
  hearts: number;
  reactions: string[];
  startTime: number;
  onReset: () => void;
}) {
  const bgPhoto = state.photos[0] || DEMO_PHOTOS[4];
  const [showCTA, setShowCTA] = useState(false);
  const [showReply, setShowReply] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShowCTA(true), 2200);
    const t2 = setTimeout(() => setShowReply(true), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  const mins = Math.round((Date.now() - startTime) / 60000) || 1;
  const isBday = state.flow === 'birthday';
  const isAnniv = state.flow === 'anniversary';
  const headline = isBday
    ? `She made a wish ${sub.particle}`
    : isAnniv
      ? `Another year of yes 💕`
      : `${state.toName.split(' ')[0]} said YES! 💍`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        animation: 'flashIn 0.6s both',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgPhoto})`,
          backgroundSize: 'cover',
          filter: 'brightness(0.5) saturate(1.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 0%, ${t.palette.bg}ee 90%)`,
        }}
      />
      <Confetti t={t} />
      <Particles template={state.template} density={2} />
      <Grain />
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 28,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 40,
            lineHeight: 1.1,
            color: '#fff',
            textShadow: `0 0 40px ${t.palette.accent}`,
            animation: 'fadeInUp 1s 0.3s both',
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: t.fonts.display,
            fontSize: 22,
            fontStyle: 'italic',
            color: t.palette.accent,
            animation: 'fadeInUp 1s 0.8s both',
          }}
        >
          {state.fromName} <span style={{ fontSize: 14, opacity: 0.6 }}>&amp;</span>{' '}
          {state.toName}
        </div>
        <div
          style={{
            fontFamily: t.fonts.body,
            fontSize: 11,
            letterSpacing: 3,
            color: t.palette.muted,
            marginTop: 10,
            animation: 'fadeInUp 1s 1.2s both',
          }}
        >
          APRIL 21, 2026
        </div>
        <div
          style={{
            marginTop: 30,
            padding: '14px 18px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14,
            fontSize: 12,
            color: t.palette.text,
            lineHeight: 1.6,
            animation: 'fadeInUp 1s 2s both',
          }}
        >
          You took {mins} min · Sent {hearts} hearts
          {reactions.length > 0 &&
            ` · Reacted with ${[...new Set(reactions)].slice(0, 3).join('')}`}
        </div>
        {showCTA && (
          <div
            style={{
              marginTop: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              width: '80%',
              maxWidth: 280,
              animation: 'fadeInUp 0.8s both',
            }}
          >
            <button
              style={{
                padding: 14,
                borderRadius: 99,
                border: 'none',
                background: '#25D366',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Share this moment →
            </button>
            <button
              style={{
                padding: 14,
                borderRadius: 99,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Save as image
            </button>
          </div>
        )}
        {showReply && (
          <button
            onClick={onReset}
            style={{
              marginTop: 18,
              padding: '10px 18px',
              borderRadius: 99,
              border: '1px dashed rgba(255,255,255,0.3)',
              background: 'transparent',
              color: t.palette.accent,
              fontSize: 13,
              cursor: 'pointer',
              animation: 'fadeInUp 1s both',
            }}
          >
            Now surprise them back — Create yours free →
          </button>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            fontSize: 10,
            color: t.palette.muted,
            opacity: 0.6,
          }}
        >
          Made with ProposeMagic ♥
        </div>
      </div>
    </div>
  );
}

function Confetti({ t }: { t: TemplateDef }) {
  const pieces = Array.from({ length: 30 });
  const colors = [t.palette.accent, t.palette.accent2 || t.palette.accent, '#fff', t.palette.text];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 3,
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
