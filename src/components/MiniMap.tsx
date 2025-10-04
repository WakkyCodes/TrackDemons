// src/components/MiniMap.tsx
import { useRef } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MiniMapProps {
  target: React.RefObject<THREE.Object3D | null>; // the car ref
}

export default function MiniMap({ target }: MiniMapProps) {
  const camRef = useRef<THREE.OrthographicCamera>(null!);

  useFrame(() => {
    if (!target.current || !camRef.current) return;

    const carPos = target.current.position;

    // Keep the camera directly above the car
    camRef.current.position.set(carPos.x, carPos.y + 50, carPos.z);
    camRef.current.lookAt(carPos.x, carPos.y, carPos.z);
  });

  return (
    <OrthographicCamera
      ref={camRef}
      makeDefault={false}
      zoom={20} // bigger = zoom in, smaller = zoom out
      near={0.1}
      far={200}
    />
  );
}
