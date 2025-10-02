import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { useRef, Suspense } from "react";
import { Mesh, Vector3 } from "three";

type Menu3DProps = {
  onSelectTrack: (track: number) => void;
};
const defaultPos = new Vector3(0, 0.5, 0);


// Spinning Menu Car component
function MenuCar({ position = defaultPos }: { position?: Vector3 | [number, number, number] }) {
  const carRef = useRef<Mesh>(null);
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/car.glb`);

  useFrame((_, delta) => {
    if (carRef.current) {
      carRef.current.rotation.y += delta * 0.5; // spins slowly
    }
  });

  return (
    <mesh ref={carRef} position={position} castShadow>
      <primitive object={scene} scale={0.01} />
    </mesh>
  );
}

export default function Menu3D({ onSelectTrack }: Menu3DProps) {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          {/* Empty fallback plane */}
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="lightgray" />
          </mesh>

          {/* Spinning showroom car */}
          <MenuCar position={[0, 0.5, 0]} />

          {/* Environment HDRI */}
          <Environment files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`} background />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
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
