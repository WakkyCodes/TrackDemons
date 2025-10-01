// src/components/CoveredCar.tsx

import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

type CoveredCarProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
};

export function CoveredCar({ position, rotation = [0, 0, 0] }: CoveredCarProps) {
  // Update this path to point to the .gltf file inside its new folder
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/covered_car/covered_car_4k.gltf`);

  const [ref] = useBox<Mesh>(() => ({
    mass: 1,
    type: 'Static',
    position,
    rotation,
    args: [2.2, 1.5, 5], 
  }));

  return <primitive object={scene.clone()} ref={ref} />;
}