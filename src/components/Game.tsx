import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { useEffect, useRef, useState } from 'react'
import { Mesh } from 'three'

import Car from './Car'
import BMW from './BMW'
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

type CarModel = 'car' | 'bmw'  

type GameProps = {
  track: number
  selectedCar: CarModel 
  onBackToMenu: () => void
}

interface CarHandle {
  activateBoost: (multiplier?: number, duration?: number) => void
  getSpeed: () => number
  getBoostActive: () => boolean
  setControlsEnabled: (enabled: boolean) => void
}

const carComponents = {
  car: Car,
  bmw: BMW,
}

export default function Game({ track, selectedCar, onBackToMenu }: GameProps) {
  const carRef = useRef<Mesh & CarHandle>(null)
  const [isFirstPerson, setIsFirstPerson] = useState(false)
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
  const [boostActive, setBoostActive] = useState(false)
  const [gameFailed, setGameFailed] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [completedTrack, setCompletedTrack] = useState<number | null>(null)
  const [failedCheckpoint, setFailedCheckpoint] = useState<number | null>(null)

  const keys = useKeyboard()
  const CurrentCar = carComponents[selectedCar]

  useEffect(() => {
    if (carRef.current && carRef.current.setControlsEnabled) {
      const shouldEnableControls = gameStarted && !showCountdown;
      carRef.current.setControlsEnabled(shouldEnableControls);
    }
  }, [gameStarted, showCountdown]);

  useEffect(() => {
    if (carRef.current) {
      setBoostActive(false)
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

  const handleControlsClose = () => {
    setShowControls(false)
    setShowCountdown(true)
    if (carRef.current && carRef.current.setControlsEnabled) {
      carRef.current.setControlsEnabled(false);
    }
  }

  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setGameStarted(true)
    if (carRef.current && carRef.current.setControlsEnabled) {
      carRef.current.setControlsEnabled(true);
    }
  }

  const handleCheckpointTimeout = (checkpointNumber: number) => {
    setGameFailed(true);
    setFailedCheckpoint(checkpointNumber);
    setGameStarted(false);
    if (carRef.current && carRef.current.setControlsEnabled) {
      carRef.current.setControlsEnabled(false);
    }
  };

  const handleRestartGame = () => {
    setGameFailed(false);
    setFailedCheckpoint(null);
    setGameStarted(false);
    setShowControls(false);
    setShowCountdown(true);
    setActiveCheckpoint(null);
    setCheckpoints([]);
    setCurrentCheckpoint(0);
    setBoostActive(false);
    setKey(prev => prev + 1);
    
    setTimeout(() => {
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }, 100);
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
      
      const maxCheckpoints = currentLevel === 1 ? 3 : 5;
      const nextCheckpoint = checkpointNumber < maxCheckpoints ? checkpointNumber + 1 : null;
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint);
      }, 100);
      
      if (currentLevel === 1) {
        setTrack1Checkpoints(newCheckpoints);
      } else if (currentLevel === 2) {
        setTrack2Checkpoints(newCheckpoints);
      }
      
      return newCheckpoints;
    });
  };

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
      
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }
  }, [checkpoints, gameStarted, gameWon, currentLevel]);

  const handleBackToMenuFromFailure = () => {
    setGameFailed(false);
    setFailedCheckpoint(null);
    onBackToMenu();
  };

  const handleHudUpdate = (data: { speed: number; gear: string; boostActive?: boolean }) => {
    setHudData(prev => ({
      ...data,
      boostActive: data.boostActive !== undefined ? data.boostActive : prev.boostActive
    }));
  };

  const handleTrackChange = (newTrack: number) => {
    if (!gameStarted) return
    
    setCurrentLevel(newTrack)
    setGameStarted(false)
    setShowCountdown(false)
    setShowControls(false)
    setActiveCheckpoint(null)
    setBoostActive(false)
    setCheckpoints([])
    setCurrentCheckpoint(0)
    setKey(prev => prev + 1)
    
    setTimeout(() => {
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }, 100);
    
    setTimeout(() => {
      setShowCountdown(true)
    }, 500)
  }

  const handleSwitchTrack = () => {
    const nextTrack = currentLevel === 1 ? 2 : 1;
    
    setGameWon(false);
    setCompletedTrack(null);
    setCurrentLevel(nextTrack);
    setGameStarted(false);
    setShowCountdown(true);
    setActiveCheckpoint(null);
    setCheckpoints([]);
    setCurrentCheckpoint(0);
    setBoostActive(false);
    setKey(prev => prev + 1);
    
    setTimeout(() => {
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }, 100);
  };

  const handleRestartSameTrack = () => {
    setGameWon(false);
    setCompletedTrack(null);
    setGameStarted(false);
    setShowCountdown(true);
    setActiveCheckpoint(null);
    setCheckpoints([]);
    setCurrentCheckpoint(0);
    setBoostActive(false);
    setKey(prev => prev + 1);
    
    setTimeout(() => {
      if (carRef.current && carRef.current.setControlsEnabled) {
        carRef.current.setControlsEnabled(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (currentLevel === 1 && track1Checkpoints.length > 0) {
      setCheckpoints(track1Checkpoints)
      setCurrentCheckpoint(Math.max(...track1Checkpoints))
      const maxCheckpoints = 3;
      const nextCheckpoint = Math.max(...track1Checkpoints) + 1
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint <= maxCheckpoints ? nextCheckpoint : null)
      }, 100)
    } else if (currentLevel === 2 && track2Checkpoints.length > 0) {
      setCheckpoints(track2Checkpoints)
      setCurrentCheckpoint(Math.max(...track2Checkpoints))
      const maxCheckpoints = 5;
      const nextCheckpoint = Math.max(...track2Checkpoints) + 1
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint <= maxCheckpoints ? nextCheckpoint : null)
      }, 100)
    }
  }, [currentLevel, track1Checkpoints, track2Checkpoints])

  useEffect(() => {
    setCurrentLevel(track)
  }, [track])

  useEffect(() => {
    if (gameStarted) {
      setTimeout(() => {
        setActiveCheckpoint(1);
        setCheckpoints([]);
        setCurrentCheckpoint(0);
        setBoostActive(false);
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
            startRotation={currentLevel === 2 ? [0, -Math.PI, 0] : [0, Math.PI/2, 0]}
            onHudUpdate={handleHudUpdate}
            controlsEnabled={gameStarted && !showCountdown}
          />

          <CarSound speed={hudData.speed} gear={hudData.gear} />
        </Physics>

        <CameraController target={carRef} isFirstPerson={isFirstPerson} />
        <Environment files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`} background />
      </Canvas>

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
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ff4444', marginBottom: '20px' }}>
            LEVEL FAILED!
          </div>
          
          <div style={{ fontSize: '24px', marginBottom: '30px', color: '#ffffff' }}>
            Time ran out at Checkpoint {failedCheckpoint}
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
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
              }}
            >
              🏠 Back to Menu
            </button>
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
          }}
        >
          <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '20px' }}>
            🏆 YOU WIN! 🏆
          </div>
          
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>
            Track {completedTrack} Completed!
          </div>
          
          <div style={{ fontSize: '20px', marginBottom: '40px' }}>
            All {currentLevel === 1 ? 3 : 5} checkpoints reached successfully!
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
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
                minWidth: '250px',
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
                minWidth: '250px',
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
                minWidth: '250px',
              }}
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>
      )}

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

      {activeCheckpoint && gameStarted && (
        <CheckpointCountdown
          key={`checkpoint-${activeCheckpoint}`}
          checkpointNumber={activeCheckpoint}
          isActive={gameStarted && activeCheckpoint !== null}
          onTimeout={handleCheckpointTimeout}
          duration={10}
        />
      )}

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

      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, display: 'flex', gap: '10px' }}>
        <button
          onClick={() => handleTrackChange(1)}
          style={{
            padding: '10px 20px',
            backgroundColor: currentLevel === 1 ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
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
            opacity: gameStarted ? 1 : 0.7,
          }}
        >
          Track 2
        </button>
      </div>

      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        <button 
          onClick={onBackToMenu}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Back to Menu
        </button>
      </div>

      <style>
        {`
          @keyframes pulse {
            from { opacity: 0.3; }
            to { opacity: 0.1; }
          }
        `}
      </style>
    </div>
  )
}
