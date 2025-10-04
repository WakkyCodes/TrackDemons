// src/components/ColliderWall.tsx
import { useBox } from '@react-three/cannon';

type ColliderWallProps = {
  position: [number, number, number];
  args: [number, number, number];
  color?: string;
};

export default function ColliderWall({ position, args, color = 'orange' }: ColliderWallProps) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args,
  }));

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
}
