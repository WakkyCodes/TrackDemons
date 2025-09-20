import { usePlane } from '@react-three/cannon'
import { Mesh } from 'three'
import { useRef } from 'react'

export default function Ground() {
  const groundRef = useRef<Mesh>(null)

  usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }), groundRef)

  return (
    <mesh ref={groundRef} receiveShadow>
      <planeGeometry args={[14, 300]} />
      <meshStandardMaterial color="black" />
    </mesh>
  )
}
