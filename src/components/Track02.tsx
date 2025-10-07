import { useGLTF } from '@react-three/drei';
import ColliderBox from './ColliderBox';

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

export default function Track02() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track02-draco.glb`);

  // Define your wall boxes here
  const wallBoxes: { 
    position: [number, number, number]; 
    scale: [number, number, number] 
    rotation?: [number, number, number];  
  }[] = [
    { position: [7, 1, -8.5], scale: [30, 2, 0.5] },
    { position: [37, 1, -8.5], scale: [30, 2, 0.5] },
    { position: [62, 1, -11.5], scale: [20, 2, 1], rotation: [0, Math.PI / 10, 0] },  // One long wall
    { position: [7, 1, -6], scale: [30, 2, 0.5] },
    { position: [37, 1, -6], scale: [30, 2, 0.5] },
    { position: [62, 1, -8.5], scale: [20, 2, 1], rotation: [0, Math.PI / 12, 0] },


    { position: [-14, 4, -35], scale: [1, 8, 49] },
    
    
    { position: [-11, 4, -32], scale: [1, 8, 37] },   // Tower collider
    
    { position: [10, 1, 9], scale: [1, 2, 20] },      // Example wall
    // Add more as needed
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
      

      <ColliderBox position={[0, 5, 0]} scale={[2, 2, 2]} />
    </>
  );
}