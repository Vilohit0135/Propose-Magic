'use client';

import React, { useState } from 'react';
import { FLOWS, TEMPLATES } from '@/lib/tokens';
import type { OrderState } from '@/lib/types';
import {
  Scene1Opening,
  Scene2Began,
  Scene3Memories,
  Scene4Letter,
} from './scenes-1-4';
import {
  Scene5Pause,
  Scene5_5Reveal,
  Scene6Question,
  Scene7Yes,
} from './scenes-5-7';
import { ChatJourney } from './chat/chat-journey';

type SceneId =
  | 'opening'
  | 'began'
  | 'memories'
  | 'letter'
  | 'pause'
  | 'reveal'
  | 'question'
  | 'yes';

export function buildSceneList(state: OrderState): { id: SceneId }[] {
  const scenes: { id: SceneId }[] = [{ id: 'opening' }];
  if (state.package !== 'basic') scenes.push({ id: 'began' }, { id: 'memories' });
  scenes.push({ id: 'letter' });
  if (state.package === 'photos_video') scenes.push({ id: 'pause' });
  if (state.isAnonymous) scenes.push({ id: 'reveal' });
  scenes.push({ id: 'question' }, { id: 'yes' });
  return scenes;
}

// Chat-thread reframe ships for proposal flow only in v1. All other flows
// (birthday / valentines / anniversary) continue to render the legacy scene
// journey until the pattern is validated on the highest-revenue surface.
export function ReceiverJourney({
  state,
  onReset,
}: {
  state: OrderState;
  onReset?: () => void;
}) {
  if (state.flow === 'propose') {
    return <ChatJourney state={state} onReset={onReset} />;
  }
  return <LegacyReceiverJourney state={state} onReset={onReset} />;
}

function LegacyReceiverJourney({
  state,
  onReset,
}: {
  state: OrderState;
  onReset?: () => void;
}) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const handleReset = onReset ?? (() => setSceneIdx(0));
  const t = TEMPLATES[state.template];
  const flow = FLOWS[state.flow];
  const sub = flow?.subFlows[state.subFlow];
  const scenes = buildSceneList(state);

  const [hearts, setHearts] = useState(0);
  const [reactions, setReactions] = useState<string[]>([]);
  const [startTime] = useState<number>(() => Date.now());

  const next = () => setSceneIdx((i) => Math.min(i + 1, scenes.length - 1));

  const scene = scenes[sceneIdx];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: t.palette.bg,
        color: t.palette.text,
        fontFamily: t.fonts.body,
      }}
    >
      <div
        key={scene.id}
        style={{ position: 'absolute', inset: 0, animation: 'sceneFadeIn 0.8s' }}
      >
        {scene.id === 'opening' && <Scene1Opening state={state} t={t} onTap={next} />}
        {scene.id === 'began' && <Scene2Began state={state} t={t} onTap={next} />}
        {scene.id === 'memories' && <Scene3Memories state={state} t={t} onTap={next} />}
        {scene.id === 'letter' && (
          <Scene4Letter
            state={state}
            t={t}
            setReactions={setReactions}
            onTap={next}
          />
        )}
        {scene.id === 'pause' && <Scene5Pause state={state} onTap={next} />}
        {scene.id === 'reveal' && <Scene5_5Reveal state={state} onTap={next} />}
        {scene.id === 'question' && sub && (
          <Scene6Question state={state} t={t} sub={sub} onYes={next} />
        )}
        {scene.id === 'yes' && sub && (
          <Scene7Yes
            state={state}
            t={t}
            sub={sub}
            hearts={hearts}
            reactions={reactions}
            startTime={startTime}
            onReset={handleReset}
          />
        )}
      </div>

      {/* progress bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(255,255,255,0.08)',
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${((sceneIdx + 1) / scenes.length) * 100}%`,
            background: t.palette.accent,
            transition: 'width 0.6s',
            boxShadow: `0 0 8px ${t.palette.accent}`,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 58,
          right: 16,
          fontSize: 11,
          color: t.palette.muted,
          zIndex: 50,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: 1,
        }}
      >
        {sceneIdx + 1} / {scenes.length}
      </div>
      <button
        onClick={handleReset}
        style={{
          position: 'absolute',
          top: 50,
          left: 16,
          zIndex: 50,
          width: 34,
          height: 34,
          borderRadius: 99,
          border: 'none',
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          fontSize: 16,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}
      >
        ←
      </button>

      {scene.id !== 'yes' && scene.id !== 'reveal' && (
        <HeartTapButton
          hearts={hearts}
          onTap={() => setHearts((h) => h + 1)}
          accent={t.palette.accent}
        />
      )}
    </div>
  );
}

function HeartTapButton({
  hearts,
  onTap,
  accent,
}: {
  hearts: number;
  onTap: () => void;
  accent: string;
}) {
  const [floaters, setFloaters] = useState<{ id: number; x: number }[]>([]);
  const handle = () => {
    onTap();
    const id = Math.random();
    setFloaters((f) => [...f, { id, x: (Math.random() - 0.5) * 40 }]);
    setTimeout(() => setFloaters((f) => f.filter((fl) => fl.id !== id)), 1600);
  };
  const glow = Math.min(hearts * 3, 40);
  return (
    <button
      onClick={handle}
      style={{
        position: 'absolute',
        bottom: 20,
        right: 16,
        zIndex: 60,
        width: 50,
        height: 50,
        borderRadius: 99,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: accent,
        fontSize: 22,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 ${glow}px ${accent}`,
        transition: 'box-shadow 0.3s',
      }}
    >
      ♥
      {hearts > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: accent,
            color: '#000',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 99,
            padding: '1px 6px',
            minWidth: 14,
          }}
        >
          {hearts}
        </span>
      )}
      {floaters.map((f) => {
        const s: React.CSSProperties = {
          position: 'absolute',
          left: '50%',
          top: '50%',
          color: accent,
          fontSize: 20,
          pointerEvents: 'none',
          animation: 'heartFloat 1.6s ease-out forwards',
        };
        (s as Record<string, string>)['--fx'] = `${f.x}px`;
        return (
          <span key={f.id} style={s}>
            ♥
          </span>
        );
      })}
    </button>
  );
}
