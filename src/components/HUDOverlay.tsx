// HUDOverlay.tsx
export default function HUDOverlay({ speed, gear }: { speed: number; gear: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '30px',
        color: '#00ff88',
        fontFamily: 'monospace',
        textAlign: 'right',
        pointerEvents: 'none', // so it doesn’t block mouse
      }}
    >
      <div style={{ fontSize: '32px' }}>{Math.round(speed)} km/h</div>
      <div style={{ fontSize: '20px', color: '#ff4444' }}>Gear: {gear}</div>
    </div>
  )
}
