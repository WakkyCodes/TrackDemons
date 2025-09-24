import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

import Car from './components/Car'
//import Ground from './components/Ground'
import Track01 from './components/Track01'; // Make sure you renamed the file
import Track02 from './components/Track02';

import Lights from './components/Lights'
import CameraController from './components/CameraController'
import ReflectiveGround from './components/ReflectiveGround'

export default function App() {
  const carRef = useRef<Mesh>(null)
  const [isFirstPerson, setIsFirstPerson] = useState(false)

  const [currentLevel, setCurrentLevel] = useState(1);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [3, 3, 3] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights />

        <Physics gravity={[0, -9.82, 0]}>
          
          <ReflectiveGround />

          {currentLevel === 1 && <Track01 />}
          {currentLevel === 2 && <Track02 />}

          <Car ref={carRef} />

        </Physics>

        {/* Camera logic */}
        <CameraController target={carRef} isFirstPerson={isFirstPerson} />

        <Environment files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`} background />
www
      </Canvas>

      {/* UI overlay button */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        {/* 3. Add UI buttons to change the level */}
      <div style={{ position: 'absolute', top: '50px',  left: '0px', zIndex: 1000, display: 'flex', gap: '10px' }}>
        <button onClick={() => setCurrentLevel(1)} style={{ padding: '10px', backgroundColor: currentLevel === 1 ? 'dodgerblue' : 'grey', color: 'white', border: 'none', borderRadius: '5px' }}>
          Level 1
        </button>
        <button onClick={() => setCurrentLevel(2)} style={{ padding: '10px', backgroundColor: currentLevel === 2 ? 'dodgerblue' : 'grey', color: 'white', border: 'none', borderRadius: '5px' }}>
          Level 2
        </button>
      </div>

        <button
          onClick={() => setIsFirstPerson(!isFirstPerson)}
          style={{
            padding: '10px 20px',
            backgroundColor: isFirstPerson ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {isFirstPerson ? '1st Person' : '3rd Person'}
        </button>
      </div>
    </div>
  )
}
