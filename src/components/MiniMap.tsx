// src/components/MiniMap.tsx
import { useRef } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MiniMapProps {
  target: React.RefObject<THREE.Object3D | null>;
}

export default function MiniMap({ target }: MiniMapProps) {
  const camRef = useRef<THREE.OrthographicCamera>(null!);

  useFrame(() => {
    if (!target.current || !camRef.current) return;

    const carPos = target.current.position;

    // Keep the camera directly above the car
    camRef.current.position.set(carPos.x, 50, carPos.z);
    camRef.current.lookAt(carPos.x, 0, carPos.z);
    
    // Update camera matrix
    camRef.current.updateMatrixWorld();
  });

  return (
    <OrthographicCamera
      ref={camRef}
      makeDefault={false}
      zoom={25} // Adjusted zoom for better view
      near={0.1}
      far={1000}
      position={[0, 50, 0]}
    />
  );
}