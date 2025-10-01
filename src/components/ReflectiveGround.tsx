import { usePlane } from '@react-three/cannon';
import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Mesh, BufferAttribute } from 'three';

export default function ReflectiveGround() {
  // This is the invisible physics plane. The car drives on this.
  usePlane<Mesh>(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
  }));

  // Load textures using drei's useTexture hook
  const [grid, aoMap, alphaMap] = useTexture([
    `${import.meta.env.BASE_URL}textures/grid.png`,
    `${import.meta.env.BASE_URL}textures/ground_ao.png`,
    `${import.meta.env.BASE_URL}textures/alpha_map.png`,
  ]);

  // Refs for the visible meshes
  const meshRef = useRef<Mesh>(null);
  const meshRef2 = useRef<Mesh>(null);

  // This useEffect is necessary for the aoMap to work correctly.
  // It creates a second set of UV coordinates (uv2) that the material uses.
  useEffect(() => {
    if (meshRef.current && meshRef2.current) {
      const uvs = meshRef.current.geometry.attributes.uv.array;
      meshRef.current.geometry.setAttribute('uv2', new BufferAttribute(uvs, 2));

      const uvs2 = meshRef2.current.geometry.attributes.uv.array;
      meshRef2.current.geometry.setAttribute('uv2', new BufferAttribute(uvs2, 2));
    }
  }, [meshRef, meshRef2]);

  return (
    <>
      {/* The main reflective circle */}
      <mesh ref={meshRef} position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[200, 200]} />
        <MeshReflectorMaterial
          aoMap={aoMap}
          alphaMap={alphaMap}
          transparent={true}
          color="#303030"
          envMapIntensity={0.35}
          metalness={0.05}
          roughness={0.4}
          mixBlur={3}
          mixStrength={50}
          resolution={1024}
          mirror={0} // 0 = texture colors, 1 = pick up env colors
        />
      </mesh>

      {/* The semi-transparent grid overlay */}
      <mesh ref={meshRef2} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial
          opacity={0.325}
          alphaMap={grid}
          transparent={true}
          color={'white'}
        />
      </mesh>
    </>
  );
}