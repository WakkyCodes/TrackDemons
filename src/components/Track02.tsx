// Track02.tsx
import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Group } from 'three'
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

export default function Track02({ onCheckpoint }: Track02Props) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}models/track02-draco.glb`)
  const { actions, mixer } = useAnimations(animations, group)

  useEffect(() => {
  if (!actions) {
    console.warn('No actions available')
    return
  }

  console.log('Available animations:', Object.keys(actions))

  const playedActions: string[] = []

  // Play movingcarAction at normal speed
  if (actions.movingcarAction) {
    const action = actions.movingcarAction
    action.reset()
    action.timeScale = 0.6 // Normal speed (1x)
    action.play()
    playedActions.push('movingcarAction')
    console.log('Playing movingcarAction at 1x speed')
  } else {
    console.warn('movingcarAction not found')
  }

  // Play movingcarAction2 at different speed
  if (actions.movingcarAction2) {
    const action = actions.movingcarAction2
    action.reset()
    action.timeScale = 0.7 // 1.5x faster (or 0.5 for half speed)
    action.play()
    playedActions.push('movingcarAction2')
    console.log('Playing movingcarAction2 at 1.5x speed')
  } else {
    console.warn('movingcarAction2 not found')
  }

  // Cleanup function
  return () => {
    playedActions.forEach(animName => {
      if (actions[animName]) {
        actions[animName].stop()
      }
    })
  }
}, [actions])

  // Update mixer on each frame for smooth animation
  useEffect(() => {
    if (!mixer) return

    const interval = setInterval(() => {
      mixer.update(0.01) // Update with delta time
    }, 10)

    return () => clearInterval(interval)
  }, [mixer])
  // Define your wall boxes here
  const wallBoxes: { 
    position: [number, number, number]; 
    scale: [number, number, number]; 
    rotation?: [number, number, number];  
  }[] = [
    
    /*{ position: [7, 0, -8.5], scale: [30, 1.5, 0.5] },
    { position: [37, 0, -8.5], scale: [30, 1.5, 0.5] },
    { position: [62, 0, -11.5], scale: [20, 1.5, 1], rotation: [0, Math.PI / 10, 0] },
    { position: [7, 0, -6], scale: [30, 1.5, 0.5] },
    { position: [37, 0, -6], scale: [30, 1.5, 0.5] },
    { position: [62, 0, -8.5], scale: [20, 1.5, 1], rotation: [0, Math.PI / 12, 0] },


    { position: [-14, 0, -35], scale: [1, 1.5, 49] },
  
    
    { position: [-11, 0, -32], scale: [1, 1.5, 37] },   // Tower collider
    */
    

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
    <group ref={group}>
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
        onCheckpoint={onCheckpoint}
      />
      
      <Checkpoint 
        position={[17.39, 0.5, -22.5]} 
        rotation={[0, Math.PI , 0]}
        checkpointNumber={2}
        onCheckpoint={onCheckpoint}
      />
      
      <Checkpoint 
        position={[-3.5, 0.5, -53.5]} 
        rotation={[0, -Math.PI / 2, 0]}
        checkpointNumber={1}
        onCheckpoint={onCheckpoint}
      />
    </group>
  )
}