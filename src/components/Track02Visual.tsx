// src/components/Track02Visual.tsx
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function Track02Visual() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track02.glb`);
  
  useEffect(() => {
    // Ensure the scene is properly configured for minimap
    scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = false;
        child.castShadow = false;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={1}
    />
  );
}