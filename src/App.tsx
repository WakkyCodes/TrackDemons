import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

import Car from './components/Car'
import Ground from './components/Ground'
import Lights from './components/Lights'
import CameraController from './components/CameraController'

export default function App() {
  const carRef = useRef<Mesh>(null)
  const [isFirstPerson, setIsFirstPerson] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [3, 3, 3] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Lights />

        <Physics gravity={[0, -9.82, 0]}>
          <Ground />
          <Car ref={carRef} />
        </Physics>

        {/* Camera logic */}
        <CameraController target={carRef} isFirstPerson={isFirstPerson} />

        <Environment files={`${import.meta.env.BASE_URL}sky_4k.hdr`} background />

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
