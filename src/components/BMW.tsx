import { useBox } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Mesh, Quaternion, Vector3 } from 'three'
import { ExhaustParticles } from './ExhaustParticles' 
import {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react'
import useKeyboard from '../hooks/useKeyboard'
import { useGLTF } from '@react-three/drei'

// Define the car handle interface for boost functionality
interface CarHandle {
  activateBoost: (multiplier?: number, duration?: number) => void
  getSpeed: () => number
  getBoostActive: () => boolean
}

interface CarProps {
  onHudUpdate?: (data: { speed: number; gear: string; boostActive?: boolean }) => void
  startPosition?: [number, number, number]
  disabled?: boolean // Add disabled prop
  startRotation?: [number, number, number]
}

const Car = forwardRef<Mesh & CarHandle, CarProps>(
  ({ onHudUpdate, startPosition = [9, 9, -7], startRotation = [0, 0, 0]}, ref) => {
    const [physicsRef, api] = useBox<Mesh>(() => ({
      mass: 1500, 
      position: [startPosition[0], 0.5, startPosition[2]],
      rotation: startRotation,
      args: [1.8, 0.5, 4.6], // Better match BMW M3 dimensions
      linearDamping: 0.7,    // Increased for less sliding
      angularDamping: 0.7,   // Increased for less rotational bounce
      material: {
        friction: 0.4,       // Adjusted for smoother movement
        restitution: 0.1,    
      },
      angularFactor: [0, 1, 0],
      linearFactor: [1, 0, 1],
    }))

    const [speed, setSpeed] = useState(0)
    const [gear, setGear] = useState('N')
    const [boostActive, setBoostActive] = useState(false) // Boost state

    const keys = useKeyboard()

    const velocity = useRef([0, 0, 0])
    const rotation = useRef([0, 0, 0, 1])

    const currentSpeed = useRef(0)
    const targetSpeed = useRef(0)
    const isReversing = useRef(false)
    const boostMultiplier = useRef(1) // Boost multiplier
    const boostTimeRemaining = useRef(0) // Boost duration timer

    // Boost activation function
    const activateBoost = useCallback((multiplier: number = 1.5, duration: number = 2) => {
      boostMultiplier.current = multiplier
      boostTimeRemaining.current = duration
      setBoostActive(true)
      
      // Update HUD with boost status
      onHudUpdate?.({ speed, gear, boostActive: true })
    }, [speed, gear, onHudUpdate])

    // Proper useImperativeHandle implementation
    useImperativeHandle(ref, () => {
      const mesh = physicsRef.current!
      return Object.assign(mesh, {
        activateBoost,
        getSpeed: () => speed,
        getBoostActive: () => boostActive,
      })
    }, [physicsRef, speed, boostActive, activateBoost])

    useEffect(() => {
      const unsubV = api.velocity.subscribe((v) => (velocity.current = v))
      const unsubR = api.quaternion.subscribe((r) => (rotation.current = r))
      return () => {
        unsubV()
        unsubR()
      }
    }, [api])

    // Boost timer management
    useFrame((_, delta) => {
      if (boostTimeRemaining.current > 0) {
        boostTimeRemaining.current -= delta
        
        if (boostTimeRemaining.current <= 0) {
          boostTimeRemaining.current = 0
          boostMultiplier.current = 1
          setBoostActive(false)
          onHudUpdate?.({ speed, gear, boostActive: false })
        }
      }
    })

    // Add velocity limiting to prevent extreme speeds
    useEffect(() => {
      const interval = setInterval(() => {
        const [vx, vy, vz] = velocity.current
        const currentSpeed = Math.sqrt(vx*vx + vz*vz)
        
        // Adjust max speed based on boost
        const effectiveMaxSpeed = boostActive ? 25 * boostMultiplier.current : 25
        
        if (currentSpeed > effectiveMaxSpeed) {
          const factor = effectiveMaxSpeed / currentSpeed
          api.velocity.set(vx * factor, vy, vz * factor)
        }
      }, 100)
      
      return () => clearInterval(interval)
    }, [api, boostActive])

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
      }

      // Apply boost multiplier to acceleration
      const effectiveAcceleration = boostActive ? acceleration * boostMultiplier.current : acceleration
      
      // Smooth acceleration/deceleration with delta time
      const speedDiff = targetSpeed.current - currentSpeed.current
      const accelerationRate = Math.abs(speedDiff) > 0.1 ? 
        (speedDiff > 0 ? effectiveAcceleration : deceleration) : deceleration
      
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
        // Forward gears - adjusted for BMW performance
        if (speedKmh < 30) currentGear = '1'
        else if (speedKmh < 60) currentGear = '2'
        else if (speedKmh < 90) currentGear = '3'
        else currentGear = '4'
      }

      // Update state and parent with boost status
      if (Math.abs(speedKmh - speed) > 0.5 || currentGear !== gear) {
        setSpeed(speedKmh)
        setGear(currentGear)
        onHudUpdate?.({ speed: speedKmh, gear: currentGear, boostActive })
      }
    })

    const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/bmw_m3.glb`)

    return (
      <mesh ref={physicsRef} castShadow>
        <group position={[-0.2, 0, 0]}>
          <primitive object={scene} scale={0.4} />
        </group>
        <ExhaustParticles 
          carSpeed={speed} 
          isReversing={isReversing.current}
          isBoosting={boostActive} // Pass boost state to particles
          position={[-0.2, 0, 0]}
        />
      </mesh>
    )
  }
)

Car.displayName = 'Car'
export default Car