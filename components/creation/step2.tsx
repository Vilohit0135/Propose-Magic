'use client';

import React from 'react';
import { FLOWS, TEMPLATES, TONES } from '@/lib/tokens';
import type { FlowId, OrderState, TemplateId, ToneId } from '@/lib/types';
import { cardBtn, rowBtn, SectionLabel } from './creation-flow';

type SetState = React.Dispatch<React.SetStateAction<OrderState>>;

export function Step2({ state, setState }: { state: OrderState; setState: SetState }) {
  const flow = FLOWS[state.flow];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 500, lineHeight: 1.15 }}>
          The occasion
        </div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
          Pick your flow and style — we&apos;ll default anything you skip.
        </div>
      </div>
      {/* Flow picker */}
      <div>
        <SectionLabel>Flow</SectionLabel>
        <div
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            padding: '4px 2px 10px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            margin: '0 -2px',
          }}
        >
          {(Object.entries(FLOWS) as [FlowId, (typeof FLOWS)[FlowId]][]).map(([id, f]) => {
            const comingSoon = id !== 'propose';
            const active = state.flow === id;
            const baseBg = active
              ? 'linear-gradient(165deg, #8b1538 0%, #c9748a 100%)'
              : comingSoon
                ? 'linear-gradient(160deg, #faf7f2 0%, #f5efe7 100%)'
                : 'linear-gradient(160deg, #fff5f7 0%, #fdeaf0 100%)';
            const borderColor = active
              ? '#8b1538'
              : comingSoon
                ? '#ece6db'
                : '#f3d7de';
            const textColor = active
              ? '#fff5f7'
              : comingSoon
                ? '#a99a8a'
                : '#8b1538';
            return (
              <button
                key={id}
                disabled={comingSoon}
                aria-disabled={comingSoon}
                onClick={() => {
                  if (comingSoon) return;
                  const firstSub = Object.keys(f.subFlows)[0];
                  const defTemplate = f.subFlows[firstSub].defaultTemplate;
                  setState((s) => ({
                    ...s,
                    flow: id,
                    subFlow: firstSub,
                    template: defTemplate,
                  }));
                }}
                style={{
                  ...cardBtn(active),
                  position: 'relative',
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start',
                  minWidth: 148,
                  padding: '22px 20px 18px',
                  borderRadius: 16,
                  borderWidth: '1.5px',
                  cursor: comingSoon ? 'not-allowed' : 'pointer',
                  background: baseBg,
                  borderColor,
                  color: textColor,
                  boxShadow: active
                    ? '0 14px 34px -18px rgba(139,21,56,0.6), inset 0 0 0 1px rgba(255,245,247,0.15)'
                    : comingSoon
                      ? 'none'
                      : '0 8px 22px -18px rgba(201,116,138,0.5)',
                  transition: 'all 0.22s cubic-bezier(.2,.9,.3,1)',
                }}
              >
                <div
                  style={{
                    fontSize: 30,
                    filter: comingSoon ? 'grayscale(1) opacity(0.55)' : 'none',
                    marginBottom: 4,
                  }}
                >
                  {f.icon}
                </div>
                <div
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 19,
                    lineHeight: 1.1,
                    letterSpacing: 0.3,
                    textShadow: active
                      ? '0 0 22px rgba(255,245,247,0.35)'
                      : 'none',
                  }}
                >
                  {f.name}
                </div>
                {comingSoon && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      padding: '2px 8px',
                      borderRadius: 99,
                      background: '#fff',
                      border: '1px solid #e5d9d0',
                      color: '#b08a6e',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                    }}
                  >
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
          Swipe to see all four · Proposal flow is live now. Birthday, Valentine&apos;s and
          Anniversary launch soon.
        </div>
      </div>
      {/* Sub-flow */}
      {flow && (
        <div>
          <SectionLabel>
            {state.flow === 'valentines' ? 'Day' : state.flow === 'anniversary' ? 'Milestone' : 'Sub-flow'}
          </SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(flow.subFlows).map(([id, sf]) => (
              <button
                key={id}
                onClick={() => setState((s) => ({ ...s, subFlow: id, template: sf.defaultTemplate }))}
                style={{
                  ...rowBtn(state.subFlow === id),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{sf.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>&quot;{sf.question}&quot;</div>
                </div>
                <div style={{ fontSize: 22 }}>{sf.particle}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Tone */}
      <div>
        <SectionLabel>Tone</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(Object.keys(TONES) as ToneId[]).map((id) => (
            <button
              key={id}
              onClick={() => setState((s) => ({ ...s, tone: id }))}
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                border: '1px solid',
                borderColor: state.tone === id ? '#1a1a1a' : '#e0e0e0',
                background: state.tone === id ? '#1a1a1a' : '#fff',
                color: state.tone === id ? '#fff' : '#444',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      {/* Template */}
      <div>
        <SectionLabel>Visual Template</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(Object.entries(TEMPLATES) as [TemplateId, (typeof TEMPLATES)[TemplateId]][]).map(
            ([id, t]) => (
              <button
                key={id}
                onClick={() => setState((s) => ({ ...s, template: id }))}
                style={{
                  padding: 0,
                  borderRadius: 14,
                  border: '2px solid',
                  borderColor: state.template === id ? t.palette.accent : 'transparent',
                  background: 'transparent',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
              >
                <TemplateThumbnail template={id} toName={state.toName} />
                <div style={{ padding: '8px 10px', background: '#fff', textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: '#888' }}>{t.vibe}</div>
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export function TemplateThumbnail({ template, toName }: { template: TemplateId; toName: string }) {
  const t = TEMPLATES[template];
  return (
    <div
      style={{
        position: 'relative',
        height: 90,
        overflow: 'hidden',
        background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 100%)`,
      }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${15 + i * 22}%`,
            top: `${20 + (i % 2) * 40}%`,
            fontSize: 10,
            opacity: 0.5,
            animation: `particleRise ${4 + i}s linear ${-i}s infinite`,
          }}
        >
          {t.particle}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 14,
            color: t.palette.text,
            textAlign: 'center',
            textShadow: `0 0 12px ${t.palette.accent}80`,
          }}
        >
          A message for
          <br />
          <span style={{ color: t.palette.accent, fontSize: 16 }}>{toName || 'Priya'}</span>
        </div>
      </div>
    </div>
  );
}
