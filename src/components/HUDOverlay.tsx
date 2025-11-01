// HUDOverlay.tsx
interface HUDOverlayProps {
  speed: number;
  gear: string;
  currentCheckpoint?: number;
  currentLevel?: number; // Add this line
  boostActive?: boolean;
}

export default function HUDOverlay({ 
  speed, 
  gear, 
  currentCheckpoint = 0,
  currentLevel = 1, // Add default value
  boostActive = false
}: HUDOverlayProps) {
  const totalCheckpoints = currentLevel === 1 ? 3 : 5;
  
  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '30px',
          color: '#00ff88',
          fontFamily: 'monospace',
          textAlign: 'right',
          pointerEvents: 'none',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '15px 25px',
          borderRadius: '15px',
          border: '2px solid #00ff88',
          backdropFilter: 'blur(10px)',
          textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
        }}
      >
        <div style={{ 
          fontSize: '32px', 
          fontWeight: 'bold',
          lineHeight: '1.2'
        }}>
          {Math.round(speed)} km/h
        </div>
        <div style={{ 
          fontSize: '20px', 
          color: '#ff4444', 
          marginTop: '8px',
          fontWeight: 'bold'
        }}>
          {gear}
        </div>
        
        {/* Checkpoint Progress */}
        <div style={{ 
          fontSize: '14px', 
          color: '#ffffff', 
          marginTop: '12px',
          borderTop: '1px solid #00ff88',
          paddingTop: '8px'
        }}>
          Checkpoint: {currentCheckpoint}/{totalCheckpoints}
        </div>

        {/* Boost Indicator */}
        {boostActive && (
          <div style={{ 
            fontSize: '16px', 
            color: 'gold', 
            marginTop: '10px',
            fontWeight: 'bold',
            animation: 'boostPulse 0.5s infinite alternate',
            textShadow: '0 0 10px rgba(255,215,0,0.8)'
          }}>
            ⚡ BOOST ACTIVE ⚡
          </div>
        )}
      </div>

      {/* Add CSS animation for boost effect */}
      <style>
        {`
          @keyframes boostPulse {
            from { opacity: 1; }
            to { opacity: 0.6; }
          }
        `}
      </style>
    </>
  );
}