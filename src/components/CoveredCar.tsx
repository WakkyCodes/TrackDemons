// src/components/CoveredCar.tsx

import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { Mesh, Object3D } from 'three';
import { Suspense, useMemo } from 'react';

type CoveredCarProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
};

export function CoveredCar({ position, rotation = [0, 0, 0] }: CoveredCarProps) {
  // Load GLTF with Suspense-friendly fallback
  const { scene } = useGLTF(
    `${import.meta.env.BASE_URL}models/covered_car/covered_car_4k.gltf`
  );

  // Clone the scene safely
  const clonedScene = useMemo(() => scene?.clone() || new Object3D(), [scene]);

  // Set up physics body
  const [ref] = useBox<Mesh>(() => ({
    mass: 1,
    type: 'Static',
    position,
    rotation,
    args: [2.2, 1.5, 5],
  }));

  // Only render if the cloned scene exists
  return <primitive object={clonedScene} ref={ref} />;
}

// Preload the GLTF for faster loading
useGLTF.preload(`${import.meta.env.BASE_URL}models/covered_car/covered_car_4k.gltf`);
