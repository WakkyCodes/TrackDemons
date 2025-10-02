import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { useRef, Suspense } from "react";
import { Mesh } from "three";

import Car from "./Car";
import MapMenu from "./MapMenu";
import Lights from "./Lights";

type Menu3DProps = {
  onSelectTrack: (track: number) => void;
};

export default function Menu3D({ onSelectTrack }: Menu3DProps) {
  const carRef = useRef<Mesh>(null);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
        <Lights />

        <Physics gravity={[0, -9.82, 0]}>
          {/* Static map environment */}
          <Suspense fallback={null}>
            <MapMenu />
         </Suspense>

          {/* Static car in menu */}
          <Car ref={carRef} startPosition={[0, 2, 0]} />
        </Physics>

        <OrbitControls enablePan={false} enableZoom={false} />
        <Environment files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`} background />
      </Canvas>

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "20px",
        }}
      >
        <button
          onClick={() => onSelectTrack(1)}
          style={{
            padding: "15px 30px",
            fontSize: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          Play Track 1
        </button>
        <button
          onClick={() => onSelectTrack(2)}
          style={{
            padding: "15px 30px",
            fontSize: "20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          Play Track 2
        </button>
      </div>
    </div>
  );
}
