import { useBox } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Mesh, Quaternion, Vector3 } from 'three'
import {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react'
import useKeyboard from '../hooks/useKeyboard'
import { ExhaustParticles } from './ExhaustParticles' 
import { useGLTF } from '@react-three/drei'

interface CarProps {
  onHudUpdate?: (data: { speed: number; gear: string; boostActive?: boolean }) => void
  startPosition?: [number, number, number]
  disabled?: boolean
  startRotation?: [number, number, number]
  controlsEnabled?: boolean // Add this prop
}

const Car = forwardRef<Mesh, CarProps>(
  ({ onHudUpdate, startPosition = [9, 9, -7], disabled = false, startRotation = [0, 0, 0], controlsEnabled = true  }, ref) => {
    const [physicsRef, api] = useBox<Mesh>(() => ({
      mass: 1200,
      position: [startPosition[0], 0.26, startPosition[2]],
      rotation: startRotation,
      args: [1.8, 0.5, 4.5],
      linearDamping: 0.8,
      angularDamping: 0.8,
      material: {
        friction: 0.3,
        restitution: 0.1,
      },
      angularFactor: [0, 1, 0],
      linearFactor: [1, 0, 1],
    }))

    useImperativeHandle(ref, () => physicsRef.current!, [physicsRef])

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

    // Add this function to trigger boost from outside
    const activateBoost = useCallback((multiplier: number = 1.5, duration: number = 2) => {
      boostMultiplier.current = multiplier
      boostTimeRemaining.current = duration
      setBoostActive(true)
      
      // Update HUD with boost status
      onHudUpdate?.({ speed, gear, boostActive: true })
    }, [onHudUpdate, speed, gear])

    // Add method to enable/disable controls
    const setControlsEnabled = useCallback((enabled: boolean) => {
      // Reset car state when controls are disabled
      if (!enabled) {
        currentSpeed.current = 0
        targetSpeed.current = 0
        isReversing.current = false
        setIsBraking(false)
        setBoostActive(false)
        boostMultiplier.current = 1
        boostTimeRemaining.current = 0
        
        // Stop the car physically
        api.velocity.set(0, velocity.current[1], 0)
        api.angularVelocity.set(0, 0, 0)
        
        // Update HUD
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
        setControlsEnabled, // Expose the controls enabled method
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

    useEffect(() => {
      const interval = setInterval(() => {
        const [vx, vy, vz] = velocity.current
        const currentSpeed = Math.sqrt(vx*vx + vz*vz)
        
        // Adjust max speed based on boost
        const effectiveMaxSpeed = boostActive ? 20 * boostMultiplier.current : 20
        
        if (currentSpeed > effectiveMaxSpeed) {
          const factor = effectiveMaxSpeed / currentSpeed
          api.velocity.set(vx * factor, vy, vz * factor)
        }
      }, 100)
      
      return () => clearInterval(interval)
    }, [api, boostActive])

    useFrame((_, delta) => {
      if (!physicsRef.current) return

      // Check if controls are disabled (game not started or countdown active)
      if (!controlsEnabled || disabled) {
        // Only reset if we haven't already
        if (currentSpeed.current !== 0 || targetSpeed.current !== 0) {
          currentSpeed.current = 0
          targetSpeed.current = 0
          isReversing.current = false
          setIsBraking(false)
          setBoostActive(false)
          boostMultiplier.current = 1
          boostTimeRemaining.current = 0
          
          // Stop the car physically
          api.velocity.set(0, velocity.current[1], 0)
          api.angularVelocity.set(0, 0, 0)
          
          // Update HUD if needed
          if (speed !== 0 || gear !== 'N') {
            setSpeed(0)
            setGear('N')
            onHudUpdate?.({ speed: 0, gear: 'N', boostActive: false })
          }
        }
        return
      }

      // Adjust max speeds based on boost
      const baseMaxSpeed = 15
      const baseMaxReverseSpeed = 8
      const maxSpeed = boostActive ? baseMaxSpeed * boostMultiplier.current : baseMaxSpeed
      const maxReverseSpeed = boostActive ? baseMaxReverseSpeed * boostMultiplier.current : baseMaxReverseSpeed
      
      const acceleration = 12
      const deceleration = 8
      const turnSpeed = 3

      // BRAKE LIGHT LOGIC
      const wasBraking = isBraking
      const nowBraking = keys.backward || 
                        (keys.forward && currentSpeed.current > 0) ||
                        (Math.abs(currentSpeed.current) > 0.5 && !keys.forward && !keys.backward)
      
      if (nowBraking !== wasBraking) {
        setIsBraking(nowBraking)
      }

      // Speed control with boost consideration
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
        const turnIntensity = Math.min(1, Math.abs(currentSpeed.current) / maxSpeed) * 0.7
        
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
        
        currentVel.lerp(targetVel, 5 * delta)
        api.velocity.set(currentVel.x, velocity.current[1], currentVel.z)
      } else {
        currentSpeed.current = 0
        const currentVel = new Vector3(velocity.current[0], velocity.current[1], velocity.current[2])
        currentVel.lerp(new Vector3(0, velocity.current[1], 0), 8 * delta)
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
        if (speedKmh < 10) currentGear = '1'
        else if (speedKmh < 22) currentGear = '2'
        else if (speedKmh < 30) currentGear = '3'
        else currentGear = '4'
      }

      // Update state and parent with boost status
      if (Math.abs(speedKmh - speed) > 0.5 || currentGear !== gear) {
        setSpeed(speedKmh)
        setGear(currentGear)
        onHudUpdate?.({ speed: speedKmh, gear: currentGear, boostActive })
      }
    })

    const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/car22.glb`)

    return (
      <mesh ref={physicsRef} castShadow>
        <group position={[-0.54, 0, 0]}>
          <primitive object={scene} scale={35} />
        </group>
        <ExhaustParticles 
          carSpeed={speed} 
          isReversing={isReversing.current}
          isBoosting={boostActive}
          position={[-0.4, 0, 0]} 
        />
      </mesh>
    )
  }
)

Car.displayName = 'Car'
export default Car