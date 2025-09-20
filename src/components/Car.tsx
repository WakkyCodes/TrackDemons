import { useBox } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Mesh, Quaternion, Vector3 } from 'three'
import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import useKeyboard from '../hooks/useKeyboard'

const Car = forwardRef<Mesh>((_, ref) => {
  // Create a separate mesh ref
  const meshRef = useRef<Mesh>(null)
  
  const [physicsRef, api] = useBox(() => ({
    mass: 1,
    position: [0, 0.5, 0],
    args: [1, 0.5, 2],
    linearDamping: 0.95,
    angularDamping: 0.95,
  }))

  // Forward the mesh ref to parent
  useImperativeHandle(ref, () => meshRef.current!, [])

  const keys = useKeyboard()

  const velocity = useRef([0, 0, 0])
  const rotation = useRef([0, 0, 0, 1]) // Quaternion [x, y, z, w]

  useEffect(() => {
    const unsubscribeVelocity = api.velocity.subscribe((v) => (velocity.current = v))
    const unsubscribeRotation = api.quaternion.subscribe((r) => (rotation.current = r))

    return () => {
      unsubscribeVelocity()
      unsubscribeRotation()
    }
  }, [api])

  useFrame(() => {

    if (!physicsRef.current) return
    
    const speed = 5
    const turnSpeed = 1.5

    const moveDirection = keys.forward ? 1 : keys.backward ? -1 : 0
    const turnDirection = keys.left ? 1 : keys.right ? -1 : 0

    // Set angular velocity for turning
    api.angularVelocity.set(0, turnDirection * turnSpeed, 0)

    // Calculate forward vector based on current rotation
    const forwardVector = new Vector3(0, 0, -moveDirection * speed)
    const carQuaternion = new Quaternion().fromArray(rotation.current)
    const worldDirection = forwardVector.applyQuaternion(carQuaternion)

    // Set velocity, preserving gravity
    api.velocity.set(worldDirection.x, velocity.current[1], worldDirection.z)
  })

  return (
    <mesh 
      ref={(mesh) => {
        meshRef.current = mesh
        if (physicsRef.current && mesh) {
          physicsRef.current = mesh
        }
      }} 
      castShadow
    >
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
})

Car.displayName = 'Car'

export default Car