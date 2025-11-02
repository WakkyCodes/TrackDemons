//src/components/MiniMap.tsx
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

    // Keep camera above car, looking straight down
    camRef.current.position.set(carPos.x, 50, carPos.z);
    camRef.current.rotation.set(-Math.PI / 2, 0, 0);

    camRef.current.updateMatrixWorld();
  });

  return (
    <OrthographicCamera
      ref={camRef}
      makeDefault={true} // ✅ set to true so this camera is actually used
      zoom={25}
      near={0.1}
      far={1000}
      position={[0, 50, 0]}
    />
  );
}
