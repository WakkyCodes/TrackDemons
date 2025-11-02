// src/components/Track01Visual.tsx
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function Track01Visual() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track01.glb`);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = false;
        child.castShadow = false;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1} />;
}
