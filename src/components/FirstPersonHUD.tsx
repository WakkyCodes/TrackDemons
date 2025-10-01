// FirstPersonHUD.tsx
import DashboardOverlay from './DashboardOverlay';
import AnalogSpeedometer from './AnalogSpeedometer';

export default function FirstPersonHUD({ speed, gear }: { speed: number; gear: string }) {

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

      </div>
    </>
  );
}