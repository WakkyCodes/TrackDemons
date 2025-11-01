import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { useEffect, useRef, useState } from 'react'
import { Mesh } from 'three'

import Car from './Car'
import BMW from './BMW'
import Merc from './Merc'
import Track01 from './Track01'
import Track02 from './Track02'
import Lights from './Lights'
import FollowCam from './FollowCam'
import CameraController from './CameraController'
import ReflectiveGround from './ReflectiveGround'
import HUDOverlay from './HUDOverlay'
import FirstPersonHUD from './FirstPersonHUD'
import ControlsPopup from './ControlsPopup'
import Countdown from './Countdown'
import CarSound from './CarSound'
import CheckpointCountdown from './CheckpointCountdown'
import useKeyboard from '../hooks/useKeyboard'

type CarModel = 'car' | 'bmw' | 'merc' 

type GameProps = {
  track: number
  selectedCar: CarModel 
  onBackToMenu: () => void
  onTrackComplete?: (trackNumber: number) => void
}

// Define the car handle interface to match what we created in Car.tsx
interface CarHandle {
  activateBoost: (multiplier?: number, duration?: number) => void
  getSpeed: () => number
  getBoostActive: () => boolean
  setControlsEnabled: (enabled: boolean) => void // Add this method
}

const carComponents = {
  car: Car,
  bmw: BMW,
  merc: Merc
}



