// ControlsPopup.tsx
import { useEffect, useState } from "react";

interface ControlsPopupProps {
  onClose?: () => void; // Add this
}

export default function ControlsPopup({ onClose }: ControlsPopupProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("seenControls");
    if (!seen) {
      setShow(true);
      localStorage.setItem("seenControls", "true");
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    onClose?.(); // Call the onClose callback
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <h2>🎮 Controls</h2>
      <ul>
        <li>W / ↑ – Accelerate</li>
        <li>S / ↓ – Brake / Reverse</li>
        <li>A / ← – Steer Left</li>
        <li>D / → – Steer Right</li>
        <li>C – Change Camera</li>
        <li>Space – Handbrake</li>
      </ul>
      <button
        onClick={handleClose} // Use handleClose instead of setShow
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          color: "white",
        }}
      >
        Got it!
      </button>
    </div>
  );
}