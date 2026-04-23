export function ExpiredPage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #120a14 0%, #22101c 100%)',
        color: '#fbeae1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        fontFamily: '"Inter", system-ui',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 54, marginBottom: 18, opacity: 0.85 }}>⏳</div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          fontSize: 28,
          color: '#fff',
          lineHeight: 1.25,
          maxWidth: 360,
        }}
      >
        This page has faded.
      </div>
      <div
        style={{
          fontSize: 14,
          color: '#c9a2a0',
          marginTop: 14,
          maxWidth: 320,
          lineHeight: 1.6,
        }}
      >
        Links are only alive for 48 hours, then everything — photos, video,
        names, the letter — is wiped for privacy.
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#8b6b73',
          marginTop: 18,
          maxWidth: 300,
          lineHeight: 1.6,
        }}
      >
        Ask the sender to create a new one if you&apos;d like to see it again.
      </div>
    </div>
  );
}
