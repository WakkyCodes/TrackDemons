import FollowCam from './FollowCam'
import FirstPersonCam from './FirstPersonCam'
import { Mesh } from 'three'

type CameraControllerProps = {
  target: React.RefObject<Mesh | null>
  isFirstPerson: boolean
}

export default function CameraController({ target, isFirstPerson }: CameraControllerProps) {
  return (
    <>
      <FollowCam target={target} enabled={!isFirstPerson} />
      <FirstPersonCam target={target} enabled={isFirstPerson} />
    </>
  )
}
