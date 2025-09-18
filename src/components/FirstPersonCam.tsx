import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { Mesh } from 'three'

type FirstPersonCamProps = {
  target: React.RefObject<Mesh | null>
  enabled: boolean
}

export default function FirstPersonCam({ target, enabled }: FirstPersonCamProps) {
  const { camera } = useThree()
  const offset = useRef(new Vector3(0, 0.3, 0.5)) // Slightly above and in front of car center

  useFrame(() => {
    if (!enabled || !target.current) return

    const targetPos = target.current.position
    const targetRotation = target.current.quaternion

    // Calculate camera position relative to car
    const cameraOffset = offset.current.clone()
    cameraOffset.applyQuaternion(targetRotation)
    
    const desiredPos = new Vector3().addVectors(targetPos, cameraOffset)
    
    // Smooth camera movement
    camera.position.lerp(desiredPos, 0.2)

    // Look forward from the car's perspective
    const forward = new Vector3(0, 0, -1)
    forward.applyQuaternion(targetRotation)
    const lookAtPoint = new Vector3().addVectors(targetPos, forward.multiplyScalar(10))
    
    camera.lookAt(lookAtPoint)
  })

  return null
}