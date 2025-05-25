import { OrbitControls, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Link } from '@remix-run/react';
import * as THREE from 'three';

interface NavItemProps {
  position: [number, number, number];
  text: string;
  to: string;
}

function NavItem({ position, text, to }: NavItemProps) {
  return (
    <Link to={to}>
      <Text
        position={position}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </Link>
  );
}

export default function DreiNav() {
  return (
    <div style={{ height: '100px', width: '100%', background: 'black' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <NavItem position={[-2, 0, 0]} text="Home" to="/" />
        <NavItem position={[0, 0, 0]} text="About" to="/about" />
        <NavItem position={[2, 0, 0]} text="Contact" to="/contact" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}