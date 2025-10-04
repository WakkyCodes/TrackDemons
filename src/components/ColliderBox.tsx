import { useBox } from '@react-three/cannon'
import { useRef } from 'react'
import { Mesh } from 'three'

type ColliderBoxProps = {
  position: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number]
  visible?: boolean // Toggle visibility for debugging
}

export default function ColliderBox({ 
  position, 
  scale = [1, 1, 1], 
  rotation = [0, 0, 0],
  visible = true // Set to true to see red boxes
}: ColliderBoxProps) {
  const meshRef = useRef<Mesh>(null)

  // Attach physics to the mesh
  useBox(() => ({
    args: scale,
    position,
    rotation,
    type: 'Static',
  }), meshRef)

  if (!visible) return null

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={scale} />
      <meshBasicMaterial 
        color="red" 
        wireframe 
        transparent 
        opacity={0.5}
      />
    </mesh>
  )
}