'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FLOWS, TEMPLATES } from '@/lib/tokens';
import type { OrderState, TemplateDef } from '@/lib/types';
import { Grain, Particles } from '../../particles';
import { BackgroundMusic } from './background-music';
import { QuestionCard } from './question-card';
import { YesCard } from './yes-card';
import {
  ChapterTitle,
  ContactCardBubble,
  InlineGallery,
  PhotoBubble,
  ReadyCheckBubble,
  SectionChip,
  SystemBubble,
  TextBubble,
  TypingDots,
  withAlpha,
} from './bubbles';
import { ChatHeader } from './chat-header';
import { ChatComposer } from './chat-composer';
import { LetterPopup } from './letter-popup';
import { RevealModal } from './reveal-modal';
import { VideoPopup } from './video-popup';
import { buildScript, isSilentKind, sectionsFor, type ChatMessage } from './script';
import { useChatEngine } from './use-chat-engine';
import { motion, AnimatePresence } from 'motion/react';

type Phase = 'chat' | 'question' | 'yes';

export function ChatJourney({
  state,
  onReset,
}: {
  state: OrderState;
  onReset?: () => void;
}) {
  const t = TEMPLATES[state.template];
  const flow = FLOWS[state.flow];
  const sub = flow?.subFlows[state.subFlow];

  const [phase, setPhase] = useState<Phase>('chat');
  const [hearts, setHearts] = useState(0);
  const [reactions, setReactions] = useState<string[]>([]);
  const [startTime] = useState<number>(() => Date.now());
  const [identityRevealed, setIdentityRevealed] = useState(!state.isAnonymous);
  const [revealOpen, setRevealOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterShown, setLetterShown] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoShown, setVideoShown] = useState(false);
  const [readyConfirmed, setReadyConfirmed] = useState(false);
  // Gate the whole flow behind a tap when there's a song. That tap is the
  // browser-required user gesture that lets the YouTube iframe unmute
  // without waiting for scroll/touch deep in the chat. No song → no gate,
  // the chat starts immediately.
  const [started, setStarted] = useState(!state.musicVideoId);

  const messages = useMemo(() => buildScript(state), [state]);
  const sections = useMemo(() => sectionsFor(state), [state]);

  const engine = useChatEngine(
    messages,
    !started || revealOpen || letterOpen || videoOpen,
  );

  const letterMsg = useMemo(
    () => messages.find((m): m is Extract<ChatMessage, { kind: 'letter' }> => m.kind === 'letter'),
    [messages],
  );
  const videoMsg = useMemo(
    () => messages.find((m): m is Extract<ChatMessage, { kind: 'video' }> => m.kind === 'video'),
    [messages],
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // The letter popup opens automatically when its typing window ends. The
  // reveal is NOT auto-opened — the receiver must tap the contact-card bubble
  // herself (see ContactCardBubble onTap → setRevealOpen(true) below).
  useEffect(() => {
    const last = engine.shownMessages[engine.shownMessages.length - 1];
    if (last?.kind === 'letter' && !letterShown && !letterOpen) {
      setLetterOpen(true);
    }
    if (last?.kind === 'video' && !videoShown && !videoOpen) {
      setVideoOpen(true);
    }
  }, [engine.shownMessages, letterShown, letterOpen, videoShown, videoOpen]);

  const lastShown = engine.shownMessages[engine.shownMessages.length - 1];
  const awaitingRevealTap =
    state.isAnonymous &&
    !identityRevealed &&
    lastShown?.kind === 'contact-card';

  // Auto-scroll to the bottom as new bubbles appear. We detect user intent
  // by watching scroll position — if she's within 80px of the bottom, we
  // assume she's keeping up and keep auto-scrolling. If she scrolls up to
  // read back, we stop chasing until she returns.
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;
    // Wait for layout so the new bubble's height is included in scrollHeight,
    // then pin scroll to the bottom. scrollTop/scrollHeight is more reliable
    // across browsers than scrollIntoView on a nested container.
    const raf = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(raf);
  }, [engine.shownMessages.length, engine.isTyping, engine.locked, autoScroll]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAutoScroll(nearBottom);
  };

  // Transition out of chat only after the engine reports complete AND the
  // receiver has tapped one of the ready-check buttons. The engine completes
  // as soon as the ready-check bubble renders; we wait for the tap so she
  // chooses when the question card opens.
  useEffect(() => {
    if (engine.complete && readyConfirmed && phase === 'chat') {
      const id = setTimeout(() => setPhase('question'), 600);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [engine.complete, readyConfirmed, phase]);

  const handleRevealDone = () => {
    setIdentityRevealed(true);
    setRevealOpen(false);
    setTimeout(() => engine.advance(), 700);
  };

  const handleLetterClose = () => {
    setLetterOpen(false);
    setLetterShown(true);
    setTimeout(() => engine.advance(), 400);
  };

  const handleVideoClose = () => {
    setVideoOpen(false);
    setVideoShown(true);
    setTimeout(() => engine.advance(), 400);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
      return;
    }
    // Fallback: reload to restart the journey
    if (typeof window !== 'undefined') window.location.reload();
  };

  const displayName = identityRevealed ? state.fromName : 'Someone special';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at top, ${t.palette.bg2} 0%, ${t.palette.bg} 85%)`,
        color: t.palette.text,
        overflow: 'hidden',
      }}
    >
      <Particles template={state.template} density={0.3} />
      <Grain />
      <EntryGate
        open={!started}
        state={state}
        t={t}
        onStart={() => setStarted(true)}
      />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <ChatHeader
          displayName={displayName}
          revealed={identityRevealed}
          sections={sections}
          currentSection={engine.currentSection}
          t={t}
          onBack={handleReset}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10 }}>
          {engine.shownMessages.map((m) => (
            <BubbleFor
              key={m.id}
              msg={m}
              state={state}
              t={t}
              identityRevealed={identityRevealed}
              onReact={(emoji) => setReactions((r) => [...r, emoji])}
              onOpenReveal={() => setRevealOpen(true)}
              onReadyConfirm={() => setReadyConfirmed(true)}
            />
          ))}
          {engine.isTyping && !isSilentKind(nextKind(messages, engine.shownMessages.length)) && (
            <TypingDots t={t} />
          )}
          {engine.locked && !awaitingRevealTap && (
            <SectionChip
              label="tap to see more"
              t={t}
              onTap={() => {
                setAutoScroll(true);
                engine.advance();
              }}
            />
          )}
          {engine.reduced && !engine.complete && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '6px 0',
              }}
            >
              <button
                onClick={engine.skip}
                style={{
                  padding: '6px 14px',
                  borderRadius: 99,
                  border: `1px solid ${withAlpha(t.palette.text, 0.2)}`,
                  background: 'transparent',
                  color: t.palette.muted,
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: t.fonts.body,
                }}
              >
                skip to end
              </button>
            </div>
          )}
          <div ref={bottomRef} style={{ height: 96 }} />
        </div>
        <ChatComposer
          t={t}
          hearts={hearts}
          onHeart={() => setHearts((h) => h + 1)}
          disabled={engine.complete}
        />
      </div>
      {revealOpen && <RevealModal state={state} t={t} onDone={handleRevealDone} />}
      {letterMsg && (
        <LetterPopup
          open={letterOpen}
          text={letterMsg.text}
          signatureName={letterMsg.signatureName}
          anonSignature={state.isAnonymous && !identityRevealed}
          t={t}
          onReact={(emoji) => setReactions((r) => [...r, emoji])}
          onClose={handleLetterClose}
        />
      )}
      {videoMsg && (
        <VideoPopup
          open={videoOpen}
          poster={videoMsg.url}
          videoUrl={videoMsg.videoUrl}
          videoUrls={videoMsg.videoUrls}
          treatment={videoMsg.treatment}
          fromName={state.fromName}
          toName={state.toName}
          t={t}
          onClose={handleVideoClose}
        />
      )}
      {phase === 'question' && sub && (
        <QuestionCard
          state={state}
          sub={sub}
          t={t}
          onYes={() => setPhase('yes')}
        />
      )}
      {phase === 'yes' && sub && (
        <YesCard
          state={state}
          sub={sub}
          t={t}
          hearts={hearts}
          reactions={reactions}
          startTime={startTime}
        />
      )}
      {state.musicVideoId && (
        <BackgroundMusic
          videoId={state.musicVideoId}
          startSeconds={state.musicStartSeconds}
          t={t}
        />
      )}
    </div>
  );
}

function nextKind(
  messages: ChatMessage[],
  shownCount: number,
): ChatMessage['kind'] | undefined {
  return messages[shownCount]?.kind;
}

function BubbleFor({
  msg,
  t,
  onOpenReveal,
  onReadyConfirm,
}: {
  msg: ChatMessage;
  state: OrderState;
  t: TemplateDef;
  identityRevealed: boolean;
  onReact: (emoji: string) => void;
  onOpenReveal: () => void;
  onReadyConfirm: () => void;
}) {
  switch (msg.kind) {
    case 'text':
      return <TextBubble text={msg.text} italic={msg.italic} emphasis={msg.emphasis} t={t} />;
    case 'photo':
      return <PhotoBubble url={msg.url} t={t} />;
    case 'chapter-title':
      return <ChapterTitle text={msg.text} t={t} />;
    case 'gallery':
      return <InlineGallery urls={msg.urls} layout={msg.layout} t={t} />;
    case 'video':
      // Rendered via VideoPopup overlay — no inline bubble.
      return null;
    case 'letter':
      // Rendered via LetterPopup overlay — no inline bubble.
      return null;
    case 'ready-check':
      return <ReadyCheckBubble t={t} onConfirm={onReadyConfirm} />;
    case 'contact-card':
      return (
        <>
          <SystemBubble text="Incoming identity request" t={t} />
          <ContactCardBubble
            title={msg.title}
            subtitle={msg.subtitle}
            t={t}
            onTap={onOpenReveal}
          />
        </>
      );
    default:
      return null;
  }
}

function EntryGate({
  open,
  state,
  t,
  onStart,
}: {
  open: boolean;
  state: OrderState;
  t: TemplateDef;
  onStart: () => void;
}) {
  // Showing the real first name for the signed case makes the gate feel
  // personally addressed; anonymous keeps it neutral.
  const firstTo = state.isAnonymous
    ? 'you'
    : (state.toName.trim().split(/\s+/)[0] || 'you');

  return (
    <AnimatePresence>
      {open && (
        <motion.button
          onClick={onStart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 200,
            background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 80%)`,
            color: t.palette.text,
            border: 'none',
            cursor: 'pointer',
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 22,
            fontFamily: t.fonts.body,
            textAlign: 'center',
          }}
          aria-label="Tap to begin"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.9, 0.3, 1] }}
            style={{
              fontSize: 56,
              color: t.palette.accent,
              filter: `drop-shadow(0 0 28px ${withAlpha(t.palette.accent, 0.55)})`,
              animation: 'pulseBreath 3s infinite',
            }}
          >
            ♥
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            style={{
              fontFamily: t.fonts.display,
              fontStyle: 'italic',
              fontSize: 'clamp(22px, 6vw, 30px)',
              lineHeight: 1.3,
              color: t.palette.text,
              maxWidth: 360,
              textShadow: `0 0 40px ${withAlpha(t.palette.accent, 0.25)}`,
            }}
          >
            A little something for {firstTo}.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              fontFamily: t.fonts.display,
              fontStyle: 'italic',
              fontSize: 15,
              color: t.palette.muted,
              maxWidth: 300,
              lineHeight: 1.6,
            }}
          >
            Take a breath. Let it come slowly.
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{
              marginTop: 12,
              padding: '14px 28px',
              borderRadius: 99,
              border: `1px solid ${t.palette.accent}`,
              background: withAlpha(t.palette.accent, 0.18),
              color: t.palette.text,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1.3,
              boxShadow: `0 0 30px ${withAlpha(t.palette.accent, 0.4)}`,
              animation: 'pulseBreath 2.2s infinite',
            }}
          >
            Tap anywhere to begin →
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
