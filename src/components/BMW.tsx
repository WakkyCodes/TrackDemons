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
  startRotation?: [number, number, number]
}

const Car = forwardRef<Mesh, CarProps>(
  ({ onHudUpdate, startPosition = [9, 9, -7], startRotation = [0, 0, 0]}, ref) => {
    const [physicsRef, api] = useBox<Mesh>(() => ({
      mass: 1500, // Increased for BMW M3 weight
      position: startPosition,
      rotation: startRotation,
      args: [1.8, 0.5, 4.6], // Better match BMW M3 dimensions
      linearDamping: 0.7,    // Increased for less sliding
      angularDamping: 0.7,   // Increased for less rotational bounce
      material: {
        friction: 0.4,       // Adjusted for smoother movement
        restitution: 0.1,    // Keep low to prevent bouncing
      },
      angularFactor: [0, 1, 0],
      linearFactor: [1, 0, 1],
    }))

    useImperativeHandle(ref, () => physicsRef.current!, [physicsRef])

    const [speed, setSpeed] = useState(0)
    const [gear, setGear] = useState('N')

    const keys = useKeyboard()

    const velocity = useRef([0, 0, 0])
    const rotation = useRef([0, 0, 0, 1])

    const currentSpeed = useRef(0)
    const targetSpeed = useRef(0)
    const isReversing = useRef(false)

    useEffect(() => {
      const unsubV = api.velocity.subscribe((v) => (velocity.current = v))
      const unsubR = api.quaternion.subscribe((r) => (rotation.current = r))
      return () => {
        unsubV()
        unsubR()
      }
    }, [api])

    // Add velocity limiting to prevent extreme speeds
    useEffect(() => {
      // Limit maximum velocity to prevent extreme speeds
      const interval = setInterval(() => {
        const [vx, vy, vz] = velocity.current
        const currentSpeed = Math.sqrt(vx*vx + vz*vz)
        
        if (currentSpeed > 25) { // Cap maximum speed
          const factor = 25 / currentSpeed
          api.velocity.set(vx * factor, vy, vz * factor)
        }
      }, 100)
      
      return () => clearInterval(interval)
    }, [api])

    useFrame((_, delta) => {
      if (!physicsRef.current) return

      const maxSpeed = 15
      const maxReverseSpeed = 6 // Lower max speed for reverse
      const acceleration = 12      // Increased for more responsive control
      const deceleration = 6       // Increased for quicker stopping
      const turnSpeed = 2.5        // Reduced for smoother turning

      // Speed control
      if (keys.forward) {
        targetSpeed.current = -maxSpeed
        isReversing.current = false
      } else if (keys.backward) {
        targetSpeed.current = maxReverseSpeed
        isReversing.current = true
      } else {
        targetSpeed.current = 0
        // Don't reset isReversing here - we want to maintain the state until we start moving forward
      }

      // Smooth acceleration/deceleration with delta time
      const speedDiff = targetSpeed.current - currentSpeed.current
      const accelerationRate = Math.abs(speedDiff) > 0.1 ? 
        (speedDiff > 0 ? acceleration : deceleration) : deceleration
      
      currentSpeed.current += speedDiff * accelerationRate * delta
      currentSpeed.current = Math.max(-maxSpeed, Math.min(maxReverseSpeed, currentSpeed.current))

      // Smoother turn control
      const turnDirection = keys.left ? 1 : keys.right ? -1 : 0
      
      if (turnDirection !== 0 && Math.abs(currentSpeed.current) > 0.5) {
        const turnIntensity = Math.min(1, Math.abs(currentSpeed.current) / maxSpeed) * 0.6
        
        let effectiveTurnDirection = turnDirection
        
        // Reverse turning direction when in reverse
        if (isReversing.current) {
          effectiveTurnDirection = -turnDirection
        } else if (currentSpeed.current > 0) {
          effectiveTurnDirection = -turnDirection
        }

        const finalTurnSpeed = effectiveTurnDirection * turnSpeed * turnIntensity
        
        // Smooth angular velocity application
        api.angularVelocity.set(0, finalTurnSpeed, 0)
      } else {
        // Gradual stop of rotation
        api.angularVelocity.set(0, 0, 0)
      }

      // Apply movement only if significant speed
      if (Math.abs(currentSpeed.current) > 0.1) {
        const forwardVector = new Vector3(0, 0, -1)
        const carQuaternion = new Quaternion().fromArray(rotation.current)
        const worldDirection = forwardVector.applyQuaternion(carQuaternion)
        
        // Use lerp for smoother direction changes
        worldDirection.multiplyScalar(currentSpeed.current)
        
        const currentVel = new Vector3(velocity.current[0], velocity.current[1], velocity.current[2])
        const targetVel = new Vector3(worldDirection.x, 0, worldDirection.z)
        
        // Smooth velocity transition
        currentVel.lerp(targetVel, 4 * delta)
        
        api.velocity.set(currentVel.x, velocity.current[1], currentVel.z)
      } else {
        // Gradual stop
        currentSpeed.current = 0
        const currentVel = new Vector3(velocity.current[0], velocity.current[1], velocity.current[2])
        currentVel.lerp(new Vector3(0, velocity.current[1], 0), 6 * delta)
        api.velocity.set(currentVel.x, currentVel.y, currentVel.z)
      }

      // Calculate HUD data
      const [vx, , vz] = velocity.current
      const speedMs = Math.sqrt(vx * vx + vz * vz)
      const speedKmh = Math.abs(speedMs * 3.6)

      // Determine gear with reverse support
      let currentGear = 'N'
      
      if (speedKmh === 0) {
        currentGear = 'N'
      } else if (isReversing.current) {
        currentGear = 'R'
      } else {
        // Forward gears
        if (speedKmh < 30) currentGear = '1'
        else if (speedKmh < 60) currentGear = '2'
        else if (speedKmh < 90) currentGear = '3'
        else currentGear = '4'
      }

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