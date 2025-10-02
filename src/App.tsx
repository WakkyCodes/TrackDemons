import { useState } from "react";
import Menu3D from "./components/Menu3D";
import Game from "./components/Game";

export default function App() {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

  return (
    <>
      {!selectedTrack ? (
        <Menu3D onSelectTrack={(track) => setSelectedTrack(track)} />
      ) : (
        <Game track={selectedTrack} onBackToMenu={() => setSelectedTrack(null)} />
      )}
    </>
  );
}
