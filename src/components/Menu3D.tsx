import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { useRef, Suspense, useState } from "react";
import { Mesh } from "three";
import MenuMusic from "./MenuSound";
import { Settings, Volume2, VolumeX } from 'lucide-react';


type CarModel = 'car' | 'bmw' | 'merc';
type Difficulty = 'easy' | 'normal' | 'hard';


type Menu3DProps = {
  onSelectTrack: (track: number) => void;
  selectedCar: CarModel;
  onCarChange: (car: CarModel) => void;
  completedTracks: number[];
  onResetProgress?: () => void; 
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  isInMenu?: boolean;
};

const CAR_CONFIGS = {
  car: {
    path: `${import.meta.env.BASE_URL}models/car22.glb`,
    scale: 80,
    position: [0, -0.20, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    name: "Subaru",
  },
  bmw: {
    path: `${import.meta.env.BASE_URL}models/bmw_m3.glb`,
    scale: 0.8,
    position: [0, -0.20, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    name: "BMW M3"
  },
   merc: {  // Add this entire object
    path: `${import.meta.env.BASE_URL}models/merc_g.glb`,
    scale: 0.03, // Adjust based on your model size
    position: [1.9, -0.20, 0] as [number, number, number],
    rotation: [0, -Math.PI/4, 0] as [number, number, number],
    name: "Mercedes G-Wagon"
  },

};

function MenuCar({ carModel }: { carModel: CarModel }) {
  const carRef = useRef<Mesh>(null);
  const config = CAR_CONFIGS[carModel];
  const { scene } = useGLTF(config.path);

  useFrame((_, delta) => {
  if (carRef.current && carModel !== 'merc') {
      carRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={carRef} 
      position={config.position} 
      rotation={config.rotation || [0, 0, 0]} 
      castShadow
      >
      <primitive object={scene.clone()} scale={config.scale} />
    </mesh>
  );
}

// Map Menu Scene Component
function MapMenuScene() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/mapmenu.glb`);
  return <primitive object={scene} />;
}

export default function Menu3D({ onSelectTrack, selectedCar, onCarChange,onResetProgress, completedTracks, difficulty, onDifficultyChange}: Menu3DProps) {
  const isTrack2Unlocked = completedTracks.includes(1);
   const [showSettings, setShowSettings] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // starts unmuted
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0); // default official song

    const handleToggleMute = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleChooseSound = (index: number) => {
    setSelectedTrackIndex(index);
  };

  const getDifficultyColor = (diff: Difficulty) => {
    if (diff === difficulty) return '#4CAF50';
    return '#555';
  };

  const getDifficultyDescription = () => {
    switch(difficulty) {
      case 'easy': return 'No time limits, explore freely!';
      case 'normal': return 'Standard checkpoint timers';
      case 'hard': return 'Shorter time limits, more challenge!';
    }
  };



  return (
    
    
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows camera={{ position: [-1, 2, -3], fov: 80 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          {/* Map Menu Background */}
          <MapMenuScene />
          <MenuCar carModel={selectedCar} />
          <Environment
            files={`${import.meta.env.BASE_URL}hdrs/overcast_4k.hdr`}
            background
          />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* 🎵 Menu Music */}
      <MenuMusic isPlaying={isSoundOn} selectedTrackIndex={selectedTrackIndex} />

      {/* Controls */}
      <button onClick={handleToggleMute}>
        {isPlaying ? "Mute" : "Unmute"}
      </button>
      
      {/* ⚙️ Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(0, 0, 0, 0.6)",
          border: "none",
          borderRadius: "50%",
          padding: "10px",
          cursor: "pointer",
          color: "white",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Settings size={28} />
      </button>

{/* 🔊 Play Button */}
<button
  onClick={() => setIsSoundOn(true)}
  style={{
    position: "absolute",
    top: "20px",
    right: "80px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  title="Play Music"
>
  <Volume2 size={40} color="white" />
</button>

{/* 🔇 Mute Button */}
<button
  onClick={() => setIsSoundOn(false)}
  style={{
    position: "absolute",
    top: "20px",
    right: "140px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  title="Mute Music"
>
  <VolumeX size={40} color="white" />
</button>    

      

      {/* ⚙️ Settings Menu Dropdown */}
      {showSettings && (

        <div

          style={{

            position: "absolute",

            top: "70px",

            right: "20px",

            background: "rgba(0, 0, 0, 0.8)",

            borderRadius: "10px",

            padding: "15px 20px",

            color: "white",

            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",

            minWidth: "180px",

            zIndex: 10,

          }}

        >

          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>

            ⚙️ Settings

          </h3>

          

          {/* Difficulty Selection */}

          <div style={{ marginBottom: '20px' }}>

            <div style={{ fontSize: '14px', marginBottom: '10px', color: '#aaa' }}>

              Difficulty

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

              <button

                onClick={() => onDifficultyChange('easy')}

                style={{

                  padding: '10px 15px',

                  backgroundColor: getDifficultyColor('easy'),

                  border: difficulty === 'easy' ? '2px solid #4CAF50' : '2px solid transparent',

                  borderRadius: '5px',

                  color: 'white',

                  cursor: 'pointer',

                  fontSize: '14px',

                  fontWeight: 'bold',

                  transition: 'all 0.2s',

                }}

              >

                😊 Easy

              </button>

              <button

                onClick={() => onDifficultyChange('normal')}

                style={{

                  padding: '10px 15px',

                  backgroundColor: getDifficultyColor('normal'),

                  border: difficulty === 'normal' ? '2px solid #4CAF50' : '2px solid transparent',

                  borderRadius: '5px',

                  color: 'white',

                  cursor: 'pointer',

                  fontSize: '14px',

                  fontWeight: 'bold',

                  transition: 'all 0.2s',

                }}

              >

                😐 Normal

              </button>

              <button

                onClick={() => onDifficultyChange('hard')}

                style={{

                  padding: '10px 15px',

                  backgroundColor: getDifficultyColor('hard'),

                  border: difficulty === 'hard' ? '2px solid #4CAF50' : '2px solid transparent',

                  borderRadius: '5px',

                  color: 'white',

                  cursor: 'pointer',

                  fontSize: '14px',

                  fontWeight: 'bold',

                  transition: 'all 0.2s',

                }}

              >

                😈 Hard

              </button>

            </div>

            <div style={{ fontSize: '12px', marginTop: '10px', color: '#888', fontStyle: 'italic' }}>

              {getDifficultyDescription()}

            </div>

          </div>



          {/* Music Selection */}
          <div style={{ marginBottom: '20px' }}> {/* Matches 'Difficulty' container margin */}
            
            {/* 1. This is the new "left-aligned" title */}
            <div style={{ fontSize: '14px', marginBottom: '10px', color: '#aaa' }}>
              🎵 Choose Sound
            </div>
            
            {/* 2. This container adds the 'gap' between buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleChooseSound(0); }}
                style={{
                  padding: '10px 15px',
                  backgroundColor: selectedTrackIndex === 0 ? '#4CAF50' : '#555',
                  border: selectedTrackIndex === 0 ? '2px solid #4CAF50' : '2px solid transparent',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  textAlign: 'left' // Aligns text nicely
                }}
              >
                San Andreas
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleChooseSound(1); }}
                style={{
                  padding: '10px 15px',
                  backgroundColor: selectedTrackIndex === 1 ? '#4CAF50' : '#555',
                  border: selectedTrackIndex === 1 ? '2px solid #4CAF50' : '2px solid transparent',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                Leonida
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleChooseSound(2); }}
                style={{
                  padding: '10px 15px',
                  backgroundColor: selectedTrackIndex === 2 ? '#4CAF50' : '#555',
                  border: selectedTrackIndex === 2 ? '2px solid #4CAF50' : '2px solid transparent',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                San Fierro
              </button>
            </div>
          </div>

         

        </div>

      )}
      {/* Difficulty Indicator */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(0, 0, 0, 0.7)",
          padding: "10px 20px",
          borderRadius: "8px",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        Difficulty: <span style={{ color: '#4CAF50' }}>{difficulty.toUpperCase()}</span>
      </div>
      
      {/* Car Selection UI */}
      {/* Progress indicator - top left */}
      
      <div
        style={{
          position: "absolute",
          top: "65px",
          left: "20px",
          background: "rgba(0, 0, 0, 0.7)",
          padding: "10px 20px",
          borderRadius: "8px",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        <div>Progress: {completedTracks.length}/2 Tracks</div>
        {completedTracks.includes(1) && (
          <div style={{ color: "#4CAF50", fontSize: "12px" }}>✓ Track 1 Complete</div>
        )}
        {completedTracks.includes(2) && (
          <div style={{ color: "#4CAF50", fontSize: "12px" }}>✓ Track 2 Complete</div>
        )}
      </div>

      {/* Optional: Reset button for testing - top right */}
      {onResetProgress && completedTracks.length > 0 && (
        <button
          onClick={onResetProgress}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "20px",
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          🔄 Reset Progress
        </button>
      )}

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
          onClick={() => onCarChange("car")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: selectedCar === "car" ? "#4CAF50" : "#555",
            color: "white",
            border:
              selectedCar === "car"
                ? "2px solid #4CAF50"
                : "2px solid transparent",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {CAR_CONFIGS.car.name}
        </button>
        <button
          onClick={() => onCarChange("bmw")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: selectedCar === "bmw" ? "#4CAF50" : "#555",
            color: "white",
            border:
              selectedCar === "bmw"
                ? "2px solid #4CAF50"
                : "2px solid transparent",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {CAR_CONFIGS.bmw.name}
        </button>
        <button
          onClick={() => onCarChange('merc')}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: selectedCar === 'merc' ? "#4CAF50" : "#555",
            color: "white",
            border: selectedCar === 'merc' ? "2px solid #4CAF50" : "2px solid transparent",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {CAR_CONFIGS.merc.name}
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
          onClick={() => isTrack2Unlocked && onSelectTrack(2)}
          disabled={!isTrack2Unlocked}
          style={{
            padding: "15px 30px",
            fontSize: "20px",
            backgroundColor: isTrack2Unlocked ? "#2196F3" : "#555",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          {isTrack2Unlocked ? "Play Track 2" : "🔒 Track 2 Locked"}
        </button>
      </div>
       {/* Lock message */}
      {!isTrack2Unlocked && (
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#ffaa00",
            fontSize: "16px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            textAlign: "center",
          }}
        >
          Complete Track 1 to unlock Track 2!
        </div>
      )}

      {/* Completion celebration */}
      {completedTracks.includes(1) && completedTracks.includes(2) && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.8)",
            padding: "30px 50px",
            borderRadius: "15px",
            color: "#FFD700",
            fontSize: "32px",
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
            textAlign: "center",
            border: "3px solid #FFD700",
            pointerEvents: "none",
          }}
        >
          🏆 ALL TRACKS COMPLETE! 🏆
        </div>
      )}
    </div>
  );
}
