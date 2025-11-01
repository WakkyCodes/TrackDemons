// src/components/CrashSound.tsx
import { useEffect } from "react";

type CrashSoundProps = {
  play: boolean;
};

const CrashSound: React.FC<CrashSoundProps> = ({ play }) => {
  useEffect(() => {
    if (play) {
      const crash = new Audio("/sounds/car_crash.mp3"); // replace with your file path
      crash.volume = 0.7;
      crash.play().catch((err) => console.warn("Crash sound failed:", err));
    }
  }, [play]);

  return null;
};

export default CrashSound;
