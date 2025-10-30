// src/components/CoveredCar.tsx

import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

type CoveredCarProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
};

export function CoveredCar({ position, rotation = [0, 0, 0] }: CoveredCarProps) {
  const { scene } = useGLTF(
    `${import.meta.env.BASE_URL}models/covered_car/covered_car_4k.gltf`
  );

  // Dynamic physics body (movable)
  const [ref] = useBox<Mesh>(() => ({
    mass: 1, // >0 makes it dynamic
    position,
    rotation,
    args: [2.2, 1.5, 5], // approximate size of the car hitbox
    allowSleep: false,   // keeps it always active
  }));

  return <primitive ref={ref} object={scene.clone()} />;
}
