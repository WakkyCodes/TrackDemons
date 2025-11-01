// FirstPersonHUD.tsx
import DashboardOverlay from './DashboardOverlay';
import AnalogSpeedometer from './AnalogSpeedometer';

interface FirstPersonHUDProps {
  speed: number;
  gear: string;
  currentCheckpoint?: number;
  currentLevel?: number; // Add currentLevel prop
  boostActive?: boolean;
}

export default function FirstPersonHUD({ 
  speed, 
  gear, 
  currentCheckpoint = 0,
  currentLevel = 1, // Add default value
  boostActive = false
}: FirstPersonHUDProps) {
  const totalCheckpoints = currentLevel === 1 ? 3 : 5;

  return (
    <>
      {/* Physical Dashboard */}
      <DashboardOverlay />
      
      {/* Realistic Analog Speedometer */}
      <AnalogSpeedometer speed={speed} gear={gear} />

      {/* Additional Car Info */}
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
          pointerEvents: 'none',
          zIndex: 1000,
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Checkpoint Progress for First Person View */}
        <div
          style={{
            position: 'fixed',
            bottom: '215px',
            left: '0px',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid #00ff88',
            textAlign: 'center',
            fontSize: '14px',
            color: '#00ff88',
            zIndex: 1100,
            fontFamily: 'Arial, sans-serif',
            pointerEvents: 'none',
          }}
        >
          Checkpoint: {currentCheckpoint}/{totalCheckpoints}
        </div>

        {/* Boost Indicator for First Person View */}
        {boostActive && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'gold',
              fontSize: '48px',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255,215,0,0.8)',
              zIndex: 1100,
              fontFamily: 'Arial, sans-serif',
              pointerEvents: 'none',
              animation: 'pulse 0.5s infinite alternate',
              background: 'rgba(0,0,0,0.5)',
              padding: '20px 40px',
              borderRadius: '15px',
              border: '2px solid gold',
            }}
          >
            BOOST!
          </div>
        )}
      </div>

      {/* Add CSS animation for boost effect */}
      <style>
        {`
          @keyframes pulse {
            from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            to { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
          }
        `}
      </style>
    </>
  );
}