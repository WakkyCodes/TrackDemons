import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { useRef, Suspense } from "react";
import { Mesh } from "three";

type CarModel = 'car' | 'bmw';

type Menu3DProps = {
  onSelectTrack: (track: number) => void;
  selectedCar: CarModel;
  onCarChange: (car: CarModel) => void;
};

const CAR_CONFIGS = {
  car: {
    path: `${import.meta.env.BASE_URL}models/car.glb`,
    scale: 0.01,
    position: [0, 0.5, 0] as [number, number, number],
    name: "Default Car"
  },
  bmw: {
    path: `${import.meta.env.BASE_URL}models/bmw_m3.glb`,
    scale: 0.5,
    position: [0, 0.5, 0] as [number, number, number],
    name: "BMW M3"
  }
};

function MenuCar({ carModel }: { carModel: CarModel }) {
  const carRef = useRef<Mesh>(null);
  const config = CAR_CONFIGS[carModel];
  const { scene } = useGLTF(config.path);

  useFrame((_, delta) => {
    if (carRef.current) {
      carRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={carRef} position={config.position} castShadow>
      <primitive object={scene.clone()} scale={config.scale} />
    </mesh>
  );
}

// Map Menu Scene Component
function MapMenuScene() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/mapmenu.glb`);
  
  return <primitive object={scene} />;
}

export default function Menu3D({ onSelectTrack, selectedCar, onCarChange }: Menu3DProps) {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows camera={{ position: [-1, 2, -3], fov: 80 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          {/* Map Menu Background */}
          <MapMenuScene />

          <MenuCar carModel={selectedCar} />

          <Environment files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`} background />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* Car Selection UI */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "15px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "15px 25px",
          borderRadius: "10px",
        }}
      >
        <button
          onClick={() => onCarChange('car')}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: selectedCar === 'car' ? "#4CAF50" : "#555",
            color: "white",
            border: selectedCar === 'car' ? "2px solid #4CAF50" : "2px solid transparent",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {CAR_CONFIGS.car.name}
        </button>
        <button
          onClick={() => onCarChange('bmw')}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: selectedCar === 'bmw' ? "#4CAF50" : "#555",
            color: "white",
            border: selectedCar === 'bmw' ? "2px solid #4CAF50" : "2px solid transparent",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {CAR_CONFIGS.bmw.name}
        </button>
      </div>

      {/* Selected Car Info */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          textAlign: "center",
        }}
      >
        {CAR_CONFIGS[selectedCar].name}
      </div>

      {/* Track Selection */}
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