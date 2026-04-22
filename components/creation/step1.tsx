'use client';

import React from 'react';
import type { Gender, OrderState, RevealDifficulty, RevealStyle } from '@/lib/types';
import { Field, SectionLabel } from './creation-flow';

type SetState = React.Dispatch<React.SetStateAction<OrderState>>;

const GENDERS: { id: Gender; label: string; pronoun: string }[] = [
  { id: 'he', label: 'He / him', pronoun: 'him' },
  { id: 'she', label: 'She / her', pronoun: 'her' },
  { id: 'they', label: 'They / them', pronoun: 'them' },
];

export function Step1({ state, setState }: { state: OrderState; setState: SetState }) {
  // Anonymous is available on every propose sub-flow.
  const flowAllowsAnon = state.flow === 'propose';
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

      <div>
        <SectionLabel>You are</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {GENDERS.map((g) => {
            const active = state.fromGender === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setState((s) => ({ ...s, fromGender: g.id }))}
                style={{
                  padding: '12px 10px',
                  borderRadius: 12,
                  border: '1px solid',
                  borderColor: active ? '#1a1a1a' : '#e0e0e0',
                  background: active ? '#1a1a1a' : '#fff',
                  color: active ? '#fff' : '#1a1a1a',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {g.label}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
          We&apos;ll use the right pronouns in the letter and on her page.
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

      <GamificationCard state={state} setState={setState} flowAllowsAnon={flowAllowsAnon} />

      <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 8 }}>
        No account needed · No password · Zero friction
      </div>
    </div>
  );
}

function GamificationCard({
  state,
  setState,
  flowAllowsAnon,
}: {
  state: OrderState;
  setState: SetState;
  flowAllowsAnon: boolean;
}) {
  const items: { icon: string; name: string; desc: string }[] = [
    {
      icon: '♥',
      name: 'Heart taps',
      desc: 'She taps a heart as she reads — count shows up on the final page.',
    },
    {
      icon: '😍',
      name: 'Letter reactions',
      desc: 'Five emoji she can pick on the big letter. Saved and shown at the yes screen.',
    },
    {
      icon: '→',
      name: 'Dodging “No”',
      desc: 'The No button jumps when she tries to tap it. Playful tension before yes.',
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #ececec',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#555',
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        Gamification built in
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it) => (
          <div key={it.name} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div
              style={{
                flexShrink: 0,
                width: 26,
                height: 26,
                borderRadius: 99,
                background: '#fff5f7',
                border: '1px solid #f3d7de',
                color: '#c9748a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {it.icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{it.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2, lineHeight: 1.5 }}>
                {it.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {flowAllowsAnon && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed #eee' }}>
          <label
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={state.isAnonymous}
              onChange={(e) =>
                setState((s) => ({ ...s, isAnonymous: e.target.checked }))
              }
              style={{ marginTop: 3 }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                Anonymous reveal (optional) ✨
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#888',
                  marginTop: 3,
                  lineHeight: 1.5,
                }}
              >
                Hide your name behind a small quiz. She has to solve it to see who&apos;s
                been writing — your name crossfades in across every prior message the moment
                she does.
              </div>
            </div>
          </label>
          {state.isAnonymous && <RevealBuilder state={state} setState={setState} />}
        </div>
      )}
    </div>
  );
}

function RevealBuilder({ state, setState }: { state: OrderState; setState: SetState }) {
  const styles: { id: RevealStyle; name: string; desc: string }[] = [
    { id: 'three_clues', name: 'Three Clues', desc: 'Write 3 hints; she guesses from 4 names' },
    { id: 'trivia', name: 'Trivia Quiz', desc: "3 multi-choice questions only she'd know" },
    { id: 'sensory', name: 'Sensory Unlock', desc: 'She picks a color, a song vibe, a memory' },
  ];
  const difficulties: RevealDifficulty[] = ['easy', 'medium', 'hard'];
  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#6b5b8a',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginTop: 6,
          marginBottom: 8,
        }}
      >
        Reveal style
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
