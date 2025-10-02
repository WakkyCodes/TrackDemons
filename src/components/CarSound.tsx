import { useEffect, useRef, useState, useCallback } from 'react'

interface CarSoundProps {
  speed: number
  gear: string
  onInteractionStatusChange: (interacted: boolean) => void 
}

// Define the single sound file to use
const SINGLE_ENGINE_SOUND_FILE = '/TrackDemons/sounds/engine_1.ogg'; 

const CarSound: React.FC<CarSoundProps> = ({ speed, gear, onInteractionStatusChange }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Report interaction status on change
  useEffect(() => {
    onInteractionStatusChange(hasInteracted)
  }, [hasInteracted, onInteractionStatusChange])

  // 1. Initial Audio Setup and Cleanup (Runs once)
  useEffect(() => {
    // Create the Audio element once using the single file
    const audio = new Audio(SINGLE_ENGINE_SOUND_FILE)
    audio.loop = true
    audio.volume = 0 // Start muted
    audio.playbackRate = 0.5 // Start with a low rev sound
    audioRef.current = audio
    
    // Start loading the single sound file immediately
    audio.load()

    return () => {
      // Cleanup: pause and destroy the audio object
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, []) // Empty dependency array ensures this runs only on mount

  // 2. User Interaction Handler for Autoplay Restriction
  const handleUserInteraction = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !hasInteracted) {
      
      // Check if file is loaded. Try loading again just in case.
      if (audio.readyState < 2) { 
          audio.load();
      }
      
      // Attempt to play on a user action
      audio.play().then(() => {
        setHasInteracted(true)
        // Remove listeners immediately upon success
        window.removeEventListener('click', handleUserInteraction)
        window.removeEventListener('keydown', handleUserInteraction)
      }).catch(err => {
        // Log the error, but this should be much less frequent now
        console.warn('Initial audio play failed (user must interact):', err) 
      })
    }
  }, [hasInteracted])

  useEffect(() => {
    // Attach listener to capture first user interaction
    window.addEventListener('click', handleUserInteraction)
    window.addEventListener('keydown', handleUserInteraction)

    return () => {
      window.removeEventListener('click', handleUserInteraction)
      window.removeEventListener('keydown', handleUserInteraction)
    }
  }, [handleUserInteraction])

  // 3. Logic to update sound volume and playback rate based on speed
  useEffect(() => {
    const audio = audioRef.current
    // Only proceed if audio is ready and interaction has happened
    if (!audio || !hasInteracted) return 

    // Determine speed for calculations (use 0 if in Neutral to simulate idle state)
    const effectiveSpeed = gear === 'N' ? 0 : speed

    // A. Adjust Playback Rate (Pitch)
    // Scale speed (e.g., up to 200) to a playback rate (e.g., 0.5 to 1.5)
    // Formula: min_rate + (max_rate - min_rate) * (effectiveSpeed / max_speed)
    const MIN_RATE = 0.5
    const MAX_RATE = 1.5
    const MAX_SPEED_FOR_PITCH = 150 // Speed at which pitch reaches max
    
    let targetRate = MIN_RATE + (MAX_RATE - MIN_RATE) * (Math.min(effectiveSpeed, MAX_SPEED_FOR_PITCH) / MAX_SPEED_FOR_PITCH)
    
    audio.playbackRate = targetRate

    // B. Adjust Volume (Loudness)
    // Scale speed to volume (e.g., 0.2 to 1.0)
    const IDLE_VOLUME = 0 // Base volume when speed is 0
    const MAX_VOLUME = 1.0
    const MAX_SPEED_FOR_VOLUME = 100 // Speed at which volume reaches max

    let targetVolume = IDLE_VOLUME + (MAX_VOLUME - IDLE_VOLUME) * (Math.min(effectiveSpeed, MAX_SPEED_FOR_VOLUME) / MAX_SPEED_FOR_VOLUME)
    
    audio.volume = Math.min(1.0, targetVolume)

  }, [speed, gear, hasInteracted])

  return null 
}

export default CarSound