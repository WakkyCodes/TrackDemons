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
  isFirstPerson?: boolean;
}

export default function MiniMapOverlay({ target, currentLevel, isFirstPerson = false }: MiniMapOverlayProps) {
  const carMarkerRef = useRef<THREE.Mesh>(null);

  // Sync minimap marker with car - using useEffect instead of useFrame
  useEffect(() => {
    if (!target.current) return;

    const updateCarMarker = () => {
      if (target.current && carMarkerRef.current) {
        // Update position
        carMarkerRef.current.position.copy(target.current.position);
        
        // Update rotation (only Y axis for arrow direction)
        const euler = new THREE.Euler();
        euler.setFromQuaternion(target.current.quaternion);
        carMarkerRef.current.rotation.set(0, euler.y, 0);
      }
    };

    // Update more frequently for smooth movement
    const interval = setInterval(updateCarMarker, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [target]);

  const overlayStyle = {
    position: "absolute" as const,
    width: 200,
    height: 200,
    border: "2px solid white",
    borderRadius: "10px",
    overflow: "hidden" as const,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    // Position based on camera mode
    ...(isFirstPerson 
      ? { top: 20, left: 20 } // Top-left for first person
      : { bottom: 20, left: 20 } // Bottom-left for third person
    )
  };

  return (
    <div style={overlayStyle}>
      <Canvas
        orthographic
        camera={{
          position: [0, 50, 0],
          zoom: 25,
          near: 0.1,
          far: 1000
        }}
      >
        <ambientLight intensity={0.8} />
        
        {/* MiniMap camera controller */}
        <MiniMap target={target} />

        {/* Render simplified track visuals */}
        {currentLevel === 1 && <Track01Visual />}
        {currentLevel === 2 && <Track02Visual />}

        {/* Car marker - using a simple arrow */}
        <mesh ref={carMarkerRef}>
          <coneGeometry args={[0.3, 1, 3]} />
          <meshBasicMaterial color="red" />
        </mesh>

        {/* Add a grid for better orientation */}
        <gridHelper args={[50, 50, 0x444444, 0x222222]} rotation={[-Math.PI / 2, 0, 0]} />
      </Canvas>
    </div>
  );
}