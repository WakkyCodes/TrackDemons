// src/components/Track02Visual.tsx
import { useGLTF } from "@react-three/drei";

export default function Track02Visual() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track02.glb`);

  return (
    <primitive
      object={scene.clone()}
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
    />
  );
}
