// AnalogSpeedometer.tsx
export default function AnalogSpeedometer({ speed, gear }: { speed: number; gear: string }) {
  // Convert speed to needle rotation (0-180 mph = 0-240 degrees, starting from left)
  const maxSpeed = 180;
  const needleRotation = (speed / maxSpeed) * 240 - 120; // -120deg (0mph) to +120deg (180mph)
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      zIndex: 1000,
      width: '220px',
      height: '220px'
    }}>
      {/* Speedometer Outer Ring */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(42, 42, 42, 1) 0%, #1a1a1a 100%)',
        borderRadius: '50%',
        border: '8px solid #333',
        boxShadow: '0 0 25px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)'
      }}>
        {/* Speedometer Face */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          background: 'radial-gradient(circle, #f0f0f0 0%, #e0e0e0 100%)',
          borderRadius: '50%',
          border: '2px solid #999'
        }}>
          {/* Center Hub */}
          <div style={{
            position: 'absolute', 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            background: 'linear-gradient(145deg, #666, #444)',
            borderRadius: '50%',
            border: '2px solid #333',
            zIndex: 3
          }}/>

          {/* Major Tick Marks and Numbers */}
          {[
            { value: 0, angle: -120 },
            { value: 20, angle: -96 },
            { value: 40, angle: -72 },
            { value: 60, angle: -48 },
            { value: 80, angle: -24 },
            { value: 100, angle: 0 },
            { value: 120, angle: 24 },
            { value: 140, angle: 48 },
            { value: 160, angle: 72 },
            { value: 180, angle: 96 }
          ].map(({ value, angle }) => {
            //const rad = (angle * Math.PI) / 180;
            const distance = 70; // Distance from center
            //const x = 50 + distance * Math.cos(rad);
            //const y = 50 + distance * Math.sin(rad);
            
            return (
              <div key={value}>
                {/* Major Tick Line */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '3px',
                  height: '15px',
                  background: '#333',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${distance - 7}px)`,
                  transformOrigin: 'bottom center'
                }}/>
                
                {/* Number */}
               
              </div>
            );
          })}

          {/* Minor Tick Marks */}
          {[10, 30, 50, 70, 90, 110, 130, 150, 170].map((value, index) => {
            const angle = (index * 24) - 108; // -108 to +108
            return (
              <div key={value} style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '1px',
                height: '8px',
                background: '#666',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-72px)`,
                transformOrigin: 'bottom center'
              }}/>
            );
          })}

          {/* Needle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '3px',
            height: '75px',
            background: 'linear-gradient(to top, #ff4444 0%, #cc0000 100%)',
            borderRadius: '2px',
            transform: `translate(-50%, -100%) rotate(${needleRotation}deg)`,
            transformOrigin: 'bottom center',
            zIndex: 2,
            boxShadow: '0 0 3px rgba(0,0,0,0.5)'
          }}>
            {/* Needle Center Cap */}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '16px',
              background: 'radial-gradient(circle, #ff4444 0%, #cc0000 100%)',
              borderRadius: '50%',
              border: '2px solid #333',
              boxShadow: '0 0 5px rgba(255, 68, 68, 0.8)'
            }}/>
          </div>

          {/* MPH Text */}
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#333',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px'
          }}>
            rev
          </div>

          {/* Gear Display */}
          <div style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 68, 68, 0.9)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff',
            boxShadow: '0 0 8px rgba(255, 68, 68, 0.5)'
          }}>
            {gear}
          </div>
        </div>

        {/* Glass Reflection */}
        <div style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          right: '5px',
          bottom: '5px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}/>
      </div>
    </div>
  );
}