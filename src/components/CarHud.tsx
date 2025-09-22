// components/CarHUD.tsx - FIXED REFLECTION
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Text, Billboard } from '@react-three/drei'
import { Mesh } from 'three'

interface CarHUDProps {
  carApi: any
  position?: [number, number, number]
  showGear?: boolean
}

const CarHUD = ({ carApi, position = [-15, -2, 0], showGear = true }: CarHUDProps) => {
  const speedRef = useRef<number>(0)
  const gearRef = useRef<string>('N')

  useFrame(() => {
    if (carApi && carApi.velocity) {
      const [vx, vy, vz] = carApi.velocity
      const speedMs = Math.sqrt(vx * vx + vz * vz)
      const speedKmh = Math.abs(speedMs * 3.6)
      speedRef.current = speedKmh

      // Simple gear detection
      if (speedKmh ==0) 
        gearRef.current = 'N'
      else if (speedKmh < 30) gearRef.current = '1'
      else if (speedKmh < 60) gearRef.current = '2'
      else if (speedKmh < 90) gearRef.current = '3'
      else gearRef.current = '4'
    }
  })

  return (
    <Billboard> {/* This fixes the reflection - always faces camera */}
      <group position={position}>
        {/* Speed Display */}
        <Text
          position={[15, -3, 0]}  
          fontSize={0.9}
          color="#00ff88"
          anchorX="right"
          anchorY="middle"
        >
          {Math.round(speedRef.current).toString().padStart(3, '0')}
        </Text>
        
        {/* Unit */}
        <Text
          position={[15, -2, 0]}  
          fontSize={0.7}
          color="#00ff88"
          anchorX="right"
          anchorY="middle"
        >
          km/h
        </Text>
        
        {/* Gear Indicator */}
        {showGear && (
          <Text
            position={[14.3, -1, 0]}  
            fontSize={0.6}
            color="#ff4444"
            anchorX="right" 
            anchorY="middle"
          >
            {gearRef.current}
          </Text>
        )}
      </group>
    </Billboard>
  )
}

export default CarHUD