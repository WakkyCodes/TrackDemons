import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { useEffect, useRef, useState } from 'react'
import { Mesh } from 'three'

import Car from './Car'
import Track01 from './Track01'
import Track02 from './Track02'
import Lights from './Lights'
import FollowCam from './FollowCam'
import CameraController from './CameraController'
import ReflectiveGround from './ReflectiveGround'
import HUDOverlay from './HUDOverlay'
import FirstPersonHUD from './FirstPersonHUD'
import ControlsPopup from './ControlsPopup'
import CarSound from './CarSound'
import useKeyboard from '../hooks/useKeyboard'

type GameProps = {
  track: number
  onBackToMenu: () => void
}

export default function Game({ track, onBackToMenu }: GameProps) {
  const carRef = useRef<Mesh>(null)
  const [isFirstPerson, setIsFirstPerson] = useState(false)
  const [hudData, setHudData] = useState({ speed: 0, gear: 'N' })
  const [currentLevel, setCurrentLevel] = useState(track)

  const keys = useKeyboard()

  // Toggle first-person camera using 'C' key
  useEffect(() => {
    if (keys.c) {
      setIsFirstPerson((prev) => !prev)
    }
  }, [keys.c])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [3, 3, 3] }}>
        <Lights />

        <Physics gravity={[0, -9.82, 0]}>
          <ReflectiveGround />
          <FollowCam target={carRef} enabled={!isFirstPerson} />

          {currentLevel === 1 && <Track01 />}
          {currentLevel === 2 && <Track02 />}

          <Car
            ref={carRef}
            startPosition={currentLevel === 1 ? [9, 2.5, -7] : [0, 2.5, 0]}
            onHudUpdate={setHudData}
          />

          <CarSound speed={hudData.speed} gear={hudData.gear} />
        </Physics>

        <CameraController target={carRef} isFirstPerson={isFirstPerson} />
        <Environment files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`} background />
      </Canvas>

      <ControlsPopup />

      {/* HUD */}
      {isFirstPerson ? (
        <FirstPersonHUD speed={hudData.speed} gear={hudData.gear} />
      ) : (
        <HUDOverlay speed={hudData.speed} gear={hudData.gear} />
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
          onClick={() => setCurrentLevel(1)}
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
          }}
        >
          Track 1
        </button>
        <button
          onClick={() => setCurrentLevel(2)}
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
        <button onClick={onBackToMenu}>Back to Menu</button>
        
      </div>
    </div>
  )
}
