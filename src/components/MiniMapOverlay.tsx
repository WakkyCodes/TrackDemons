// src/components/MiniMapOverlay.tsx
import { Canvas, useFrame } from "@react-three/fiber";
import MiniMap from "./MiniMap";
import { Object3D } from "three";
import { useRef } from "react";
import Track01Visual from "./Track01Visual";
import Track02Visual from "./Track02Visual";
import * as THREE from "three";

interface MiniMapOverlayProps {
  target: React.RefObject<Object3D | null>;
  currentLevel: number;
  isFirstPerson?: boolean;
}

function CarMarkerSync({ target }: { target: React.RefObject<Object3D | null> }) {
  const carMarkerRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!target.current || !carMarkerRef.current) return;

    // Sync position
    carMarkerRef.current.position.copy(target.current.position);

    // Sync rotation (only Y-axis)
    const euler = new THREE.Euler();
    euler.setFromQuaternion(target.current.quaternion);
    carMarkerRef.current.rotation.set(0, euler.y, 0);
  });

  return (
    <mesh ref={carMarkerRef} position={[0, 0.5, 0]}>
      <coneGeometry args={[0.3, 1, 3]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

function TrackVisual({ currentLevel }: { currentLevel: number }) {
  return (
    <>
      {currentLevel === 1 && <Track01Visual />}
      {currentLevel === 2 && <Track02Visual />}
    </>
  );
}

export default function MiniMapOverlay({
  target,
  currentLevel,
  isFirstPerson = false,
}: MiniMapOverlayProps) {
  const overlayStyle = {
    position: "absolute" as const,
    width: 200,
    height: 200,
    border: "2px solid white",
    borderRadius: "10px",
    overflow: "hidden" as const,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1000,
    ...(isFirstPerson ? { top: 20, left: 20 } : { bottom: 20, left: 20 }),
  };

  return (
    <div style={overlayStyle}>
      <Canvas
        orthographic
        camera={{
          position: [0, 50, 0],
          zoom: 25,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.8} />
        
        {/* MiniMap camera */}
        <MiniMap target={target} />

        {/* Render current track */}
        <TrackVisual currentLevel={currentLevel} />

        {/* Car marker */}
        <CarMarkerSync target={target} />

        {/* Grid for reference */}
        <gridHelper
          args={[50, 50, 0x444444, 0x222222]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Canvas>
    </div>
  );
}