export default function Game({ 
    track, 
    selectedCar, 
    onBackToMenu,
    onTrackComplete // Add this
  }: GameProps){
  // Update the ref type to include both Mesh and CarHandle
  const carRef = useRef<Mesh & CarHandle>(null)
  const [isFirstPerson, setIsFirstPerson] = useState(false)
  // Update HUD data to include boostActive
  const [hudData, setHudData] = useState({ speed: 0, gear: 'N', boostActive: false })
  const [currentLevel, setCurrentLevel] = useState(track)
  const [gameStarted, setGameStarted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showCountdown, setShowCountdown] = useState(false)
  const [key, setKey] = useState(0)
  const [checkpoints, setCheckpoints] = useState<number[]>([])
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0)
  const [track1Checkpoints, setTrack1Checkpoints] = useState<number[]>([])
  const [track2Checkpoints, setTrack2Checkpoints] = useState<number[]>([])
  const [activeCheckpoint, setActiveCheckpoint] = useState<number | null>(null)
  // Add boost state for visual feedback
  const [boostActive, setBoostActive] = useState(false)
  const [gameFailed, setGameFailed] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [completedTrack, setCompletedTrack] = useState<number | null>(null)
  const [failedCheckpoint, setFailedCheckpoint] = useState<number | null>(null)

  const keys = useKeyboard()
  const CurrentCar = carComponents[selectedCar]

  // Control car controls based on game state
  useEffect(() => {
    if (carRef.current && carRef.current.setControlsEnabled) {
      // Only enable controls when game is started AND countdown is not showing
      const shouldEnableControls = gameStarted && !showCountdown;
      carRef.current.setControlsEnabled(shouldEnableControls);
    }
  }, [gameStarted, showCountdown]);

  // Reset car ref when switching tracks
  useEffect(() => {
    if (carRef.current) {
      // Reset boost state when switching tracks
      setBoostActive(false)
      // Ensure controls are disabled when switching tracks
      if (carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }
  }, [currentLevel])
  
  useEffect(() => {
    if (keys.c && gameStarted) {
      setIsFirstPerson((prev) => !prev)
    }
  }, [keys.c, gameStarted])

  // Handle controls popup close
  const handleControlsClose = () => {
    setShowControls(false)
    setShowCountdown(true)
    // Ensure controls are disabled during countdown
    if (carRef.current && carRef.current.setControlsEnabled) {
      carRef.current.setControlsEnabled(false);
    }
  }

  // Handle countdown completion
  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setGameStarted(true)
    // Enable car controls when countdown completes
    if (carRef.current && carRef.current.setControlsEnabled) {
      carRef.current.setControlsEnabled(true);
    }
  }

  // Handle checkpoint timeout - UPDATED FOR BOTH TRACKS
  const handleCheckpointTimeout = (checkpointNumber: number) => {
    // Reset to the checkpoint that timed out (not previous one)
    setGameFailed(true);
    setFailedCheckpoint(checkpointNumber);
    if (carRef.current && carRef.current.setControlsEnabled) {
      carRef.current.setControlsEnabled(false);
    }
    setGameStarted(false); // Stop the game
    
    
  };

  const handleRestartGame = () => {
    // Reset all game states
    setGameFailed(false);
    setFailedCheckpoint(null);
    setGameStarted(false);
    setShowControls(false);
    setShowCountdown(true);
    setActiveCheckpoint(null);
    setCheckpoints([]);
    setCurrentCheckpoint(0);
    setBoostActive(false);
    
    // Force re-render of physics and car
    setKey(prev => prev + 1);
    
    // Ensure controls are disabled
    setTimeout(() => {
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }, 100);
    
    console.log('Game restarted from beginning');
  };

  const handleCheckpoint = (checkpointNumber: number) => {
    setCheckpoints(prevCheckpoints => {
      if (prevCheckpoints.includes(checkpointNumber)) {
        return prevCheckpoints;
      }
      
      const newCheckpoints = [...prevCheckpoints, checkpointNumber];

      setCurrentCheckpoint(checkpointNumber);
      
      if (carRef.current && carRef.current.activateBoost) {
        const boostStrength = 1.5 + (checkpointNumber * 0.1);
        const boostDuration = 2.5;
        carRef.current.activateBoost(boostStrength, boostDuration);
        setBoostActive(true);
        setTimeout(() => setBoostActive(false), boostDuration * 1000);
      }
      
      // Set next checkpoint - UPDATED FOR 5 CHECKPOINTS
      const maxCheckpoints = currentLevel === 1 ? 3 : 5; // Track1 has 3, Track2 has 5
      const nextCheckpoint = checkpointNumber < maxCheckpoints ? checkpointNumber + 1 : null;
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint);
      }, 100);
      
      // Store track-specific checkpoints
      if (currentLevel === 1) {
        setTrack1Checkpoints(newCheckpoints);
      } else if (currentLevel === 2) {
        setTrack2Checkpoints(newCheckpoints);
      }
      
      return newCheckpoints;
    });
  };

  // Add this useEffect to handle the win condition
  useEffect(() => {
    
    
    const hasAllCheckpoints = currentLevel === 1 
      ? checkpoints.includes(1) && checkpoints.includes(2) && checkpoints.includes(3)
      : checkpoints.includes(1) && checkpoints.includes(2) && checkpoints.includes(3) && 
        checkpoints.includes(4) && checkpoints.includes(5);
    
    if (hasAllCheckpoints && gameStarted && !gameWon) {
      setGameWon(true);
      setCompletedTrack(currentLevel);
      setGameStarted(false);
      setActiveCheckpoint(null);

      onTrackComplete?.(currentLevel);
      
      // Disable car controls when game is won
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }
  }, [checkpoints, gameStarted, gameWon, currentLevel, onTrackComplete]);

  const handleBackToMenuFromFailure = () => {
    setGameFailed(false);
    setFailedCheckpoint(null);
    onBackToMenu();
  };

  // Update HUD data handler to include boost status
  const handleHudUpdate = (data: { speed: number; gear: string; boostActive?: boolean }) => {
    setHudData(prev => ({
      ...data,
      boostActive: data.boostActive !== undefined ? data.boostActive : prev.boostActive
    }));
  };

  // Reset game state when track changes
  const handleTrackChange = (newTrack: number) => {
    if (!gameStarted) return
    
    setCurrentLevel(newTrack)
    setGameStarted(false)
    setShowCountdown(false)
    setShowControls(false)
    setActiveCheckpoint(null)
    setBoostActive(false) // Reset boost state
    
    // Reset current checkpoint state but preserve track-specific states
    setCheckpoints([])
    setCurrentCheckpoint(0)
    
    // Force re-render of physics and car by changing key
    setKey(prev => prev + 1)
    
    // Ensure controls are disabled
    setTimeout(() => {
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }, 100);
    
    // Start countdown automatically after track change
    setTimeout(() => {
      setShowCountdown(true)
    }, 500)
  }

  const handleSwitchTrack = () => {
    const nextTrack = currentLevel === 1 ? 2 : 1;
    
    // Reset win state
    setGameWon(false);
    setCompletedTrack(null);
    
    // Switch to the other track
    setCurrentLevel(nextTrack);
    setGameStarted(false);
    setShowCountdown(true);
    setActiveCheckpoint(null);
    setCheckpoints([]);
    setCurrentCheckpoint(0);
    setBoostActive(false);
    
    // Force re-render
    setKey(prev => prev + 1);
    
    // Ensure controls are disabled
    setTimeout(() => {
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }, 100);
    
  };

  // Add this function to handle restarting the same track after winning
  const handleRestartSameTrack = () => {
    setGameWon(false);
    setCompletedTrack(null);
    setGameStarted(false);
    setShowCountdown(true);
    setActiveCheckpoint(null);
    setCheckpoints([]);
    setCurrentCheckpoint(0);
    setBoostActive(false);
    
    // Force re-render
    setKey(prev => prev + 1);
    
    // Ensure controls are disabled
    setTimeout(() => {
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }, 100);
    
  };

  // Restore track-specific checkpoints when switching tracks
  useEffect(() => {
    if (currentLevel === 1 && track1Checkpoints.length > 0) {
      setCheckpoints(track1Checkpoints)
      setCurrentCheckpoint(Math.max(...track1Checkpoints))
      // Set the next checkpoint as active
      const maxCheckpoints = 3;
      const nextCheckpoint = Math.max(...track1Checkpoints) + 1
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint <= maxCheckpoints ? nextCheckpoint : null)
      }, 100)
    } else if (currentLevel === 2 && track2Checkpoints.length > 0) {
      setCheckpoints(track2Checkpoints)
      setCurrentCheckpoint(Math.max(...track2Checkpoints))
      // Set the next checkpoint as active
      const maxCheckpoints = 5;
      const nextCheckpoint = Math.max(...track2Checkpoints) + 1
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint <= maxCheckpoints ? nextCheckpoint : null)
      }, 100)
    }
  }, [currentLevel, track1Checkpoints, track2Checkpoints])

  // Initialize with the prop track
  useEffect(() => {
    setCurrentLevel(track)
  }, [track])

  useEffect(() => {
    if (gameStarted) {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        setActiveCheckpoint(1);
        setCheckpoints([]);
        setCurrentCheckpoint(0);
        setBoostActive(false); // Reset boost on game start
      }, 100);
    }
  }, [gameStarted, currentLevel]);

  useEffect(() => {
    if (gameStarted) {
      const maxCheckpoints = currentLevel === 1 ? 3 : 5;

      if (checkpoints.length > 0) {
        const nextCheckpoint = Math.max(...checkpoints) + 1;
        setTimeout(() => {
          setActiveCheckpoint(nextCheckpoint <= maxCheckpoints ? nextCheckpoint : null);
        }, 100);
      } else {
        setTimeout(() => {
          setActiveCheckpoint(1);
        }, 100);
      }
    } else {
      setActiveCheckpoint(null);
    }
  }, [currentLevel, gameStarted, checkpoints]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [3, 3, 3] }} key={key}>
        <Lights />

        <Physics gravity={[0, -9.82, 0]} key={`physics-${key}`}>
          <ReflectiveGround />
          <FollowCam target={carRef} enabled={!isFirstPerson} />

          {currentLevel === 1 && (
            <Track01 
              key="track01" 
              onCheckpoint={handleCheckpoint}
            />
          )}
          {currentLevel === 2 && (
            <Track02 
              key="track02" 
              onCheckpoint={handleCheckpoint}
              activeCheckpoint={activeCheckpoint}
            />
          )}

          <CurrentCar
            ref={carRef}
            startPosition={currentLevel === 1 ? [16, -3, -4] : [-13, 2.5, -16]}
            
            // flip the car for level 2
            startRotation={currentLevel === 2 ? [0, -Math.PI, 0] : [0, Math.PI/2, 0]}
            onHudUpdate={handleHudUpdate} // Use the updated handler
            controlsEnabled={gameStarted && !showCountdown} // Add this prop
          />

          <CarSound speed={hudData.speed} gear={hudData.gear} />
        </Physics>

        <CameraController target={carRef} isFirstPerson={isFirstPerson} />
        <Environment files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`} background />
      </Canvas>

      {/* Overlay sequence: Controls -> Countdown -> Game */}
      {showControls && <ControlsPopup onClose={handleControlsClose} />}
      
      {showCountdown && (
        <Countdown onComplete={handleCountdownComplete} />
      )}

      {gameFailed && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            color: 'white',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ff4444',
              marginBottom: '20px',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
            }}
          >
            LEVEL FAILED!
          </div>
          
          <div
            style={{
              fontSize: '24px',
              marginBottom: '30px',
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            Time ran out at Checkpoint {failedCheckpoint}
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: '20px',
            }}
          >
            <button
              onClick={handleRestartGame}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#45a049';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4CAF50';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🔄 Restart Level
            </button>
            
            <button
              onClick={handleBackToMenuFromFailure}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#da190b';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f44336';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🏠 Back to Menu
            </button>
          </div>
          
          <div
            style={{
              marginTop: '30px',
              fontSize: '16px',
              color: '#cccccc',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            Tip: Use boost from checkpoints to maintain speed and beat the timer!
          </div>
        </div>
      )}

      {gameWon && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            color: 'white',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#4CAF50',
              marginBottom: '20px',
              textShadow: '0 0 20px rgba(76, 175, 80, 0.7)',
              animation: 'celebrate 2s infinite alternate',
            }}
          >
            🏆 YOU WIN! 🏆
          </div>
          
          <div
            style={{
              fontSize: '32px',
              marginBottom: '10px',
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            Track {completedTrack} Completed!
          </div>
          
          <div
            style={{
              fontSize: '20px',
              marginBottom: '40px',
              color: '#cccccc',
              textAlign: 'center',
            }}
          >
            All {currentLevel === 1 ? 3 : 5} checkpoints reached successfully!
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              alignItems: 'center',
            }}
          >
            <button
              onClick={handleSwitchTrack}
              style={{
                padding: '18px 35px',
                fontSize: '20px',
                fontWeight: 'bold',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                minWidth: '250px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1976D2';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2196F3';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🎯 Play Track {currentLevel === 1 ? 2 : 1}
            </button>
            
            <button
              onClick={handleRestartSameTrack}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                minWidth: '250px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F57C00';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF9800';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🔄 Play Again
            </button>
            
            <button
              onClick={onBackToMenu}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                minWidth: '250px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7B1FA2';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#9C27B0';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🏠 Back to Menu
            </button>
          </div>
          
          <div
            style={{
              marginTop: '40px',
              fontSize: '16px',
              color: '#888888',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            Completed with {selectedCar.toUpperCase()} - Great driving!
          </div>
        </div>
      )}

      {/* HUD - Update to pass boostActive and currentLevel */}
      {isFirstPerson ? (
        <FirstPersonHUD 
          speed={hudData.speed} 
          gear={hudData.gear} 
          currentCheckpoint={currentCheckpoint}
          currentLevel={currentLevel}
          boostActive={hudData.boostActive || boostActive}
        />
      ) : (
        <HUDOverlay 
          speed={hudData.speed} 
          gear={hudData.gear} 
          currentCheckpoint={currentCheckpoint}
          currentLevel={currentLevel}
          boostActive={hudData.boostActive || boostActive}
        />
      )}

      {/* Checkpoint Countdown for both tracks */}
      {activeCheckpoint && gameStarted && (
        <CheckpointCountdown
          key={`checkpoint-${activeCheckpoint}`} // Add this key to force re-render
          checkpointNumber={activeCheckpoint}
          isActive={gameStarted && activeCheckpoint !== null}
          onTimeout={handleCheckpointTimeout}
          duration={10} // 10 seconds per checkpoint
          
        />
      )}

      {/* Boost Visual Effect Overlay */}
      {boostActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 999,
            animation: 'pulse 0.5s infinite alternate',
          }}
        />
      )}

      {/* Top-left UI */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '10px',
        }}
      >
        <button
          onClick={() => handleTrackChange(1)}
          style={{
            padding: '10px 20px',
            backgroundColor: currentLevel === 1 ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            opacity: gameStarted ? 1 : 0.7,
          }}
        >
          Track 1
        </button>
        <button
          onClick={() => handleTrackChange(2)}
          style={{
            padding: '10px 20px',
            backgroundColor: currentLevel === 2 ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            opacity: gameStarted ? 1 : 0.7,
          }}
        >
          Track 2
        </button>
      </div>

      {/* Top-right UI */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '10px',
        }}
      >
        <button 
          onClick={onBackToMenu}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Back to Menu
        </button>
      </div>

      {/* Game start message */}
      {!gameStarted && !showControls && !showCountdown && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          Get Ready!
        </div>
      )}

      {/* Add CSS animation for boost effect */}
      <style>
        {`
          @keyframes pulse {
            from { opacity: 0.3; }
            to { opacity: 0.1; }
          }
          @keyframes celebrate {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  )
}
