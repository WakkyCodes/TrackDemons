import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

import Car from './Car'
import Track01 from './Track01'
import Track02 from './Track02'
import Lights from './Lights'
import FollowCam from './FollowCam'
import CameraController from './CameraController'
import ReflectiveGround from './ReflectiveGround'
import HUDOverlay from './HUDOverlay'
import FirstPersonHUD from './FirstPersonHUD'
import ControlsPopup from "./ControlsPopup";

type GameProps = {
  track: number;
  onBackToMenu: () => void;
};

export default function Game({ track, onBackToMenu }: GameProps) {
  const carRef = useRef<Mesh>(null);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [hudData, setHudData] = useState({ speed: 0, gear: 'N' });

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows camera={{ position: [3, 3, 3] }}>
        <Lights />

        <Physics gravity={[0, -9.82, 0]}>
          <ReflectiveGround />
          <FollowCam target={carRef} enabled={!isFirstPerson} />

          {track === 1 && <Track01 />}
          {track === 2 && <Track02 />}

          <Car 
            ref={carRef} 
            startPosition={track === 1 ? [9, 2.5, -7] : [0, 2.5, 0]} 
            onHudUpdate={setHudData}
          />
        </Physics>

        <CameraController target={carRef} isFirstPerson={isFirstPerson} />

        <Environment files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`} background />
        
      </Canvas>

    <ControlsPopup />
    
      {/* HUD */}
      {isFirstPerson ? (
        <FirstPersonHUD speed={hudData.speed} gear={hudData.gear} />
      ) : (
        <HUDOverlay speed={hudData.speed} gear={hudData.gear} />
      )}

      {/* Controls */}
      <div style={{ position: "absolute", top: 20, left: 20, display: "flex", gap: "10px" }}>
        <button onClick={onBackToMenu}>Back to Menu</button>
        <button onClick={() => setIsFirstPerson(!isFirstPerson)}>
          {isFirstPerson ? "1st Person" : "3rd Person"}
        </button>
      </div>
    </div>
  );
}
