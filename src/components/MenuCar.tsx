import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useGLTF } from "@react-three/drei";

export default function MenuCar({ position = [0, 0.5, 0] as [number, number, number] }) {
  const carRef = useRef<Mesh>(null);
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/car.glb`);

  useFrame((_, delta) => {
    if (carRef.current) carRef.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={carRef} position={position} castShadow>
      <primitive object={scene} scale={0.01} />
    </mesh>
  );
}
