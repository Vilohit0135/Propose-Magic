'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { OrderState, RevealContent, TemplateDef } from '@/lib/types';
import {
  NameProgress,
  SensoryQuiz,
  Silhouette,
  ThreeCluesQuiz,
  TriviaQuiz,
} from '../scenes-5-7';
import { Grain, Particles } from '../../particles';
import { withAlpha } from './bubbles';

type Phase = 'intro' | 'quiz' | 'reveal';

export function RevealModal({
  state,
  t,
  onDone,
}: {
  state: OrderState;
  t: TemplateDef;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (phase === 'intro') {
      const t = setTimeout(() => setPhase('quiz'), 2400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase]);

  const style = state.revealStyle || 'three_clues';
  // three_clues only emits a single answer (the final name pick). Trivia and
  // sensory emit one per question (3 total). Unlock the reveal phase when
  // the number of correct answers hits the style's threshold.
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
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 22, delay: 0.15 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 400,
          minHeight: 440,
          padding: '36px 24px 28px',
          borderRadius: 26,
          overflow: 'hidden',
          background: `linear-gradient(165deg, ${t.palette.bg2}, ${t.palette.bg})`,
          color: t.palette.text,
          border: `1px solid ${withAlpha(t.palette.accent, 0.45)}`,
          boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 80px ${withAlpha(
            t.palette.accent,
            0.35,
          )}`,
          textAlign: 'center',
          animation: wrong ? 'shake 0.5s' : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.5,
          }}
        >
          <Particles template={state.template} density={0.9} />
        </div>
        <Grain />

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 64,
            height: 3,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${t.palette.accent}, ${t.palette.accent2})`,
          }}
        />

        <div style={{ position: 'relative', zIndex: 5 }}>
          {phase === 'intro' && <IntroPhase t={t} />}
          {phase === 'quiz' && (
            <QuizPhase
              style={style}
              step={answers.length}
              revealed={revealed}
              fromName={state.fromName}
              wrong={wrong}
              t={t}
              customContent={state.revealContent}
              onAnswer={submit}
            />
          )}
          {phase === 'reveal' && (
            <RevealPhase
              fromName={state.fromName}
              toName={state.toName}
              t={t}
              onContinue={onDone}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function IntroPhase({ t }: { t: TemplateDef }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
      }}
    >
      <Silhouette accent={t.palette.accent} glow={20} />
      <div
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 20,
          color: t.palette.text,
          marginTop: 26,
          lineHeight: 1.35,
          animation: 'fadeInUp 1s 0.2s both',
        }}
      >
        Before we go any further…
      </div>
      <div
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 20,
          color: t.palette.accent,
          marginTop: 10,
          animation: 'fadeInUp 1s 0.9s both',
        }}
      >
        Can you guess who&apos;s been thinking of you?
      </div>
    </div>
  );
}

function QuizPhase({
  style,
  step,
  revealed,
  fromName,
  wrong,
  t,
  customContent,
  onAnswer,
}: {
  style: 'three_clues' | 'trivia' | 'sensory';
  step: number;
  revealed: number;
  fromName: string;
  wrong: boolean;
  t: TemplateDef;
  customContent: RevealContent | null;
  onAnswer: (correct: boolean) => void;
}) {
  const customClues =
    customContent?.style === 'three_clues' ? customContent.clues : undefined;
  const customDecoys =
    customContent?.style === 'three_clues' ? customContent.decoys : undefined;
  const customTrivia =
    customContent?.style === 'trivia' ? customContent.questions : undefined;
  const customSensory =
    customContent?.style === 'sensory' ? customContent.questions : undefined;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeInUp 0.6s both',
      }}
    >
      <Silhouette accent={t.palette.accent} glow={10 + revealed * 8} />
      {/* three_clues progresses in its own internal steps (read clues → pick
          name), so its final correct answer fills the name in one beat at
          the reveal phase. The gradual NameProgress bar only makes sense
          for styles with multiple answers (trivia / sensory). */}
      {style !== 'three_clues' && (
        <NameProgress name={fromName} revealed={revealed} />
      )}
      <div style={{ width: '100%', padding: '0 4px' }}>
        {style === 'three_clues' && (
          <ThreeCluesQuiz
            fromName={fromName}
            onAnswer={onAnswer}
            customClues={customClues}
            customDecoys={customDecoys}
            t={t}
          />
        )}
        {style === 'trivia' && (
          <TriviaQuiz
            step={step}
            onAnswer={onAnswer}
            customQuestions={customTrivia}
            t={t}
          />
        )}
        {style === 'sensory' && (
          <SensoryQuiz
            step={step}
            onAnswer={onAnswer}
            customQuestions={customSensory}
            t={t}
          />
        )}
      </div>
      {wrong && (
        <div style={{ marginTop: 10, fontSize: 13, color: '#ffb6c1' }}>
          Not quite — try again 💕
        </div>
      )}
    </div>
  );
}

function RevealPhase({
  fromName,
  toName,
  t,
  onContinue,
}: {
  fromName: string;
  toName: string;
  t: TemplateDef;
  onContinue: () => void;
}) {
  const firstTo = toName.trim().split(/\s+/)[0] || 'you';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 0 10px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -40,
          background: 'rgba(255,255,255,0.9)',
          animation: 'flashOut 0.8s 0.1s both',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 16,
          color: t.palette.muted,
          lineHeight: 1.4,
          position: 'relative',
          zIndex: 3,
          maxWidth: 300,
        }}
      >
        {firstTo}, you knew who it was all along, right?
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.1 }}
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontSize: 22,
          color: t.palette.text,
          marginTop: 22,
          lineHeight: 1.2,
          position: 'relative',
          zIndex: 3,
        }}
      >
        It&apos;s me,
      </motion.div>

      <div
        style={{
          fontFamily: t.fonts.display,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 46,
          color: t.palette.text,
          lineHeight: 1,
          marginTop: 6,
          textShadow: `0 0 40px ${t.palette.accent}, 0 0 80px ${withAlpha(t.palette.accent, 0.5)}`,
          animation: 'nameGlow 1.4s 1.3s both',
          position: 'relative',
          zIndex: 3,
        }}
      >
        {fromName}
      </div>

      <motion.button
        onClick={onContinue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.4 }}
        style={{
          marginTop: 32,
          padding: '12px 28px',
          borderRadius: 99,
          background: withAlpha(t.palette.accent, 0.18),
          border: `1px solid ${t.palette.accent}`,
          color: t.palette.text,
          fontSize: 13,
          letterSpacing: 1.5,
          cursor: 'pointer',
          fontFamily: t.fonts.body,
          position: 'relative',
          zIndex: 3,
        }}
      >
        Continue →
      </motion.button>
    </div>
  );
}
