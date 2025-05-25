import { OrbitControls, Text, Html } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useNavigate } from '@remix-run/react';
import * as THREE from 'three';
import { useState } from 'react';

interface NavItemProps {
  position: [number, number, number];
  text: string;
  to: string;
}

function NavItem({ position, text, to }: NavItemProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();
  
  return (
    <group 
      position={position}
      onClick={() => navigate(to)}
      onPointerOver={() => {
        setHovered(true);
        gl.domElement.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        gl.domElement.style.cursor = 'auto';
      }}
    >
      <Text
        fontSize={0.5}
        color={hovered ? "#00ffff" : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}

export default function DreiNav() {
  return (
    <div style={{ height: '100px', width: '100%', background: 'black', marginBottom: '20px' }}>
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