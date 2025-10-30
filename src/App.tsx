import { useState } from "react";
import Menu3D from "./components/Menu3D";
import Game from "./components/Game";

type Difficulty = 'easy' | 'normal' | 'hard'
type CarModel = 'car' | 'bmw';

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarModel>('car');

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff)
  } 
  return (
    <>
      {!selectedTrack ? (
        <Menu3D 
          onSelectTrack={(track) => setSelectedTrack(track)} 
          selectedCar={selectedCar}        // Add this
          onCarChange={setSelectedCar}     // Add this
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          isInMenu={true}
        />
      ) : (
        <Game 
        track={selectedTrack}
        selectedCar={selectedCar} 
        difficulty={difficulty}
        onBackToMenu={() => setSelectedTrack(null)}
         />
      )}
    </>
  );
}
