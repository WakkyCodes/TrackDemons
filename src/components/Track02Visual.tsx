// src/components/Track02Visual.tsx
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function Track02Visual() {
  // Load the GLTF model
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track02-draco.glb`);

  useEffect(() => {
    // Configure the scene for the minimap (disable shadows)
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
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
