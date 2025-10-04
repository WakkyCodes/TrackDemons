// src/components/Track01.tsx
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import Ramp from './Ramp';
import { CoveredCar } from './CoveredCar';
import Checkpoint from './Checkpoint';
import ColliderWall from './ColliderWall';

interface Track01Props {
  onCheckpoint?: (checkpointNumber: number) => void;
}

export default function Track01({ onCheckpoint }: Track01Props) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track01.glb`);

  const bounds = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return {
      min: box.min,
      max: box.max,
      size: box.getSize(new THREE.Vector3()),
      center: box.getCenter(new THREE.Vector3()),
    };
  }, [scene]);

  return (
    <>
      {/* Track Model */}
      <primitive object={scene} />

      {/* === Physics Walls Around Track === */}
      <ColliderWall
        position={[bounds.center.x, bounds.min.y - 0.5, bounds.center.z]}
        args={[bounds.size.x, 1, bounds.size.z]}
        color="red"
      />
      <ColliderWall
        position={[bounds.center.x, bounds.max.y + 0.5, bounds.center.z]}
        args={[bounds.size.x, 1, bounds.size.z]}
        color="blue"
      />
      <ColliderWall
        position={[bounds.min.x - 0.5, bounds.center.y, bounds.center.z]}
        args={[1, bounds.size.y, bounds.size.z]}
        color="green"
      />
      <ColliderWall
        position={[bounds.max.x + 0.5, bounds.center.y, bounds.center.z]}
        args={[1, bounds.size.y, bounds.size.z]}
        color="green"
      />
      <ColliderWall
        position={[bounds.center.x, bounds.center.y, bounds.max.z + 0.5]}
        args={[bounds.size.x, bounds.size.y, 1]}
        color="yellow"
      />
      <ColliderWall
        position={[bounds.center.x, bounds.center.y, bounds.min.z - 0.5]}
        args={[bounds.size.x, bounds.size.y, 1]}
        color="yellow"
      />

      {/* Extra Track Elements */}
      <Ramp />
      <CoveredCar position={[7.9, 0, -3]} />

      {/* Checkpoints */}
      <Checkpoint
        position={[10.5, 0.5, -4]}
        rotation={[0, 0, 0]}
        checkpointNumber={1}
        onCheckpoint={onCheckpoint}
      />
      <Checkpoint
        position={[0, 0.5, 14.3]}
        rotation={[0, Math.PI / 1.47, 0]}
        checkpointNumber={2}
        onCheckpoint={onCheckpoint}
      />
      <Checkpoint
        position={[-9, 0.5, -2.8]}
        rotation={[0, -Math.PI / 2, 0]}
        checkpointNumber={3}
        onCheckpoint={onCheckpoint}
      />
    </>
  );
}
