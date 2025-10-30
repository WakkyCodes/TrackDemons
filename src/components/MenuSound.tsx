import { useEffect, useRef } from "react";

const TRACKLIST = [
  "/TrackDemons/sounds/track1.mp3",
  "/TrackDemons/music/track2.mp3",
  "/TrackDemons/music/track3.mp3",
];

type MenuMusicProps = {
  isPlaying: boolean;
};

const MenuMusic: React.FC<MenuMusicProps> = ({ isPlaying }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const randomTrack = Math.floor(Math.random() * TRACKLIST.length);
      const audio = new Audio(TRACKLIST[randomTrack]);
      audio.loop = true; // Loop background music
      audio.volume = 0.4;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch((err) => console.warn("Play failed:", err));
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isPlaying]);

  return null;
};

export default MenuMusic;
