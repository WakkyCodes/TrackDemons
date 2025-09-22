// components/Speedometer.tsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Text } from '@react-three/drei'

interface SpeedometerProps {
  carApi: any // Your car's physics API
  position?: [number, number, number]
  visible?: boolean
}

const Speedometer = ({ carApi, position = [0, 2, 0], visible = true }: SpeedometerProps) => {
  const speedRef = useRef<number>(0)
  const textRef = useRef<any>(null)

  useFrame(() => {
    if (carApi && carApi.velocity) {
      // Get velocity magnitude (speed in m/s) and convert to km/h
      const [vx, vy, vz] = carApi.velocity
      const speedMs = Math.sqrt(vx * vx + vz * vz) // Ignore vertical velocity
      const speedKmh = Math.abs(speedMs * 3.6) // Convert to km/h
      speedRef.current = speedKmh
    }
  })

  if (!visible) return null

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.3}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {Math.round(speedRef.current)} km/h
    </Text>
  )
}

export default Speedometer