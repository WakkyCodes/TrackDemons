// src/components/Ramp.tsx
import { useTrimesh } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { Mesh, BufferGeometry } from 'three';
import { memo } from 'react';

const Ramp = () => {
  const { nodes } = useGLTF(`${import.meta.env.BASE_URL}models/ramp.glb`);

  // Access the correct mesh named 'Cube'
  const rampMesh = nodes.Cube as Mesh;

  // Safety check to ensure the mesh was found
  if (!rampMesh) {
    console.error("Ramp mesh ('Cube') not found in the GLB file.");
    return null;
  }

  const geometry = rampMesh.geometry as BufferGeometry;

  if (!geometry.index) {
    console.error("The ramp model's geometry is not indexed.");
    return null;
  }

  const vertices = geometry.attributes.position.array;
  const indices = geometry.index.array;

  const [ref] = useTrimesh(() => ({
    args: [vertices, indices],
    mass: 0,
    type: 'Static',
  }));

  // Render the original scene from the GLTF to ensure everything is displayed
  return <primitive object={nodes.Scene} ref={ref} />;
};

export default memo(Ramp);