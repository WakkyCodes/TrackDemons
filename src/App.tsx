import { useState, useEffect } from "react";
import Menu3D from "./components/Menu3D";
import Game from "./components/Game";

type CarModel = 'car' | 'bmw' | 'merc';

export default function App() {
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
  return (
    <>
      {!selectedTrack ? (
        <Menu3D 
          onSelectTrack={(track) => setSelectedTrack(track)} 
          selectedCar={selectedCar}
          onCarChange={setSelectedCar}
          completedTracks={completedTracks}
          onResetProgress={handleResetProgress} // Optional: for testing
        />
      ) : (
        <Game 
          track={selectedTrack}
          selectedCar={selectedCar} 
          onBackToMenu={() => setSelectedTrack(null)}
          onTrackComplete={handleTrackComplete}
        />
      )}
    </>
  );
}
