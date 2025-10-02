import { useBox } from '@react-three/cannon';
//import { Vector3 } from 'three';

type ColliderBoxProps = {
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
};

// This component creates an invisible physics box
// We use it for walls, trees, and other obstacles in the track.
export default function ColliderBox({ position, scale = [1, 1, 1], rotation = [0, 0, 0] }: ColliderBoxProps) {
  useBox(() => ({
    args: scale,
    position,
    rotation,
    type: 'Static', // It's a static object that doesn't move
  }));

  // This component doesn't render anything visible, it's just a physics body.
  // You can optionally add a visible <mesh> here for debugging.
  return null;
}