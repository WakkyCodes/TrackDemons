import { useBox } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Mesh, Quaternion, Vector3 } from 'three'
import { forwardRef, useEffect, useRef, useImperativeHandle, useState } from 'react'
import useKeyboard from '../hooks/useKeyboard'
import { useGLTF } from '@react-three/drei'
import Speedometer from './Speedometer'
import CarHUD from './CarHud'
const Car = forwardRef<Mesh>((_, ref) => {
  const [physicsRef, api] = useBox<Mesh>(() => ({
    mass: 250, 
    position: [0, 2, 0], 
    args: [1, 0.5, 2],
    linearDamping: 0.4, 
    angularDamping: 0.4, 
    material: {
      friction: 0.5, 
      restitution: 0.1, 
    },
    angularFactor: [0, 1, 0],
  }))

  useImperativeHandle(ref, () => physicsRef.current!, [physicsRef])
  const [carVelocity, setCarVelocity] = useState([0, 0, 0])

   useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      setCarVelocity(v)
    })
    return unsubscribe
  }, [api])

  const keys = useKeyboard()

  const velocity = useRef([0, 0, 0])
  const rotation = useRef([0, 0, 0, 1])
  const position = useRef([0, 0, 0])
  
  const currentSpeed = useRef(0)
  const targetSpeed = useRef(0)

  useEffect(() => {
    const unsubV = api.velocity.subscribe((v) => (velocity.current = v))
    const unsubR = api.quaternion.subscribe((r) => (rotation.current = r))
    const unsubP = api.position.subscribe((p) => (position.current = p))
    return () => {
      unsubV()
      unsubR()
      unsubP()
    }
  }, [api])

  useFrame((_, delta) => {
    if (!physicsRef.current) return

    const maxSpeed = 50
    const acceleration = 7 
    const deceleration = 3 
    const turnSpeed = 4

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

    const turnDirection = keys.left ? 1 : keys.right ? -1 : 0

    if (turnDirection === 0) 
      {
      api.angularVelocity.set(0, 0, 0)
    } 
    else 
      {
  
      const turnIntensity = Math.min(1, Math.abs(currentSpeed.current) / maxSpeed)
      
      let effectiveTurnDirection = turnDirection
      
      if (currentSpeed.current > 0) {
        effectiveTurnDirection = -turnDirection
      }
      
      const finalTurnSpeed = effectiveTurnDirection * turnSpeed * turnIntensity
      
      api.angularVelocity.set(0, finalTurnSpeed, 0)
    }

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
  })

  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/car.glb`)
  
return (
    <>
      <mesh ref={physicsRef} castShadow> 
        <primitive object={scene} scale={0.01} />
      </mesh>
      
      {/* Speedometer attached to car */}
      <Speedometer 
        carApi={{ velocity: carVelocity }} 
        position={[0, 1.5, 0.5]} 
      />
      
      {/* Or use the HUD version */}
      <CarHUD 
        carApi={{ velocity: carVelocity }}
        position={[0, 1.2, 0.5]}
        showGear={true}
      />
    </>
  )
})

Car.displayName = 'Car'

export default Car