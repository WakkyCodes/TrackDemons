import { useEffect, useRef } from "react";

const TRACKLIST = [
  "/TrackDemons/sounds/track1.mp3", // Default official song
  "/TrackDemons/sounds/track2.mp3",
  "/TrackDemons/sounds/track3.mp3",
];

type MenuMusicProps = {
  isPlaying: boolean;          // mute/unmute state
  selectedTrackIndex: number;  // which track is chosen
};

const MenuMusic: React.FC<MenuMusicProps> = ({ isPlaying, selectedTrackIndex }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create the audio instance if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio(TRACKLIST[selectedTrackIndex]);
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    // If track changes, load new song
    audio.src = TRACKLIST[selectedTrackIndex];
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => console.warn("Play failed:", err));
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isPlaying, selectedTrackIndex]);

  return null;
};

export default MenuMusic;
