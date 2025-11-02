// Track01.tsx
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react';
import ColliderBox from './ColliderBox'
import ColliderWall from './ColliderWall';
import Ramp from './Ramp'
import {BufferGeometry, Texture } from 'three'
import * as THREE from 'three';
import { CoveredCar } from './CoveredCar'
import Checkpoint from './Checkpoint'

interface Track01Props {
  onCheckpoint?: (checkpointNumber: number) => void;
  geometry?: BufferGeometry
  colorMap?: Texture
  showCheckpoints?: boolean; 
}

export default function Track01({ onCheckpoint , showCheckpoints = true }: Track01Props) {
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
      {/* This renders the visible track model. It has no physics itself. */}
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
        color="green"
      />
      <ColliderWall
        position={[bounds.center.x, bounds.center.y, bounds.min.z - 0.5]}
        args={[bounds.size.x, bounds.size.y, 1]}
        color="green"
      />

      {/* All the invisible walls (ColliderBoxes) go here */}
      
      {/* <ColliderBox position={[-2.8, 0, 9.55]} rotation={[0, Math.PI / 4, 0]} />
      <ColliderBox position={[-4.15, 0, 11.9]} rotation={[0, Math.PI / 3, 0]} /> */}

      {/*the three threes in the middle */}
      <ColliderBox position={[-2.8, 0, 9.55]} scale={[1.5, 6,1]} rotation={[0, Math.PI / 4, 0]} visible={true} />
      <ColliderBox position={[-4.15, 0, 11.9]} scale={[1.5, 6,1]} rotation={[0, Math.PI / 3, 0]} visible={true} />
      <ColliderBox position={[-5.5, 0, 10.6]} scale={[1.4, 6,1]} rotation={[0, Math.PI / 3, 0]}  visible={true} />
      {/* This renders the ramp, both visibly and with its own physics */}
      <Ramp />
      
      {/* Covered car */}
       <CoveredCar position={[7.9, 0, -3]} />
     

      {/* CHECKPOINTS - All checkpoints are always visible and functional */}
      <Checkpoint 
        position={[10.5, 0.5, -4]} 
        rotation={[0, Math.PI / 17, 0]}
        checkpointNumber={1}
        onCheckpoint={onCheckpoint}
        visible={showCheckpoints}
      />
      
      <Checkpoint 
        position={[0, 0.5, 14.3]} 
        rotation={[0, Math.PI / 1.47, 0]}
        checkpointNumber={2}
        onCheckpoint={onCheckpoint}
        visible={showCheckpoints}
      />
      
      <Checkpoint 
        position={[-9, 0.5, -2.8]} 
        rotation={[0, -Math.PI / 2, 0]}
        checkpointNumber={3}
        onCheckpoint={onCheckpoint}
        visible={showCheckpoints}
      />

       {/* Optional visible mesh (only renders if geometry and colorMap are passed) 
      {geometry && colorMap && (
        <mesh geometry={geometry}>
          <meshBasicMaterial toneMapped={false} map={colorMap} />
        </mesh>
      )}*/}

     {/*on the side opposite to the stairs(other side of the road) */}
      <ColliderBox position={[3, 1, -0.3]} scale={[8, 3,1]} />
      <ColliderBox position={[-4, 1, -0.3]} scale={[8, 3,1]} />
      <ColliderBox position={[-10, 1, 0]} scale={[8, 3,1]} />
      
      {/*on the side next to the stairs(road) */}
      <ColliderBox position={[3, 1, -5]} scale={[4, 3,1]} />
      <ColliderBox position={[-3, 1, -5]} scale={[4, 3,1]} />
      <ColliderBox position={[-9, 1, -5]} scale={[4, 3,1]} />

      

      {/*next to the stairs */}
      <ColliderBox position={[-8, 1, -7]} scale={[4, 3,2]} />
      <ColliderBox position={[-11.1, 1, -7]} scale={[4, 3,2]} />

      {/*the tree next to the stairs(below)*/}
      <ColliderBox position={[-4.8, 1, -12.5]} scale={[1.5, 6,1]}  rotation={[0, Math.PI / 6, 0 ]}/>

      {/*the stairs*/}
      <ColliderBox position={[3, 1, -12.5]} scale={[8, 8,5]} />

      <ColliderBox position={[3, 1, -8.75]} scale={[6, 5, 7.5]} />


       {/*the tree next to the stairs(above)*/}
      <ColliderBox position={[4, 1, -15]} scale={[4, 6,1]}  rotation={[0, Math.PI / 6, 0 ]}/>

      {/*the turning curves at the start */}
      <ColliderBox position={[8, 0, 8]} scale={[8, 3,1]} rotation={[0, Math.PI / 6, 0 ]}/>
      <ColliderBox position={[6, 0, 12]} scale={[8, 3,1]} rotation={[0, Math.PI / 5, 0 ]}/>
      <ColliderBox position={[1, 0, 18]} scale={[8, 3,1]} rotation={[0, Math.PI / 6, 0 ]}/>

      {/*the trees at the start */}
      <ColliderBox position={[17, 0, 14]} scale={[1.5, 6,1]} rotation={[0, Math.PI / 6, 0 ]}/>
      <ColliderBox position={[15, 0, 1]} scale={[1.5, 6,1]} rotation={[0, Math.PI / 6, 0 ]}/>
      

      {}
      <ColliderBox position={[1, 0, 6]} scale={[8, 3,1]} rotation={[0, Math.PI / 5, 0]}/>
    </>
  );
}
