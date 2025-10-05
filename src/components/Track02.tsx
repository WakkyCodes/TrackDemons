// Track02.tsx
import { useGLTF } from '@react-three/drei'
import ColliderBox from './ColliderBox'
import Checkpoint from './Checkpoint'

interface Track02Props {
  onCheckpoint?: (checkpointNumber: number) => void
  activeCheckpoint?: number | null
}

export default function Track02({ onCheckpoint, activeCheckpoint }: Track02Props) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track02-draco.glb`)

  // Define your wall boxes here
  const wallBoxes: { 
    position: [number, number, number]; 
    scale: [number, number, number]; 
    rotation?: [number, number, number];  
  }[] = [
    { position: [7, 1, -8.5], scale: [30, 2, 0.5] },
    { position: [37, 1, -8.5], scale: [30, 2, 0.5] },
    { position: [62, 1, -11.5], scale: [20, 2, 1], rotation: [0, Math.PI / 10, 0] },
    { position: [7, 1, -6], scale: [30, 2, 0.5] },
    { position: [37, 1, -6], scale: [30, 2, 0.5] },
    { position: [62, 1, -8.5], scale: [20, 2, 1], rotation: [0, Math.PI / 12, 0] },

    { position: [-15, 4, -26], scale: [1, 8, 5] },   // tower collider
    { position: [10, 1, 9], scale: [1, 2, 20] },     // wall example
  ]

  return (
    <>
      <primitive object={scene} />

      {/* Walls */}
      {wallBoxes.map((box, i) => (
        <ColliderBox key={i} {...box} />
      ))}

      <ColliderBox position={[0, 5, 0]} scale={[2, 2, 2]} />

      {/* Checkpoints - all checkpoints are always visible and functional */}
      <Checkpoint 
        position={[7, 0.5, -7.2]} 
        rotation={[0, Math.PI/2, 0]}
        checkpointNumber={3}
        onCheckpoint={activeCheckpoint === 3 ? onCheckpoint : undefined}
      />
      
      <Checkpoint 
        position={[17.39, 0.5, -22.5]} 
        rotation={[0, Math.PI , 0]}
        checkpointNumber={2}
        onCheckpoint={activeCheckpoint === 2 ? onCheckpoint : undefined}
      />
      
      <Checkpoint 
        position={[-3.5, 0.5, -53.5]} 
        rotation={[0, -Math.PI / 2, 0]}
        checkpointNumber={1}
        onCheckpoint={activeCheckpoint === 1 ? onCheckpoint : undefined}
      />
    </>
  )
}