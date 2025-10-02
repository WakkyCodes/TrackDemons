import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Mesh, Object3D, Quaternion, Vector3 } from 'three'

type FirstPersonCamProps = {
  target: React.RefObject<Mesh | Object3D | null>
  enabled: boolean
}

export default function FirstPersonCam({ target, enabled }: FirstPersonCamProps) {
  const { camera } = useThree()

  // Offset relative to the car’s local space: a bit above and forward
<<<<<<< HEAD
  const localOffset = useMemo(() => new Vector3(0, 1.0, 0), [])
=======
  const localOffset = useMemo(() => new Vector3(0, 1, 4), [])
>>>>>>> origin/main
  const forwardDir = useMemo(() => new Vector3(0, 0, 1), [])

  const worldPos = useRef(new Vector3())
  const worldQuat = useRef(new Quaternion())
  const rotatedOffset = useRef(new Vector3())
  const tmp = useRef(new Vector3())
  const smoothLook = useRef(new Vector3())

  useFrame((_, delta) => {
    if (!enabled) return
    const t = target.current
    if (!t) return

    // Get car’s world transform
    t.getWorldPosition(worldPos.current)
    t.getWorldQuaternion(worldQuat.current)

    rotatedOffset.current.copy(localOffset).applyQuaternion(worldQuat.current)

    const desiredPos = tmp.current.addVectors(worldPos.current, rotatedOffset.current)

    const lerp = 1 - Math.pow(0.002, delta)
    camera.position.lerp(desiredPos, lerp)

    const ahead = tmp.current.copy(forwardDir).applyQuaternion(worldQuat.current).multiplyScalar(15).add(worldPos.current)

    smoothLook.current.lerp(ahead, lerp)
    camera.lookAt(smoothLook.current)
  })

  return null
}
