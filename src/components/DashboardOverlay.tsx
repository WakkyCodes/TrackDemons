// DashboardOverlay.tsx
export default function DashboardOverlay() {
  return (
    <>
      {/* Main Dashboard Panel */}
      <div
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          height: '200px',
          background: 'linear-gradient(to top, #1a1a1a 0%, #2d2d2d 30%, #3a3a3a 100%)',
          pointerEvents: 'none',
          zIndex: 999,
          borderTop: '2px solid #444',
          boxShadow: '0 -5px 20px rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '20px 40px'
        }}
      >
        {/* Left Cluster */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          width: '150px'
        }}>
          {/* Left Air Vent */}
          <div style={{
            width: '120px',
            height: '40px',
            background: 'linear-gradient(145deg, #333, #222)',
            border: '1px solid #444',
            borderRadius: '8px',
            position: 'relative',
            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), 2px 2px 5px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              padding: '5px'
            }}>
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} style={{
                  height: '3px',
                  background: 'linear-gradient(90deg, #444, #555, #444)',
                  borderRadius: '1px'
                }}/>
              ))}
            </div>
            <div style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '20px',
              background: 'linear-gradient(145deg, #555, #333)',
              borderRadius: '2px',
              border: '1px solid #666'
            }}/>
          </div>

          {/* Left Controls */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '10px'
          }}>
            {/* Light Switch */}
            <div style={{
              width: '25px',
              height: '25px',
              background: 'linear-gradient(145deg, #444, #333)',
              border: '1px solid #555',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#888'
            }}>
              ☀
            </div>
            {/* Fog Light */}
            <div style={{
              width: '25px',
              height: '25px',
              background: 'linear-gradient(145deg, #444, #333)',
              border: '1px solid #555',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#888'
            }}>
              🌫
            </div>
          </div>
        </div>

        {/* Center Cluster - Empty space for HUD */}
        <div style={{ width: '400px' }}></div>

        {/* Right Cluster */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          width: '150px',
          alignItems: 'flex-end'
        }}>
          {/* Right Air Vent */}
          <div style={{
            width: '120px',
            height: '40px',
            background: 'linear-gradient(145deg, #333, #222)',
            border: '1px solid #444',
            borderRadius: '8px',
            position: 'relative',
            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), 2px 2px 5px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              padding: '5px'
            }}>
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} style={{
                  height: '3px',
                  background: 'linear-gradient(90deg, #444, #555, #444)',
                  borderRadius: '1px'
                }}/>
              ))}
            </div>
            <div style={{
              position: 'absolute',
              left: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '20px',
              background: 'linear-gradient(145deg, #555, #333)',
              borderRadius: '2px',
              border: '1px solid #666'
            }}/>
          </div>

          {/* Right Controls */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '10px'
          }}>
            {/* Hazard Lights */}
            <div style={{
              width: '25px',
              height: '25px',
              background: 'linear-gradient(145deg, #444, #333)',
              border: '1px solid #555',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#ff4444'
            }}>
              ⚠
            </div>
            {/* Rear Defog */}
            <div style={{
              width: '25px',
              height: '25px',
              background: 'linear-gradient(145deg, #444, #333)',
              border: '1px solid #555',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#888'
            }}>
              ❄
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Top/Edge with Additional Details */}
      <div
        style={{
          position: 'fixed',
          bottom: '200px',
          left: '0',
          right: '0',
          height: '25px',
          background: 'linear-gradient(to bottom, #4a4a4a 0%, #3a3a3a 50%, #2d2d2d 100%)',
          pointerEvents: 'none',
          zIndex: 998,
          borderBottom: '1px solid #555',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 50px',
          alignItems: 'center'
        }}
      >
        {/* Speaker Grilles */}
        <div style={{
          width: '80px',
          height: '8px',
          background: 'linear-gradient(90deg, transparent 0%, #333 20%, #333 80%, transparent 100%)',
          borderRadius: '2px',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              width: '2px',
              height: '100%',
              background: '#222',
              borderRadius: '1px'
            }}/>
          ))}
        </div>
        
        <div style={{
          width: '80px',
          height: '8px',
          background: 'linear-gradient(90deg, transparent 0%, #333 20%, #333 80%, transparent 100%)',
          borderRadius: '2px',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              width: '2px',
              height: '100%',
              background: '#222',
              borderRadius: '1px'
            }}/>
          ))}
        </div>
      </div>

      {/* Windshield Reflection with Wipers */}
      <div
        style={{
          position: 'fixed',
          bottom: '225px',
          left: '0',
          right: '0',
          height: '100px',
          background: 'linear-gradient(to bottom, rgba(120,120,120,0.1) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 997
        }}
      >
        {/* Windshield Wipers (subtle) */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '1px',
          background: 'rgba(100,100,100,0.3)',
          borderRadius: '1px'
        }}/>
      </div>

      {/* Rearview Mirror */}
      <div
        style={{
          position: 'fixed',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '35px',
          background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
          border: '1px solid #333',
          borderRadius: '3px',
          pointerEvents: 'none',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '9px',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 3px 12px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{
          width: '90%',
          height: '70%',
          background: 'linear-gradient(135deg, #1a1a1a, #333)',
          border: '1px solid #222',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#444',
          fontSize: '8px'
        }}>
          MIRROR
        </div>
      </div>

      {/* A-Pillars */}
      <div style={{
        position: 'fixed',
        left: '0',
        top: '0',
        bottom: '200px',
        width: '30px',
        background: 'linear-gradient(90deg, #1a1a1a 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 998
      }}/>
      
      <div style={{
        position: 'fixed',
        right: '0',
        top: '0',
        bottom: '200px',
        width: '30px',
        background: 'linear-gradient(90deg, transparent 0%, #1a1a1a 100%)',
        pointerEvents: 'none',
        zIndex: 998
      }}/>
    </>
  );
}