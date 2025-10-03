import { useBox } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Mesh, Quaternion, Vector3 } from 'three'
import {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
} from 'react'
import useKeyboard from '../hooks/useKeyboard'
import { useGLTF } from '@react-three/drei'

interface CarProps {
  onHudUpdate?: (data: { speed: number; gear: string }) => void
  startPosition?: [number, number, number]
}

const Car = forwardRef<Mesh, CarProps>(
  ({ onHudUpdate, startPosition = [9, 9, -7] }, ref) => {
    const [physicsRef, api] = useBox<Mesh>(() => ({
      mass: 1000,
      position: startPosition,
      args: [0, 0.5, 2],
      linearDamping: 0.3,
      angularDamping: 0.4,
      material: {
        friction: 0.8,
        restitution: 0.1,
      },
      angularFactor: [0, 1, 0],
    }))

    useImperativeHandle(ref, () => physicsRef.current!, [physicsRef])

    const [speed, setSpeed] = useState(0)
    const [gear, setGear] = useState('N')

    const keys = useKeyboard()

    const velocity = useRef([0, 0, 0])
    const rotation = useRef([0, 0, 0, 1])

    const currentSpeed = useRef(0)
    const targetSpeed = useRef(0)

    useEffect(() => {
      const unsubV = api.velocity.subscribe((v) => (velocity.current = v))
      const unsubR = api.quaternion.subscribe((r) => (rotation.current = r))
      return () => {
        unsubV()
        unsubR()
      }
    }, [api])

    useFrame((_, delta) => {
      if (!physicsRef.current) return

      const maxSpeed = 40
      const acceleration = 7
      const deceleration = 3
      const turnSpeed = 8

      // Speed control
      if (keys.forward) {
        targetSpeed.current = -maxSpeed
      } else if (keys.backward) {
        targetSpeed.current = 5
      } else {
        targetSpeed.current = 0
      }

      if (currentSpeed.current < targetSpeed.current) {
        currentSpeed.current += acceleration * delta
        currentSpeed.current = Math.min(currentSpeed.current, targetSpeed.current)
      } else if (currentSpeed.current > targetSpeed.current) {
        currentSpeed.current -= deceleration * delta
        currentSpeed.current = Math.max(currentSpeed.current, targetSpeed.current)
      }

      // Turn control
      const turnDirection = keys.left ? 1 : keys.right ? -1 : 0

      if (turnDirection === 0) {
        api.angularVelocity.set(0, 0, 0)
      } else {
        const turnIntensity = Math.min(
          1,
          Math.abs(currentSpeed.current) / maxSpeed
        )

        let effectiveTurnDirection = turnDirection
        if (currentSpeed.current > 0) {
          effectiveTurnDirection = -turnDirection
        }

        const finalTurnSpeed = effectiveTurnDirection * turnSpeed * turnIntensity
        api.angularVelocity.set(0, finalTurnSpeed, 0)
      }

      // Apply movement
      if (Math.abs(currentSpeed.current) > 0.01) {
        const forwardVector = new Vector3(0, 0, -1)
        const carQuaternion = new Quaternion().fromArray(rotation.current)
        const worldDirection = forwardVector.applyQuaternion(carQuaternion)

        worldDirection.multiplyScalar(currentSpeed.current)
        api.velocity.set(worldDirection.x, velocity.current[1], worldDirection.z)
      } else if (turnDirection === 0) {
        currentSpeed.current = 0
        api.velocity.set(0, velocity.current[1], 0)
      }

      // Calculate HUD data
      const [vx, , vz] = velocity.current
      const speedMs = Math.sqrt(vx * vx + vz * vz)
      const speedKmh = Math.abs(speedMs * 3.6)

      // Determine gear
      let currentGear = 'N'
      if (speedKmh === 0) currentGear = 'N'
      else if (speedKmh < 30) currentGear = '1'
      else if (speedKmh < 60) currentGear = '2'
      else if (speedKmh < 90) currentGear = '3'
      else currentGear = '4'

      // Update state and parent
      if (Math.abs(speedKmh - speed) > 0.5 || currentGear !== gear) {
        setSpeed(speedKmh)
        setGear(currentGear)
        onHudUpdate?.({ speed: speedKmh, gear: currentGear })
      }
    })

    const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/bmw_m3.glb`)

    return (
      <mesh ref={physicsRef} castShadow>
       <group position={[0.7, 0, 0]}>
    <primitive object={scene} scale={0.5} />
  </group>
      </mesh>
    )
  }
)

Car.displayName = 'Car'
export default Car