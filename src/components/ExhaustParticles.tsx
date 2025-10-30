import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, BufferAttribute } from 'three'

interface ExhaustParticlesProps {
  carSpeed: number
  isReversing: boolean
   isBoosting?: boolean
  position?: [number, number, number]
}

export const ExhaustParticles = ({ 
  carSpeed, 
  isReversing, 
  position = [-4.5, 0.3, -2] 
}: ExhaustParticlesProps) => {
  const particlesRef = useRef<Points>(null)
  
  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const count = 20
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2
      positions[i * 3 + 2] = Math.random() * 0.5
      
      colors[i * 3] = 0.3 + Math.random() * 0.2
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.3 + Math.random() * 0.2
    }
    
    geo.setAttribute('position', new BufferAttribute(positions, 3))
    geo.setAttribute('color', new BufferAttribute(colors, 3))
    
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!particlesRef.current) return
    
    const particles = particlesRef.current
    const positions = particles.geometry.attributes.position.array as Float32Array
    
    const shouldEmit = carSpeed > 2 && !isReversing
    
    for (let i = 0; i < positions.length / 3; i++) {
      if (shouldEmit) {
        positions[i * 3 + 2] -= delta * (3 + carSpeed * 0.5)
        
        if (positions[i * 3 + 2] < -1) {
          positions[i * 3] = (Math.random() - 0.5) * 0.3
          positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2
          positions[i * 3 + 2] = Math.random() * 0.3
        }
        
        positions[i * 3] += (Math.random() - 0.5) * 0.1
        positions[i * 3 + 1] += (Math.random() - 0.5) * 0.05
      } else {
        positions[i * 3 + 2] = -10
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef} geometry={geometry} position={position}>
      <pointsMaterial
        size={0.20}
        vertexColors
        color="grey" 
        transparent
        opacity={0.9}
        blending={2}
      />
    </points>
  )
}