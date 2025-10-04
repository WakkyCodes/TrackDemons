import { useGLTF } from '@react-three/drei';
import ColliderBox from './ColliderBox';

export default function Track02() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track02-draco.glb`);

  // Define your wall boxes here
  const wallBoxes: { position: [number, number, number]; scale: [number, number, number] }[] = [
    { position: [7, 1, -8.5], scale: [30, 2, 0.5] },
    { position: [37, 1, -8.5], scale: [30, 2, 0.5] }, // One long wall
    { position: [7, 1, -6], scale: [30, 2, 0.5] },
    { position: [37, 1, -6], scale: [30, 2, 0.5] },
    { position: [-15, 4, -26], scale: [1, 8, 5] },    // Tower collider
    { position: [60, 1, -10], scale: [20, 2, 1] },     // Example wall
    { position: [10, 1, 9], scale: [1, 2, 20] },      // Example wall
    // Add more as needed
  ];

  return (
    <>
      <primitive object={scene} />
      {wallBoxes.map((box, i) => (
        <ColliderBox key={i} {...box} />
      ))}
      <ColliderBox position={[0, 5, 0]} scale={[2, 2, 2]} />
    </>
  );
}