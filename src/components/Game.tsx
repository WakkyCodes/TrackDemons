// Game.tsx
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
const carComponents = {
  car: Car,
  bmw: BMW,
}

export default function Game({ track, selectedCar, onBackToMenu }: GameProps) {
  const carRef = useRef<Mesh>(null)
  const [isFirstPerson, setIsFirstPerson] = useState(false)
  const [hudData, setHudData] = useState({ speed: 0, gear: 'N' })
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

  const keys = useKeyboard()
const CurrentCar = carComponents[selectedCar]

  // Reset car ref when switching tracks
  useEffect(() => {
    if (carRef.current) {
      // You might want to reset any car-specific state here if needed
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
  }

  // Handle countdown completion
  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setGameStarted(true)
  }

  // Handle checkpoint timeout - UPDATED FOR BOTH TRACKS
  const handleCheckpointTimeout = (checkpointNumber: number) => {
    console.log(`Time's up for checkpoint ${checkpointNumber}!`);
    
    // Reset to the checkpoint that timed out (not previous one)
    setCurrentCheckpoint(Math.max(0, checkpointNumber - 1));
    setCheckpoints(checkpoints.filter(cp => cp < checkpointNumber));
    
    // Keep the same checkpoint active to try again
    setTimeout(() => {
      setActiveCheckpoint(checkpointNumber);
    }, 100);
    
    console.log(`Reset to checkpoint ${checkpointNumber}`);
  };

  // Handle checkpoint events - UPDATED FOR BOTH TRACKS
  const handleCheckpoint = (checkpointNumber: number) => {
    if (!checkpoints.includes(checkpointNumber)) {
      const newCheckpoints = [...checkpoints, checkpointNumber];
      setCheckpoints(newCheckpoints);
      setCurrentCheckpoint(checkpointNumber);
      
      // Set next checkpoint as active, or null if it's the last one
      const nextCheckpoint = checkpointNumber < 3 ? checkpointNumber + 1 : null;
      
      // Small delay to ensure smooth transition between checkpoints
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint);
      }, 100);
      
      // Store track-specific checkpoints
      if (currentLevel === 1) {
        setTrack1Checkpoints(newCheckpoints);
      } else if (currentLevel === 2) {
        setTrack2Checkpoints(newCheckpoints);
      }
      
      console.log(`Checkpoint ${checkpointNumber} reached! Next: ${nextCheckpoint}`);
    }
  };

  // Reset game state when track changes
  const handleTrackChange = (newTrack: number) => {
    if (!gameStarted) return
    
    setCurrentLevel(newTrack)
    setGameStarted(false)
    setShowCountdown(false)
    setShowControls(false)
    setActiveCheckpoint(null)
    
    // Reset current checkpoint state but preserve track-specific states
    setCheckpoints([])
    setCurrentCheckpoint(0)
    
    // Force re-render of physics and car by changing key
    setKey(prev => prev + 1)
    
    // Start countdown automatically after track change
    setTimeout(() => {
      setShowCountdown(true)
    }, 500)
  }

  // Restore track-specific checkpoints when switching tracks
  useEffect(() => {
    if (currentLevel === 1 && track1Checkpoints.length > 0) {
      setCheckpoints(track1Checkpoints)
      setCurrentCheckpoint(Math.max(...track1Checkpoints))
      // Set the next checkpoint as active
      const nextCheckpoint = Math.max(...track1Checkpoints) + 1
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint <= 3 ? nextCheckpoint : null)
      }, 100)
    } else if (currentLevel === 2 && track2Checkpoints.length > 0) {
      setCheckpoints(track2Checkpoints)
      setCurrentCheckpoint(Math.max(...track2Checkpoints))
      // Set the next checkpoint as active
      const nextCheckpoint = Math.max(...track2Checkpoints) + 1
      setTimeout(() => {
        setActiveCheckpoint(nextCheckpoint <= 3 ? nextCheckpoint : null)
      }, 100)
    }
  }, [currentLevel, track1Checkpoints, track2Checkpoints])

  // Initialize with the prop track
  useEffect(() => {
    setCurrentLevel(track)
  }, [track])

  // Set the initial active checkpoint when game starts - UPDATED FOR BOTH TRACKS
  useEffect(() => {
    if (gameStarted) {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        setActiveCheckpoint(1);
        setCheckpoints([]);
        setCurrentCheckpoint(0);
      }, 100);
    }
  }, [gameStarted, currentLevel]);

  // Reset countdowns when track changes - UPDATED FOR BOTH TRACKS
  useEffect(() => {
    if (gameStarted) {
      // If we have checkpoints, continue from next one, otherwise start from 1
      if (checkpoints.length > 0) {
        const nextCheckpoint = Math.max(...checkpoints) + 1;
        setTimeout(() => {
          setActiveCheckpoint(nextCheckpoint <= 3 ? nextCheckpoint : null);
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
            startPosition={currentLevel === 1 ? [10, 2.5, -7] : [-12, 2.5, -16]}
            // flip the car for level 2
            startRotation={currentLevel === 2 ? [0, Math.PI, 0] : [0, 0, 0]}
            onHudUpdate={setHudData}
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

      {/* HUD */}
      {isFirstPerson ? (
        <FirstPersonHUD 
          speed={hudData.speed} 
          gear={hudData.gear} 
          currentCheckpoint={currentCheckpoint}
        />
      ) : (
        <HUDOverlay 
          speed={hudData.speed} 
          gear={hudData.gear} 
          currentCheckpoint={currentCheckpoint}
        />
      )}

      {/* Checkpoint Countdown for both tracks */}
      {activeCheckpoint && gameStarted && (
        <CheckpointCountdown
          checkpointNumber={activeCheckpoint}
          isActive={gameStarted && activeCheckpoint !== null}
          onTimeout={handleCheckpointTimeout}
          duration={10} // 10 seconds per checkpoint
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
    </div>
  )
}