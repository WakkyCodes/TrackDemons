import { useGLTF } from "@react-three/drei"
import MenuCar from "./MenuCar"

export default function MapMenu() {
  const { scene } = useGLTF(
    `${import.meta.env.BASE_URL}models/mapmenu-draco.glb`
  )

  return (
    <>
      <primitive object={scene} />
      <MenuCar startPosition={[0, 0.5, 0]} />
    </>
  )
}
