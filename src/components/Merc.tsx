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
  setControlsEnabled: (enabled: boolean) => void
}

interface MercProps {
  onHudUpdate?: (data: { speed: number; gear: string; boostActive?: boolean }) => void
  startPosition?: [number, number, number]
  disabled?: boolean
  startRotation?: [number, number, number]
  controlsEnabled?: boolean
}

const Merc = forwardRef<Mesh & CarHandle, MercProps>(
  ({ onHudUpdate, startPosition = [9, 9, -7], disabled = false, startRotation = [0, 0, 0], controlsEnabled = true }, ref) => {
    const [physicsRef, api] = useBox<Mesh>(() => ({
      mass: 2400, // Heavier than Subaru/BMW (G-Wagon is heavier)
      position: [startPosition[0], 0.5, startPosition[2]],
      rotation: startRotation,
      args: [2.0, 0.6, 4.8], // Slightly larger dimensions for G-Wagon
      linearDamping: 0.75,   // Slightly more damping (heavier feel)
      angularDamping: 0.75,
      material: {
        friction: 0.35,
        restitution: 0.1,    
      },
      angularFactor: [0, 1, 0],
      linearFactor: [1, 0, 1],
    }))

    const [speed, setSpeed] = useState(0)
    const [gear, setGear] = useState('N')
    const [isBraking, setIsBraking] = useState(false)
    const [boostActive, setBoostActive] = useState(false)

    const keys = useKeyboard()

    const velocity = useRef([0, 0, 0])
    const rotation = useRef([0, 0, 0, 1])

    const currentSpeed = useRef(0)
    const targetSpeed = useRef(0)
    const isReversing = useRef(false)
    const boostMultiplier = useRef(1)
    const boostTimeRemaining = useRef(0)

    // Boost activation function
    const activateBoost = useCallback((multiplier: number = 1.5, duration: number = 2) => {
      boostMultiplier.current = multiplier
      boostTimeRemaining.current = duration
      setBoostActive(true)
      
      onHudUpdate?.({ speed, gear, boostActive: true })
    }, [speed, gear, onHudUpdate])

    // Controls enabled/disabled
    const setControlsEnabled = useCallback((enabled: boolean) => {
      if (!enabled) {
        currentSpeed.current = 0
        targetSpeed.current = 0
        isReversing.current = false
        setIsBraking(false)
        setBoostActive(false)
        boostMultiplier.current = 1
        boostTimeRemaining.current = 0
        
        api.velocity.set(0, velocity.current[1], 0)
        api.angularVelocity.set(0, 0, 0)
        
        if (speed !== 0 || gear !== 'N') {
          setSpeed(0)
          setGear('N')
          onHudUpdate?.({ speed: 0, gear: 'N', boostActive: false })
        }
      }
    }, [api, onHudUpdate, speed, gear])

    useImperativeHandle(ref, () => {
      const mesh = physicsRef.current!
      return Object.assign(mesh, {
        activateBoost,
        getSpeed: () => speed,
        getBoostActive: () => boostActive,
        setControlsEnabled,
      })
    }, [physicsRef, speed, boostActive, activateBoost, setControlsEnabled])

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

    // Velocity limiting
    useEffect(() => {
      const interval = setInterval(() => {
        const [vx, vy, vz] = velocity.current
        const currentSpeed = Math.sqrt(vx*vx + vz*vz)
        
        const effectiveMaxSpeed = boostActive ? 22 * boostMultiplier.current : 22
        
        if (currentSpeed > effectiveMaxSpeed) {
          const factor = effectiveMaxSpeed / currentSpeed
          api.velocity.set(vx * factor, vy, vz * factor)
        }
      }, 100)
      
      return () => clearInterval(interval)
    }, [api, boostActive])

    useFrame((_, delta) => {
      if (!physicsRef.current) return

      if (!controlsEnabled || disabled) {
        if (currentSpeed.current !== 0 || targetSpeed.current !== 0) {
          currentSpeed.current = 0
          targetSpeed.current = 0
          isReversing.current = false
          setIsBraking(false)
          setBoostActive(false)
          boostMultiplier.current = 1
          boostTimeRemaining.current = 0
          
          api.velocity.set(0, velocity.current[1], 0)
          api.angularVelocity.set(0, 0, 0)
          
          if (speed !== 0 || gear !== 'N') {
            setSpeed(0)
            setGear('N')
            onHudUpdate?.({ speed: 0, gear: 'N', boostActive: false })
          }
        }
        return
      }

      // G-Wagon specs: slower acceleration, similar top speed
      const baseMaxSpeed = 14 // Slightly slower than Subaru (15)
      const baseMaxReverseSpeed = 7
      const maxSpeed = boostActive ? baseMaxSpeed * boostMultiplier.current : baseMaxSpeed
      const maxReverseSpeed = boostActive ? baseMaxReverseSpeed * boostMultiplier.current : baseMaxReverseSpeed
      
      const acceleration = 10      // Slower than Subaru (12) - heavier vehicle
      const deceleration = 7
      const turnSpeed = 2.8        // Slightly slower turning

      // Brake light logic
      const wasBraking = isBraking
      const nowBraking = keys.backward || 
                        (keys.forward && currentSpeed.current > 0) ||
                        (Math.abs(currentSpeed.current) > 0.5 && !keys.forward && !keys.backward)
      
      if (nowBraking !== wasBraking) {
        setIsBraking(nowBraking)
      }

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

      const effectiveAcceleration = boostActive ? acceleration * boostMultiplier.current : acceleration
      
      const speedDiff = targetSpeed.current - currentSpeed.current
      const accelerationRate = Math.abs(speedDiff) > 0.1 ? 
        (speedDiff > 0 ? effectiveAcceleration : deceleration) : deceleration
      
      currentSpeed.current += speedDiff * accelerationRate * delta
      currentSpeed.current = Math.max(-maxSpeed, Math.min(maxReverseSpeed, currentSpeed.current))

      const turnDirection = keys.left ? 1 : keys.right ? -1 : 0
      
      if (turnDirection !== 0 && Math.abs(currentSpeed.current) > 0.5) {
        const turnIntensity = Math.min(1, Math.abs(currentSpeed.current) / maxSpeed) * 0.65
        
        let effectiveTurnDirection = turnDirection
        
        if (isReversing.current) {
          effectiveTurnDirection = -turnDirection
        } else if (currentSpeed.current > 0) {
          effectiveTurnDirection = -turnDirection
        }

        const finalTurnSpeed = effectiveTurnDirection * turnSpeed * turnIntensity
        api.angularVelocity.set(0, finalTurnSpeed, 0)
      } else {
        api.angularVelocity.set(0, 0, 0)
      }

      // Apply movement
      if (Math.abs(currentSpeed.current) > 0.1) {
        const forwardVector = new Vector3(0, 0, -1)
        const carQuaternion = new Quaternion().fromArray(rotation.current)
        const worldDirection = forwardVector.applyQuaternion(carQuaternion)
        
        worldDirection.multiplyScalar(currentSpeed.current)
        
        const currentVel = new Vector3(velocity.current[0], velocity.current[1], velocity.current[2])
        const targetVel = new Vector3(worldDirection.x, 0, worldDirection.z)
        
        currentVel.lerp(targetVel, 4.5 * delta)
        api.velocity.set(currentVel.x, velocity.current[1], currentVel.z)
      } else {
        currentSpeed.current = 0
        const currentVel = new Vector3(velocity.current[0], velocity.current[1], velocity.current[2])
        currentVel.lerp(new Vector3(0, velocity.current[1], 0), 7 * delta)
        api.velocity.set(currentVel.x, currentVel.y, currentVel.z)
      }

      // Calculate HUD data
      const [vx, , vz] = velocity.current
      const speedMs = Math.sqrt(vx * vx + vz * vz)
      const speedKmh = Math.abs(speedMs * 3.6)

      let currentGear = 'N'
      
      if (speedKmh === 0) {
        currentGear = 'N'
      } else if (isReversing.current) {
        currentGear = 'R'
      } else {
        if (speedKmh < 12) currentGear = '1'
        else if (speedKmh < 24) currentGear = '2'
        else if (speedKmh < 32) currentGear = '3'
        else currentGear = '4'
      }

      if (Math.abs(speedKmh - speed) > 0.5 || currentGear !== gear) {
        setSpeed(speedKmh)
        setGear(currentGear)
        onHudUpdate?.({ speed: speedKmh, gear: currentGear, boostActive })
      }
    })

    const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/merc_g.glb`)

    return (
      <mesh ref={physicsRef} castShadow>
        <group position={[-1, 0, -1]} rotation={[0, Math.PI / 2, 0]}> {/* Adjust position if needed */}
          <primitive object={scene} scale={0.022} /> {/* Adjust scale based on your model */}
        </group>
        <ExhaustParticles 
          carSpeed={speed} 
          isReversing={isReversing.current}
          isBoosting={boostActive}
          position={[0, 0, 0]} // Adjust exhaust position based on your model
        />
      </mesh>
    )
  }
)

Merc.displayName = 'Merc'
export default Merc
