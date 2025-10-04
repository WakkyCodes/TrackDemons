// src/components/MiniMapOverlay.tsx
import { Canvas } from "@react-three/fiber";
import MiniMap from "./MiniMap";
import { Object3D } from "three";
import { useRef, useEffect } from "react";
import Track01Visual from "./Track01Visual";
import Track02Visual from "./Track02Visual";
import * as THREE from "three";

interface MiniMapOverlayProps {
  target: React.RefObject<Object3D | null>;
  currentLevel: number;
}

export default function MiniMapOverlay({ target, currentLevel }: MiniMapOverlayProps) {
  const carMarkerRef = useRef<THREE.Mesh>(null);

  // sync minimap marker with car
  useEffect(() => {
    const id = setInterval(() => {
      if (target.current && carMarkerRef.current) {
        carMarkerRef.current.position.copy(target.current.position);
        carMarkerRef.current.rotation.copy(target.current.rotation);
      }
    }, 50);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        bottom: 20,
        width: 200,
        height: 200,
        border: "2px solid white",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      <Canvas orthographic>
        <ambientLight intensity={1} />
        <MiniMap target={target} />

        {/* render simplified track visuals */}
        {currentLevel === 1 && <Track01Visual />}
        {currentLevel === 2 && <Track02Visual />}

        {/* car marker */}
        <mesh ref={carMarkerRef} scale={[0.5, 0.5, 1]}>
          <coneGeometry args={[0.5, 1, 3]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </Canvas>
    </div>
  );
}
