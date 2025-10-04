import { useGLTF } from '@react-three/drei';
import ColliderBox from './ColliderBox';
import Ramp from './Ramp';
import { CoveredCar } from './CoveredCar'; 
import Checkpoint from './Checkpoint';

interface Track01Props {
  onCheckpoint?: (checkpointNumber: number) => void;
}

export default function Track01({ onCheckpoint }: Track01Props) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track01.glb`);

  return (
    <>
      {/* This renders the visible track model. It has no physics itself. */}
      <primitive object={scene} />

      {/* All the invisible walls (ColliderBoxes) go here */}
      <ColliderBox position={[-2.8, 0, 9.55]} rotation={[0, Math.PI / 4, 0]} />
      <ColliderBox position={[-4.15, 0, 11.9]} rotation={[0, Math.PI / 3, 0]} />
      {/* ... add all the other ColliderBox instances from the example ... */}

      {/* This renders the ramp, both visibly and with its own physics */}
      <Ramp />
      
      {/* Covered car */}
      <CoveredCar position={[7.9, 0, -3]} />

      {/* CHECKPOINTS */}
      {/* Checkpoint 1 - Near the starting area */}
      <Checkpoint 
        position={[10.5, 0.5, -4]} 
        rotation={[0, 0, 0]}
        checkpointNumber={1}
        onCheckpoint={onCheckpoint}
      />
      
      {/* Checkpoint 2 - After the first turn */}
      <Checkpoint 
        position={[0, 0.5, 14.3]} 
        rotation={[0, Math.PI / 1.47, 0]}
        checkpointNumber={2}
        onCheckpoint={onCheckpoint}
      />
      
      {/* Checkpoint 3 - Near the finish line */}
      <Checkpoint 
        position={[-9, 0.5, -2.8]} 
        rotation={[0, -Math.PI / 2, 0]}
        checkpointNumber={3}
        onCheckpoint={onCheckpoint}
      />
    </>
  );
}