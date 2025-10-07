// Track02.tsx
import { useGLTF } from '@react-three/drei'
import ColliderBox from './ColliderBox'
import Checkpoint from './Checkpoint'

const createCurvedWall = (
  centerX: number, 
  centerZ: number, 
  radius: number, 
  segments: number,
  startAngle: number,
  endAngle: number,
  height: number = 2,
  thickness: number = 0.5
) => {
  const boxes = [];
  const totalAngle = endAngle - startAngle;
  const arcLength = radius * totalAngle; // Total curve length
  const boxWidth = arcLength / segments; // Width needed to fill the arc
  
  for (let i = 0; i < segments; i++) {
    const angle = startAngle + (i * totalAngle / segments);
    const x = centerX + Math.cos(angle) * radius;
    const z = centerZ + Math.sin(angle) * radius;
    
    boxes.push({
      position: [x, 1, z] as [number, number, number],
      scale: [boxWidth * 1.1, height, thickness] as [number, number, number], // 1.1 for slight overlap
      rotation: [0, angle + Math.PI / 2, 0] as [number, number, number]
    });
  }
  return boxes;
};

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
    { position: [7, 0, -8.5], scale: [30, 1.5, 0.5] },
    { position: [37, 0, -8.5], scale: [30, 1.5, 0.5] },
    { position: [62, 0, -11.5], scale: [20, 1.5, 1], rotation: [0, Math.PI / 10, 0] },
    { position: [7, 0, -6], scale: [30, 1.5, 0.5] },
    { position: [37, 0, -6], scale: [30, 1.5, 0.5] },
    { position: [62, 0, -8.5], scale: [20, 1.5, 1], rotation: [0, Math.PI / 12, 0] },


    { position: [-14, 0, -35], scale: [1, 1.5, 49] },
  
    
    { position: [-11, 0, -32], scale: [1, 1.5, 37] },   // Tower collider
    


  ];
const curvedWall1 = createCurvedWall(
  5,           // centerX
  -62,          // centerZ
  15,           // radius
  100,           // segments (more = smoother)
  0,            // start angle
  Math.PI/4,      // end angle (180°)
  2,            // height
  0.5           // thickness
);
  

  return (
    <>
      <primitive object={scene} />

      {/* Render straight walls */}
      {wallBoxes.map((box, i) => (
        <ColliderBox key={i} {...box} />
      ))}
      {/* Render curved walls */}
      {curvedWall1.map((box, i) => (
        <ColliderBox key={`curve1-${i}`} {...box} />
      ))}
      
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