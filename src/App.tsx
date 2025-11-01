import { useState, useEffect } from "react";
import Menu3D from "./components/Menu3D";
import Game from "./components/Game";

type Difficulty = 'easy' | 'normal' | 'hard'
type CarModel = 'car' | 'bmw' | 'merc';

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarModel>('car');

   const [completedTracks, setCompletedTracks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('completedTracks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load completed tracks:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('completedTracks', JSON.stringify(completedTracks));
    } catch (error) {
      console.error('Failed to save completed tracks:', error);
    }
  }, [completedTracks]);

  const handleTrackComplete = (trackNumber: number) => {
    if (!completedTracks.includes(trackNumber)) {
      setCompletedTracks([...completedTracks, trackNumber]);
    }
  };

  // Optional: Reset progress function (useful for testing)
  const handleResetProgress = () => {
    setCompletedTracks([]);
    localStorage.removeItem('completedTracks');
  };

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
          completedTracks={completedTracks}
          onDifficultyChange={handleDifficultyChange}
          isInMenu={true}
          onResetProgress={handleResetProgress}
        />
      ) : (
        <Game 
        track={selectedTrack}
        selectedCar={selectedCar} 
        difficulty={difficulty}
        onBackToMenu={() => setSelectedTrack(null)}
        onTrackComplete={handleTrackComplete}
         />
      )}
    </>
  );
}