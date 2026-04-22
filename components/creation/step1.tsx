'use client';

import React from 'react';
import type { OrderState, RevealDifficulty, RevealStyle } from '@/lib/types';
import { Field } from './creation-flow';

type SetState = React.Dispatch<React.SetStateAction<OrderState>>;

export function Step1({ state, setState }: { state: OrderState; setState: SetState }) {
  const flowAllowsAnon =
    (state.flow === 'propose' && state.subFlow === 'love') ||
    (state.flow === 'birthday' && state.subFlow === 'anonymous');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.15,
          }}
        >
          About you two
        </div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
          Tell us who this moment is for.
        </div>
      </div>
      <Field
        label="Your name"
        value={state.fromName}
        onChange={(v) => setState((s) => ({ ...s, fromName: v }))}
        placeholder="Arjun"
      />
      <Field
        label="Their name"
        value={state.toName}
        onChange={(v) => setState((s) => ({ ...s, toName: v }))}
        placeholder="Priya"
      />
      <Field
        label="Your story (optional)"
        value={state.story}
        onChange={(v) => setState((s) => ({ ...s, story: v }))}
        placeholder="We met on a rainy train in Goa…"
        multiline
        maxLength={280}
      />
      {flowAllowsAnon && (
        <div
          style={{
            background: 'linear-gradient(135deg, #faf4ff, #f0e9ff)',
            border: '1px solid #d9c9ff',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={state.isAnonymous}
              onChange={(e) => setState((s) => ({ ...s, isAnonymous: e.target.checked }))}
              style={{ marginTop: 3 }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Make this a surprise ✨</div>
              <div style={{ fontSize: 12, color: '#6b5b8a', marginTop: 3, lineHeight: 1.5 }}>
                Keep me anonymous until they solve a small quiz. Name revealed cinematically before the big moment.
              </div>
            </div>
          </label>
          {state.isAnonymous && <RevealBuilder state={state} setState={setState} />}
        </div>
      )}
      <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 8 }}>
        No account needed · No password · Zero friction
      </div>
    </div>
  );
}

function RevealBuilder({ state, setState }: { state: OrderState; setState: SetState }) {
  const styles: { id: RevealStyle; name: string; desc: string }[] = [
    { id: 'three_clues', name: 'Three Clues', desc: 'Write 3 hints; they guess from 4 names' },
    { id: 'trivia', name: 'Trivia Quiz', desc: "3 multi-choice questions only they'd know" },
    { id: 'sensory', name: 'Sensory Unlock', desc: 'Pick a color, a song vibe, a memory' },
  ];
  const difficulties: RevealDifficulty[] = ['easy', 'medium', 'hard'];
  return (
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed #d9c9ff' }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#6b5b8a',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Reveal Style
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {styles.map((sOpt) => (
          <button
            key={sOpt.id}
            onClick={() => setState((st) => ({ ...st, revealStyle: sOpt.id }))}
            style={{
              padding: 12,
              borderRadius: 10,
              border: '1px solid',
              borderColor: state.revealStyle === sOpt.id ? '#8b5cf6' : '#e4dbf5',
              background: state.revealStyle === sOpt.id ? '#faf4ff' : '#fff',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13 }}>{sOpt.name}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{sOpt.desc}</div>
          </button>
        ))}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#6b5b8a',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginTop: 14,
          marginBottom: 8,
        }}
      >
        Difficulty
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setState((st) => ({ ...st, revealDifficulty: d }))}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: '1px solid',
              borderColor: state.revealDifficulty === d ? '#8b5cf6' : '#e4dbf5',
              background: state.revealDifficulty === d ? '#8b5cf6' : '#fff',
              color: state.revealDifficulty === d ? '#fff' : '#555',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
