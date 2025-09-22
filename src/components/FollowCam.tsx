import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { Mesh } from 'three'

type FollowCameraProps = {
  target: React.RefObject<Mesh | null>
  enabled: boolean
}

export default function FollowCam({ target, enabled }: FollowCameraProps) {
  const { camera } = useThree()
  const camOffset = useRef(new Vector3(0, 5, -10)) // Increased height and distance for better view
  const currentLookAt = useRef(new Vector3())

  useFrame((_, delta) => {
    if (!enabled || !target.current) return

    const targetPos = target.current.position

    // Desired camera position behind the car
    const desiredPos = new Vector3()
    desiredPos.copy(targetPos)
    
    // Apply offset relative to car's rotation
    const carRotation = target.current.quaternion
    camOffset.current.applyQuaternion(carRotation)
    desiredPos.add(camOffset.current)
    camOffset.current.applyQuaternion(carRotation.invert()) // Reset offset

    // Smooth camera movement with delta time for consistent speed
    camera.position.lerp(desiredPos, 5 * delta)

    // Smooth look-at target
    const desiredLookAt = new Vector3(targetPos.x, targetPos.y + 2, targetPos.z) // Look slightly above car
    currentLookAt.current.lerp(desiredLookAt, 5 * delta)
    camera.lookAt(currentLookAt.current)
  })

  return null
}