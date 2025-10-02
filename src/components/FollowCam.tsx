import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Mesh, Object3D, Quaternion, Vector3 } from 'three'

type FollowCameraProps = {
  target: React.RefObject<Mesh | Object3D | null>
  enabled: boolean
}

export default function FollowCam({ target, enabled }: FollowCameraProps) {
  const { camera } = useThree()

  // Base boom offset: up and behind the car in its local space
  const baseOffset = useMemo(() => new Vector3(0, 2, -5), [])
  const tmpPos = useRef(new Vector3())
  const tmpLook = useRef(new Vector3())
  const worldPos = useRef(new Vector3())
  const worldQuat = useRef(new Quaternion())
  const rotatedOffset = useRef(new Vector3())
  const smoothLook = useRef(new Vector3())

  useFrame((_, delta) => {
    if (!enabled) return
    const t = target.current
    if (!t) return

    // Get car's world transform safely
    t.getWorldPosition(worldPos.current)
    t.getWorldQuaternion(worldQuat.current)

    // Rotate the local offset by the car's orientation (without mutating the base offset)
    rotatedOffset.current.copy(baseOffset).applyQuaternion(worldQuat.current)

    // Desired camera position: car world pos + rotated offset
    const desiredPos = tmpPos.current.addVectors(worldPos.current, rotatedOffset.current)

    // Frame-rate independent smoothing (higher = snappier)
    const lerp = 1 - Math.pow(0.001, delta)

    camera.position.lerp(desiredPos, lerp)

    // Look slightly above the car’s center for a steady horizon
    const desiredLook = tmpLook.current.set(
      worldPos.current.x,
      worldPos.current.y + 1.6,
      worldPos.current.z
    )
    smoothLook.current.lerp(desiredLook, lerp)
    camera.lookAt(smoothLook.current)
  })

  return null
}
