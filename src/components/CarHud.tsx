import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

interface CarHUDProps {
  carApi: { velocity: number[] }
  onUpdate?: (speed: number, gear: string) => void
}

export const CarHUD: React.FC<CarHUDProps> = ({ carApi, onUpdate }) => {
  const speedRef = useRef<number>(0)
  const gearRef = useRef<string>('N')

  useFrame(() => {
    if (carApi && carApi.velocity) {
      const [vx,/*vy*/, vz] = carApi.velocity
      const speedMs = Math.sqrt(vx * vx + vz * vz)
      const speedKmh = Math.abs(speedMs * 3.6)
      speedRef.current = speedKmh

      // simple gear detection
      if (speedKmh === 0) gearRef.current = 'N'
      else if (speedKmh < 30) gearRef.current = '1'
      else if (speedKmh < 60) gearRef.current = '2'
      else if (speedKmh < 90) gearRef.current = '3'
      else gearRef.current = '4'

      // call parent hook
      if (onUpdate) {
        onUpdate(speedRef.current, gearRef.current)
      }
    }
  })

  return null // no 3D object, just logic
}
