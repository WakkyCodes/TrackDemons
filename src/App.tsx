import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { useRef } from 'react'
import { Mesh } from 'three'

import Car from './components/Car'
import Ground from './components/Ground'
import Lights from './components/Lights'
import CameraController from './components/CameraController'

export default function App() {
  const carRef = useRef<Mesh>(null)

  return (
    <Canvas
      shadows
      camera={{ position: [3, 3, 3] }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Lights />

      <Physics gravity={[0, -9.82, 0]}>
        <Ground />
        <Car ref={carRef} />
      </Physics>

      <CameraController target={carRef} />

      <Environment files="/sky_4k.hdr" background />
    </Canvas>
  )
}