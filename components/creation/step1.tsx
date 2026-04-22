'use client';

import React, { useState } from 'react';
import type { Gender, OrderState, RevealDifficulty, RevealStyle } from '@/lib/types';
import { Field, SectionLabel } from './creation-flow';
import { QuizEditorModal } from './quiz-editor-modal';

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
      <StoryField state={state} setState={setState} />

      <GamificationCard state={state} setState={setState} flowAllowsAnon={flowAllowsAnon} />

      <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 8 }}>
        No account needed · No password · Zero friction
      </div>
    </div>
  );
}

const STORY_MAX = 1500;

function StoryField({
  state,
  setState,
}: {
  state: OrderState;
  setState: SetState;
}) {
  const len = (state.story || '').length;
  const ratio = Math.min(1, len / 400); // "enough" benchmark — 400 chars of story is a solid amount
  const toFirst = state.toName.trim().split(/\s+/)[0] || 'them';
  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #fff5f7 0%, #fdeaf0 100%)',
        border: '1px solid #f3d7de',
        borderRadius: 16,
        padding: 18,
        boxShadow: '0 8px 24px -20px rgba(201,116,138,0.6)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 99,
            background: '#c9748a',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ✎
        </span>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#8b1538',
            fontWeight: 700,
          }}
        >
          Used to write the letter
        </div>
      </div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          fontSize: 22,
          color: '#1a1a1a',
          lineHeight: 1.2,
        }}
      >
        Tell us your story with {toFirst}.
      </div>
      <div
        style={{
          fontSize: 13,
          color: '#6b5560',
          lineHeight: 1.55,
          marginTop: 6,
        }}
      >
        This is what the AI uses to draft {toFirst}&apos;s letter. The more
        specific you get — real moments, inside jokes, what makes them them,
        how you felt — the more it will sound like <em>you</em>, not a template.
      </div>
      <textarea
        value={state.story}
        onChange={(e) =>
          setState((s) => ({ ...s, story: e.target.value.slice(0, STORY_MAX) }))
        }
        placeholder={`e.g. We met on a rainy train in Goa. She laughed at my terrible joke and I haven't stopped trying to impress her since. Her left dimple gives her away when she's holding in a smile. The night she told me about her grandmother, I knew.`}
        rows={6}
        style={{
          width: '100%',
          marginTop: 12,
          padding: 14,
          borderRadius: 12,
          border: '1px solid #efc6d0',
          fontSize: 15,
          fontFamily: 'inherit',
          lineHeight: 1.55,
          resize: 'vertical',
          minHeight: 140,
          maxHeight: 320,
          boxSizing: 'border-box',
          background: '#fff',
          color: '#1a1a1a',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 4,
            borderRadius: 99,
            background: '#f6dfe5',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${ratio * 100}%`,
              height: '100%',
              background: ratio >= 1 ? '#8b1538' : '#c9748a',
              transition: 'width 0.25s ease',
            }}
          />
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#8a6572',
            fontVariantNumeric: 'tabular-nums',
            minWidth: 76,
            textAlign: 'right',
          }}
        >
          {len}/{STORY_MAX}
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#8a6572', marginTop: 4, lineHeight: 1.5 }}>
        {ratio < 0.25
          ? 'Keep going — a few more details will make a big difference.'
          : ratio < 0.6
            ? 'Good start. Any more context you want the letter to carry?'
            : ratio < 1
              ? 'This will give a rich, personal letter.'
              : 'Plenty of material — the letter will feel unmistakably yours.'}
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
  const [editorOpen, setEditorOpen] = useState(false);
  const styles: { id: RevealStyle; name: string; desc: string }[] = [
    { id: 'three_clues', name: 'Three Clues', desc: 'Write 3 hints; she guesses from 4 names' },
    { id: 'trivia', name: 'Trivia Quiz', desc: "3 multi-choice questions only she'd know" },
    { id: 'sensory', name: 'Sensory Unlock', desc: 'She picks a color, a song vibe, a memory' },
  ];
  const difficulties: RevealDifficulty[] = ['easy', 'medium', 'hard'];

  const hasCustomContent =
    state.revealContent != null && state.revealContent.style === state.revealStyle;

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
            onClick={() =>
              setState((st) => ({
                ...st,
                revealStyle: sOpt.id,
                // Clear custom content when switching styles — it belongs to
                // the previous style and would no longer be valid.
                revealContent:
                  st.revealContent && st.revealContent.style === sOpt.id
                    ? st.revealContent
                    : null,
              }))
            }
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

      <button
        onClick={() => setEditorOpen(true)}
        style={{
          marginTop: 10,
          width: '100%',
          padding: '11px 14px',
          borderRadius: 10,
          border: '1px dashed #8b5cf6',
          background: hasCustomContent ? '#faf4ff' : 'transparent',
          color: '#6b5b8a',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <span>{hasCustomContent ? '✓ Your custom questions' : 'Customize questions'}</span>
        <span style={{ color: '#8b5cf6' }}>↗</span>
      </button>
      <div style={{ fontSize: 11, color: '#aaa', marginTop: 6, textAlign: 'center' }}>
        {hasCustomContent
          ? 'Tap to edit. Reset inside to go back to defaults.'
          : 'Optional — defaults work if you skip.'}
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

      {editorOpen && (
        <QuizEditorModal
          style={state.revealStyle}
          current={state.revealContent}
          fromName={state.fromName}
          story={state.story || ''}
          onSave={(next) => setState((st) => ({ ...st, revealContent: next }))}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
}
