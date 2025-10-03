// SimpleCheckpoint.tsx
import { useBox } from '@react-three/cannon';
import { useEffect, useState } from 'react';
import { Mesh } from 'three';

interface CheckpointProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  checkpointNumber: number;
  onCheckpoint?: (checkpointNumber: number) => void;
}

export default function SimpleCheckpoint({ 
  position, 
  rotation = [0, 0, 0], 
  checkpointNumber,
  onCheckpoint 
}: CheckpointProps) {
  const [triggered, setTriggered] = useState(false);
  const [ref] = useBox<Mesh>(() => ({
    mass: 0,
    position,
    rotation,
    args: [4, 3, 2], // Larger trigger zone
    isTrigger: true,
    sensor: true,
    onCollide: (e) => {
      if (!triggered && e.body) {
        setTriggered(true);
        onCheckpoint?.(checkpointNumber);
        console.log(`Checkpoint ${checkpointNumber} reached!`);
        
        // Visual feedback
        setTimeout(() => setTriggered(false), 2000);
      }
    },
  }));

  return (
    <group>
      {/* Invisible trigger */}
      <mesh ref={ref} visible={false} />
      
      {/* Simple visual indicator */}
      <group position={position} rotation={rotation}>
        {/* Pole */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
        
        {/* Flag */}
        <mesh position={[0.8, 2.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color={triggered ? "#4CAF50" : "#f44336"} />
        </mesh>
        
        {/* Base */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.2, 16]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>
    </group>
  );
}