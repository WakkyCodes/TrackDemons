// src/components/Track01Visual.tsx
import { useGLTF } from "@react-three/drei";

export default function Track01Visual() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track01.glb`);

  return (
    <primitive
      object={scene.clone()}
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
    />
  );
}
