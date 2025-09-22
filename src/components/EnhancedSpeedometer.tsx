// components/EnhancedSpeedometer.tsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Text, RoundedBox, Circle } from '@react-three/drei'

interface EnhancedSpeedometerProps {
  carApi: any
  position?: [number, number, number]
  size?: number
}

const EnhancedSpeedometer = ({ 
  carApi, 
  position = [0, 2, 0], 
  size = 0.8 
}: EnhancedSpeedometerProps) => {
  const needleRef = useRef<any>(null!)
  const speedRef = useRef<number>(0)

  useFrame(() => {
    if (carApi && carApi.velocity && needleRef.current) {
      const [vx, vy, vz] = carApi.velocity
      const speedMs = Math.sqrt(vx * vx + vz * vz)
      const speedKmh = Math.abs(speedMs * 3.6)
      speedRef.current = speedKmh

      // Rotate needle (0-240 km/h range)
      const maxSpeed = 240
      const rotation = (speedKmh / maxSpeed) * Math.PI // 0 to 180 degrees in radians
      needleRef.current.rotation.z = -rotation
    }
  })

  return (
    <group position={position}>
      {/* Speedometer Base */}
      <RoundedBox args={[size, size * 0.6, 0.1]} radius={0.05}>
        <meshStandardMaterial color="#2a2a2a" transparent opacity={0.9} />
      </RoundedBox>
      
      {/* Dial */}
      <Circle args={[size * 0.4, 32]} position={[0, 0, 0.05]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Circle>
      
      {/* Needle */}
      <group ref={needleRef}>
        <RoundedBox 
          args={[size * 0.3, 0.02, 0.02]} 
          position={[size * 0.15, 0, 0.1]} 
          radius={0.01}
        >
          <meshStandardMaterial color="#ff4444" />
        </RoundedBox>
      </group>
      
      {/* Center Pin */}
      <Circle args={[0.02, 16]} position={[0, 0, 0.11]}>
        <meshStandardMaterial color="#666" />
      </Circle>
      
      {/* Speed Text */}
      <Text
        position={[0, -size * 0.2, 0.1]}
        fontSize={size * 0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(speedRef.current)}
      </Text>
      
      {/* Unit Text */}
      <Text
        position={[0, -size * 0.3, 0.1]}
        fontSize={size * 0.08}
        color="#888888ff"
        anchorX="center"
        anchorY="middle"
      >
        km/h
      </Text>
      
      {/* Markings */}
      {[...Array(7)].map((_, i) => {
        const angle = (i / 6) * Math.PI
        const value = i * 40
        const x = Math.sin(angle) * size * 0.35
        const y = Math.cos(angle) * size * 0.35
        
        return (
          <group key={i}>
            <Text
              position={[x * 0.8, y * 0.8, 0.1]}
              fontSize={size * 0.06}
              color="#888"
              anchorX="center"
              anchorY="middle"
            >
              {value}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

export default EnhancedSpeedometer