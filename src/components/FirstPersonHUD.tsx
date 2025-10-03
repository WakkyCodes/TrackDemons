import DashboardOverlay from './DashboardOverlay';
import AnalogSpeedometer from './AnalogSpeedometer';

interface FirstPersonHUDProps {
  speed: number;
  gear: string;
  gameStarted?: boolean;
  currentCheckpoint?: number;
  checkpoints?: number[];
}

export default function FirstPersonHUD({ 
  speed, 
  gear, 
  gameStarted = true,
  currentCheckpoint = 0,
  checkpoints = [] 
}: FirstPersonHUDProps) {

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
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid #00ff88',
            marginBottom: '10px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#00ff88'
          }}
        >
          Checkpoint: {currentCheckpoint}/3
        </div>
      </div>
    </>
  );
}