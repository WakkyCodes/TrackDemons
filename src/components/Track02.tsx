// New Track02.tsx
import { useGLTF } from '@react-three/drei';
import ColliderBox from './ColliderBox';

export default function Track02() {
  // 1. Load your single, complete map file
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track02.glb`);

  return (
    <>
      {/* 2. Render the entire map with one line */}
      <primitive object={scene} />

      {/* 3. Add only the necessary invisible colliders */}
      {/* You still need these for physics! */}
      <ColliderBox position={[-10, 1, -26]} scale={[30, 2, 0.5]} /> {/* One long wall */}
      <ColliderBox position={[-15, 4, -26]} scale={[1, 8, 5]} /> {/* Tower collider */}
    </>
  );
}