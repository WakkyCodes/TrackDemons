import { useBox } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Mesh, Quaternion, Vector3 } from 'three'
import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import useKeyboard from '../hooks/useKeyboard'

const Car = forwardRef<Mesh>((_, ref) => {
  const [physicsRef, api] = useBox<Mesh>(() => ({
    mass: 1,
    position: [9, 2.5, -7],//z towards neg is backward positive is forward 
    //x towards pos is left neg is right
    args: [1, 10.5, 2],
    linearDamping: 0.95,
    angularDamping: 0.95,
  }))

  // Forward Cannon's physics ref to parent
  useImperativeHandle(ref, () => physicsRef.current!, [physicsRef])

  const keys = useKeyboard()

  const velocity = useRef([0, 0, 0])
  const rotation = useRef([0, 0, 0, 1]) // Quaternion [x, y, z, w]

  useEffect(() => {
    const unsubV = api.velocity.subscribe((v) => (velocity.current = v))
    const unsubR = api.quaternion.subscribe((r) => (rotation.current = r))
    return () => {
      unsubV()
      unsubR()
    }
  }, [api])

  useFrame(() => {
    if (!physicsRef.current) return

    const speed = 5
    const turnSpeed = 1.5

    const moveDirection = keys.forward ? 1 : keys.backward ? -1 : 0
    const turnDirection = keys.left ? 1 : keys.right ? -1 : 0

    if (turnDirection !== 0) {
      api.angularVelocity.set(0, turnDirection * turnSpeed, 0)
    }

    if (moveDirection !== 0) {
      const forwardVector = new Vector3(0, 0, -moveDirection * speed)
      const carQuaternion = new Quaternion().fromArray(rotation.current)
      const worldDirection = forwardVector.applyQuaternion(carQuaternion)

      api.velocity.set(worldDirection.x, velocity.current[1], worldDirection.z)
    }
  })

  return (
    <mesh ref={physicsRef} castShadow>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
})

Car.displayName = 'Car'

export default Car
