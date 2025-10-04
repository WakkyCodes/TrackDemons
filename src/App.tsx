import { useState } from "react";
import Menu3D from "./components/Menu3D";
import Game from "./components/Game";

type CarModel = 'car' | 'bmw';

export default function App() {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarModel>('car'); 
  return (
    <>
      {!selectedTrack ? (
        <Menu3D 
          onSelectTrack={(track) => setSelectedTrack(track)} 
          selectedCar={selectedCar}        // Add this
          onCarChange={setSelectedCar}     // Add this
        />
      ) : (
        <Game 
        track={selectedTrack}
        selectedCar={selectedCar} 
        onBackToMenu={() => setSelectedTrack(null)}
         />
      )}
    </>
  );
}
