import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedTextProps {
  text: string;
  position?: [number, number, number];
  color?: string;
  fontSize?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  position = [0, 0, 0],
  color = 'white',
  fontSize = 1,
}) => {
  const meshRef = useRef<THREE.Mesh | null>(null);

  // continuous slow rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <Float
      speed={1.2}           // float speed
      rotationIntensity={0.8}
      floatIntensity={1.5}
    >
      {/* group both Text and Sparkles together */}
      <group position={position}>
        <Text
          ref={meshRef}
          color={color}
          fontSize={fontSize}
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>

        <Sparkles
          count={120}               // number of sparkle particles
          scale={[fontSize * 2, fontSize * 2, fontSize * 2]}
          size={1.6 * fontSize}    // sparkle size relative to text
          speed={0.3}
          color={color}
        />
      </group>
    </Float>
  );
};

interface SceneProps {
  text: string;
}

const TextAnimation: React.FC<SceneProps> = ({ text }) => (
  <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <AnimatedText text={text} />
  </Canvas>
);

export default TextAnimation;
