import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { Mesh } from 'three'

type FollowCameraProps = {
  target: React.RefObject<Mesh | null>
  enabled: boolean  // Add this line
}

export default function FollowCam({ target, enabled }: FollowCameraProps) {
  const { camera } = useThree()
  const camOffset = useRef(new Vector3(0, 3, -6))

  useFrame(() => {
    if (!enabled || !target.current) return

    const targetPos = target.current.position

    // Desired camera position behind the car
    const desiredPos = new Vector3(
      targetPos.x + camOffset.current.x,
      targetPos.y + camOffset.current.y,
      targetPos.z + camOffset.current.z
    )

    // Smooth camera movement
    camera.position.lerp(desiredPos, 0.1)

    // Make the camera look at the car
    camera.lookAt(targetPos)
  })

  return null
}