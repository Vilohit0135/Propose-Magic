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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(Object.entries(FLOWS) as [FlowId, (typeof FLOWS)[FlowId]][]).map(([id, f]) => (
            <button
              key={id}
              onClick={() => {
                const firstSub = Object.keys(f.subFlows)[0];
                const defTemplate = f.subFlows[firstSub].defaultTemplate;
                setState((s) => ({ ...s, flow: id, subFlow: firstSub, template: defTemplate }));
              }}
              style={cardBtn(state.flow === id)}
            >
              <div style={{ fontSize: 28 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{f.name}</div>
            </button>
          ))}
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
