// CheckpointCountdown.tsx
import { useState, useEffect, useRef } from 'react';

interface CheckpointCountdownProps {
  checkpointNumber: number;
  isActive: boolean;
  onTimeout: (checkpointNumber: number) => void;
  duration?: number; // in seconds
}

export default function CheckpointCountdown({ 
  checkpointNumber, 
  isActive, 
  onTimeout,
  duration = 10  // 10 seconds
}: CheckpointCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<number | null>(null);
  const isActiveRef = useRef(isActive);
  const checkpointNumberRef = useRef(checkpointNumber);

  // Update refs when props change
  useEffect(() => {
    isActiveRef.current = isActive;
    checkpointNumberRef.current = checkpointNumber;
  }, [isActive, checkpointNumber]);

  // Clear timer function
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start timer function
  const startTimer = () => {
    clearTimer();
    setTimeLeft(duration);

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          clearTimer();
          // Use refs to get current values instead of props
          if (isActiveRef.current) {
            onTimeout(checkpointNumberRef.current);
          }
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      clearTimer();
      setTimeLeft(duration);
    }

    // Cleanup on unmount
    return () => {
      clearTimer();
    };
  }, [isActive, duration]); // Only depend on isActive and duration

  // Reset timer only when checkpointNumber changes AND isActive is true
  useEffect(() => {
    if (isActive) {
      startTimer();
    }
  }, [checkpointNumber]); // Only depend on checkpointNumber

  if (!isActive) return null;

  const getColor = () => {
    if (timeLeft > 6) return '#00ff88';
    if (timeLeft > 3) return '#ffaa00';
    return '#ff4444';
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '15px 25px',
        borderRadius: '10px',
        border: `3px solid ${getColor()}`,
        color: getColor(),
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontWeight: 'bold',
        zIndex: 1000,
        minWidth: '250px',
        textAlign: 'center',
        boxShadow: '0 6px 12px rgba(0,0,0,0.5)',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}
    >
      Checkpoint {checkpointNumber}: {timeLeft}s
    </div>
  );
}