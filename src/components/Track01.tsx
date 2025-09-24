import { useGLTF } from '@react-three/drei';
import ColliderBox from './ColliderBox';
import Ramp from './Ramp';
import { CoveredCar } from './CoveredCar'; 

export default function Track() {
  // useGLTF's scene object contains the loaded model
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/track01.glb`);

  return (
    <>
      {/* This renders the visible track model. It has no physics itself. */}
      <primitive object={scene} />

      {/* All the invisible walls (ColliderBoxes) go here */}
      {/* Example: Invisible wall for a tree */}
      <ColliderBox position={[-2.8, 0, 9.55]} rotation={[0, Math.PI / 4, 0]} />
      <ColliderBox position={[-4.15, 0, 11.9]} rotation={[0, Math.PI / 3, 0]} />
      {/* ... add all the other ColliderBox instances from the example ... */}

      {/* This renders the ramp, both visibly and with its own physics */}
      <Ramp />
        {/* 2. Place the covered car in your world! */}
      {/* Position it at X=10, Y=0.75, Z=-20 */}
      <CoveredCar position={[7.9, 0, -3]} />

      {/* You can add more with different positions and rotations */}
      
    </>
  );
}