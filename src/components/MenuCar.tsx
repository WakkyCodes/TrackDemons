import { forwardRef, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh, Quaternion, Vector3 } from "three"
import { useBox } from "@react-three/cannon"
import { useGLTF } from "@react-three/drei"

interface MenuCarProps {
  startPosition?: [number, number, number]
}

const MenuCar = forwardRef<Mesh, MenuCarProps>(
  ({ startPosition = [0, 0.5, 0] }, ref) => {
    // Static-ish physics body to sit on ground
    const [physicsRef, api] = useBox<Mesh>(() => ({
      mass: 250, // can be non-zero so physics applies
      position: startPosition,
      args: [1, 0.5, 2],
      linearDamping: 0.4,
      angularDamping: 0.4,
      angularFactor: [0, 1, 0], // only rotate on Y
    }))

    if (ref) {
      // @ts-ignore
      ref.current = physicsRef.current
    }

    const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/car.glb`)

    const currentSpeed = useRef(10) // constant forward speed
    const turnSpeed = 2              // simulate holding "D" for right turn

    const fixedY = startPosition[1] // e.g., 0.5
    useFrame(() => {
      if (!physicsRef.current) return

      // Simulate turning right constantly
      api.angularVelocity.set(0, turnSpeed, 0)

      // Move forward
      const forwardVector = new Vector3(0, 0, -1)
      const carQuaternion = new Quaternion()
      api.quaternion.subscribe((q) => {
        carQuaternion.set(q[0], q[1], q[2], q[3])
      })()
      const worldDirection = forwardVector.applyQuaternion(carQuaternion)
      worldDirection.multiplyScalar(currentSpeed.current / 60) // adjust speed scale

      api.velocity.set(worldDirection.x, 0, worldDirection.z)
      
      api.position.subscribe((pos) => {
      api.position.set(pos[0], fixedY, pos[2])
      })
    })

    return (
      <mesh ref={physicsRef} castShadow>
        <primitive object={scene} scale={0.01} />
      </mesh>
    )
  }
)

MenuCar.displayName = "MenuCar"
export default MenuCar
