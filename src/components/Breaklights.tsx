import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial,Group } from 'three'

interface BrakeLightsProps {
  isBraking: boolean
  isReversing: boolean
  carRef: React.RefObject<Mesh>
  position?: [number, number, number]
}

export const BrakeLights = ({ 
  isBraking, 
  isReversing,
  carRef, 
  position = [0, 0, 0] 
}: BrakeLightsProps) => {
     const brakeLightsGroupRef = useRef<Group>(null)
  const brakeLightLeftRef = useRef<Mesh>(null)
  const brakeLightRightRef = useRef<Mesh>(null)
  const reverseLightLeftRef = useRef<Mesh>(null)
  const reverseLightRightRef = useRef<Mesh>(null)

  useFrame(() => 
    {
    
       if (brakeLightsGroupRef.current && carRef.current) {
      brakeLightsGroupRef.current.position.copy(carRef.current.position)
      brakeLightsGroupRef.current.rotation.copy(carRef.current.rotation)
      brakeLightsGroupRef.current.scale.copy(carRef.current.scale)
    }

    if (brakeLightLeftRef.current) {
      const brakeLightMaterial = brakeLightLeftRef.current.material as MeshStandardMaterial
      
      if (isBraking) 
        {
        brakeLightMaterial.emissive.set('#ff0000')
        brakeLightMaterial.emissiveIntensity = 0.8
        brakeLightMaterial.color.set('#ff3333')
      } else {
        brakeLightMaterial.emissive.set('#330000')
        brakeLightMaterial.emissiveIntensity = 0.1
        brakeLightMaterial.color.set('#660000')
      }
    }

    // Update RIGHT brake light
    if (brakeLightRightRef.current) {
      const brakeLightMaterial = brakeLightRightRef.current.material as MeshStandardMaterial
      
      if (isBraking) {
        brakeLightMaterial.emissive.set('#ff0000')
        brakeLightMaterial.emissiveIntensity = 0.8
        brakeLightMaterial.color.set('#ff3333')
      } else {
        brakeLightMaterial.emissive.set('#330000')
        brakeLightMaterial.emissiveIntensity = 0.1
        brakeLightMaterial.color.set('#660000')
      }
    }

    // Update LEFT reverse light
    if (reverseLightLeftRef.current) {
      const reverseLightMaterial = reverseLightLeftRef.current.material as MeshStandardMaterial
      
      if (isReversing) {
        reverseLightMaterial.emissive.set('#ffffff')
        reverseLightMaterial.emissiveIntensity = 0.6
        reverseLightMaterial.color.set('#eeeeee')
      } else {
        reverseLightMaterial.emissive.set('#000000')
        reverseLightMaterial.emissiveIntensity = 0
        reverseLightMaterial.color.set('#444444')
      }
    }

    // Update RIGHT reverse light
    if (reverseLightRightRef.current) {
      const reverseLightMaterial = reverseLightRightRef.current.material as MeshStandardMaterial
      
      if (isReversing) {
        reverseLightMaterial.emissive.set('#ffffff')
        reverseLightMaterial.emissiveIntensity = 0.6
        reverseLightMaterial.color.set('#eeeeee')
      } else {
        reverseLightMaterial.emissive.set('#000000')
        reverseLightMaterial.emissiveIntensity = 0
        reverseLightMaterial.color.set('#444444')
      }
    }
  })

  return (
    <group position={position}>
      {/* right Brake Light */}
      <mesh ref={brakeLightLeftRef} position={[-0.42, 0.35, -1.8]}>
        <boxGeometry args={[0.06, 0.03, 0.05]} />
        <meshStandardMaterial 
          color="#ed0f0fff"
          emissive="#330000"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* left Brake Light */}
      <mesh ref={brakeLightRightRef} position={[0, 0.35, -1.8]}>
        <boxGeometry args={[0.06, 0.03, 0]} />
        <meshStandardMaterial 
          color="#f50b0bff"
          emissive="#330000"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* right Reverse Light */}
      <mesh ref={reverseLightLeftRef} position={[-0.35, 0.35, -1.8]}>
        <boxGeometry args={[0.05, 0.02, 0]} />
        <meshStandardMaterial 
          color="#ebe2e2ff"
          emissive="#000000"
          emissiveIntensity={0}
        />
      </mesh>
      
      {/* left Reverse Light */}
      <mesh ref={reverseLightRightRef} position={[-0.1, 0.35, -1.8]}>
        <boxGeometry args={[0.05, 0.02, 0]} />
        <meshStandardMaterial 
          color="#f2e8e8ff"
          emissive="#000000"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  )
}