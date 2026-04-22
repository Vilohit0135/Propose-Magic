'use client';

import React from 'react';
import {
  DEMO_PHOTOS,
  FLOWS,
  PACKAGES,
  PHOTO_LAYOUTS,
  TEMPLATES,
  VIDEO_TREATMENTS,
} from '@/lib/tokens';
import type { OrderState, PackageId, PhotoLayoutId, VideoTreatmentId } from '@/lib/types';
import { cardBtn, Field, SectionLabel } from './creation-flow';
import { TemplateThumbnail } from './step2';

type SetState = React.Dispatch<React.SetStateAction<OrderState>>;

export function Step3({ state, setState }: { state: OrderState; setState: SetState }) {
  if (state.package === 'basic') {
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
            Choose your package
          </div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
            Every package gets the full 7-scene journey. Media makes it richer.
          </div>
        </div>
        <PackagePicker state={state} setState={setState} />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.15,
          }}
        >
          Add your media
        </div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
          Drag to reorder. Tap any photo for caption.
        </div>
      </div>
      <PackagePicker state={state} setState={setState} compact />
      {/* Photo grid */}
      <div>
        <SectionLabel>Photos ({state.photos.length}/10)</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {state.photos.map((src, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 10,
                overflow: 'hidden',
                border: state.scratchIndex === i ? '2px solid #c9748a' : '1px solid #eee',
                cursor: 'pointer',
              }}
              onClick={() => setState((s) => ({ ...s, scratchIndex: i }))}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=""
              />
              {state.scratchIndex === i && (
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: '#c9748a',
                    color: '#fff',
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 99,
                    fontWeight: 600,
                  }}
                >
                  scratch
                </div>
              )}
            </div>
          ))}
          {state.photos.length < 10 && (
            <button
              onClick={() =>
                setState((s) => ({
                  ...s,
                  photos: [...s.photos, DEMO_PHOTOS[s.photos.length % DEMO_PHOTOS.length]],
                }))
              }
              style={{
                aspectRatio: '1',
                border: '2px dashed #c9748a',
                borderRadius: 10,
                background: '#fff5f7',
                fontSize: 24,
                color: '#c9748a',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
          Tap a photo to mark as scratch-to-reveal.
        </div>
      </div>
      {/* Layout */}
      <div>
        <SectionLabel>Photo Layout</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(
            Object.entries(PHOTO_LAYOUTS) as [
              PhotoLayoutId,
              (typeof PHOTO_LAYOUTS)[PhotoLayoutId],
            ][]
          ).map(([id, L]) => {
            const active = state.photoLayout === id;
            const preview =
              state.photos.length > 0 ? state.photos : DEMO_PHOTOS.slice(0, 4);
            return (
              <button
                key={id}
                onClick={() => setState((s) => ({ ...s, photoLayout: id }))}
                style={{
                  padding: 0,
                  borderRadius: 14,
                  border: '2px solid',
                  borderColor: active ? '#1a1a1a' : '#e0e0e0',
                  background: '#fff',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <LayoutPreview layout={id} photos={preview} />
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                    {L.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#888',
                      lineHeight: 1.4,
                      marginTop: 2,
                    }}
                  >
                    {L.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {state.package === 'photos_video' && (
        <div>
          <SectionLabel>Video Treatment</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(
              Object.entries(VIDEO_TREATMENTS) as [
                VideoTreatmentId,
                (typeof VIDEO_TREATMENTS)[VideoTreatmentId],
              ][]
            ).map(([id, V]) => (
              <button
                key={id}
                onClick={() => setState((s) => ({ ...s, videoTreatment: id }))}
                style={{
                  ...cardBtn(state.videoTreatment === id),
                  padding: 14,
                  alignItems: 'flex-start',
                  textAlign: 'left' as const,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>{V.name}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: state.videoTreatment === id ? '#ccc' : '#888',
                    lineHeight: 1.4,
                  }}
                >
                  {V.desc}
                </div>
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 10,
              background: '#f5f5f5',
              fontSize: 12,
              color: '#555',
              lineHeight: 1.5,
            }}
          >
            🎬 Clips Mode · Up to 5 clips mapped to scenes 1, 3, 5, 6, 7 ·{' '}
            <span style={{ color: '#888' }}>Full video mode in v3.1</span>
          </div>
        </div>
      )}
    </div>
  );
}

function PackagePicker({
  state,
  setState,
  compact,
}: {
  state: OrderState;
  setState: SetState;
  compact?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(Object.entries(PACKAGES) as [PackageId, (typeof PACKAGES)[PackageId]][]).map(
        ([id, pkg]) => (
          <button
            key={id}
            onClick={() => {
              const photos =
                id === 'basic' ? [] : state.photos.length ? state.photos : DEMO_PHOTOS.slice(0, 6);
              setState((s) => ({
                ...s,
                package: id,
                photos,
                scratchIndex: photos.length ? 0 : null,
              }));
            }}
            style={{
              padding: compact ? 12 : 18,
              borderRadius: 14,
              border: '1px solid',
              borderColor: state.package === id ? '#c9748a' : '#e0e0e0',
              background: state.package === id ? '#fff5f7' : '#fff',
              color: '#1a1a1a',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontWeight: 600, fontSize: compact ? 14 : 16 }}>{pkg.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{pkg.tagline}</div>
              </div>
              {!compact && (
                <div style={{ marginTop: 6, fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                  {pkg.features.slice(0, 2).map((f) => (
                    <div key={f}>· {f}</div>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: compact ? 20 : 26,
                fontWeight: 500,
              }}
            >
              ₹{pkg.price}
            </div>
          </button>
        )
      )}
    </div>
  );
}

export function Step4({ state, setState }: { state: OrderState; setState: SetState }) {
  const flow = FLOWS[state.flow];
  const sub = flow?.subFlows[state.subFlow];
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
          Review &amp; generate
        </div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
          One last look before we build their moment.
        </div>
      </div>
      <div
        style={{
          borderRadius: 14,
          border: '1px solid #eee',
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        <TemplateThumbnail template={state.template} toName={state.toName} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ReviewRow
            label="From"
            value={state.isAnonymous ? `${state.fromName} (hidden)` : state.fromName}
          />
          <ReviewRow label="To" value={state.toName} />
          <ReviewRow label="Flow" value={sub?.name ?? ''} />
          <ReviewRow label="Tone" value={state.tone} />
          <ReviewRow label="Template" value={TEMPLATES[state.template]?.name ?? ''} />
          <ReviewRow
            label="Package"
            value={`${PACKAGES[state.package]?.name} · ₹${PACKAGES[state.package]?.price}`}
          />
          {state.isAnonymous && (
            <ReviewRow label="Reveal" value={`${state.revealStyle} · ${state.revealDifficulty}`} />
          )}
          {state.photos.length > 0 && (
            <ReviewRow label="Photos" value={`${state.photos.length} uploaded`} />
          )}
        </div>
      </div>
      <Field
        label="Delivery email"
        value={state.email}
        onChange={(v) => setState((s) => ({ ...s, email: v }))}
        placeholder="you@example.com"
      />
      <div
        style={{
          background: '#f9f9f9',
          borderRadius: 12,
          padding: 14,
          fontSize: 12,
          color: '#666',
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>How it works</div>
        1. We generate your page in seconds · 2. You get a shareable link · 3. Send it to{' '}
        {state.toName || 'them'} on WhatsApp
      </div>
    </div>
  );
}

function LayoutPreview({
  layout,
  photos,
}: {
  layout: PhotoLayoutId;
  photos: string[];
}) {
  const palette = TEMPLATES.rose_dark.palette;
  return (
    <div
      style={{
        position: 'relative',
        height: 110,
        background: `linear-gradient(160deg, ${palette.bg2}, ${palette.bg})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        overflow: 'hidden',
      }}
    >
      {layout === 'polaroid' && <PolaroidPreview photos={photos} />}
      {layout === 'slideshow' && <SlideshowPreview photos={photos} />}
      {layout === 'filmstrip' && <FilmstripPreview photos={photos} />}
      {layout === 'grid' && <GridPreview photos={photos} />}
    </div>
  );
}

function PolaroidPreview({ photos }: { photos: string[] }) {
  const row = photos.slice(0, 3);
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
      {row.map((p, i) => (
        <div
          key={i}
          style={{
            width: 42,
            height: 54,
            background: '#fff',
            padding: 3,
            paddingBottom: 9,
            boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
            transform: `rotate(${(i - 1) * 5}deg)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}

function SlideshowPreview({ photos }: { photos: string[] }) {
  const hero = photos[0];
  return (
    <div
      style={{
        width: 70,
        height: 88,
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
      }}
    >
      {hero && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={hero}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}

function FilmstripPreview({ photos }: { photos: string[] }) {
  const row = photos.slice(0, 4);
  return (
    <div
      style={{
        display: 'flex',
        gap: 3,
        padding: '4px 0',
        borderTop: '1.5px dashed rgba(201,167,122,0.5)',
        borderBottom: '1.5px dashed rgba(201,167,122,0.5)',
        background: '#1a0a05',
      }}
    >
      {row.map((p, i) => (
        <div key={i} style={{ width: 26, height: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'sepia(0.25) saturate(1.1)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

function GridPreview({ photos }: { photos: string[] }) {
  const row = photos.slice(0, 4);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 3,
        width: 76,
      }}
    >
      {row.map((p, i) => (
        <div key={i} style={{ aspectRatio: '1', borderRadius: 3, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
      <span
        style={{
          color: '#888',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: '#1a1a1a',
          fontWeight: 500,
          textAlign: 'right',
          textTransform: 'capitalize',
        }}
      >
        {value}
      </span>
    </div>
  );
}
