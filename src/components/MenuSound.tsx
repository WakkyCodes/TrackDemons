import { useEffect, useRef, useState } from 'react'

const TRACKLIST = [
  '/TrackDemons/sounds/track1.mp3',
  '/TrackDemons/music/track2.mp3',
  '/TrackDemons/music/track3.mp3',
]

const MenuMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const audio = new Audio(TRACKLIST[currentTrackIndex])
    audio.loop = false
    audio.volume = 0.4
    audioRef.current = audio

    const handleEnded = () => {
      const nextIndex = (currentTrackIndex + 1) % TRACKLIST.length
      setCurrentTrackIndex(nextIndex)
    }

    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.pause()
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrackIndex])

  useEffect(() => {
    const handleUserInteraction = () => {
      const audio = audioRef.current
      if (audio && !hasInteracted) {
        audio.play().then(() => {
          setHasInteracted(true)
          window.removeEventListener('click', handleUserInteraction)
          window.removeEventListener('keydown', handleUserInteraction)
        }).catch(err => console.warn('Menu music play failed:', err))
      }
    }

    window.addEventListener('click', handleUserInteraction)
    window.addEventListener('keydown', handleUserInteraction)

    return () => {
      window.removeEventListener('click', handleUserInteraction)
      window.removeEventListener('keydown', handleUserInteraction)
    }
  }, [hasInteracted])

  return null
}

export default MenuMusic
