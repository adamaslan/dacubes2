import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Mock CurveModifier component since drei's CurveModifier isn't available
// This creates a similar effect by manually positioning text along a curve
interface CurveTextProps {
  text: string;
  curve: THREE.CatmullRomCurve3;
  color?: string;
  fontSize?: number;
}

const CurveText: React.FC<CurveTextProps> = ({
  text,
  curve,
  color = 'white',
  fontSize = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  let pathOffset = useRef(0);

  useFrame(() => {
    if (groupRef.current) {
      // Continuous movement along curve
      pathOffset.current += 0.001;
      
      // Add scroll influence
      const scrollInfluence = scroll ? scroll.offset * 0.5 : 0;
      const totalOffset = (pathOffset.current + scrollInfluence) % 1;
      
      // Get position and tangent from curve
      const position = curve.getPoint(totalOffset);
      const tangent = curve.getTangent(totalOffset);
      
      // Position the text group
      groupRef.current.position.copy(position);
      
      // Orient text along curve direction
      const lookAtTarget = position.clone().add(tangent);
      groupRef.current.lookAt(lookAtTarget);
      
      // Add some rotation for 3D effect
      groupRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={1.2}
        rotationIntensity={0.8}
        floatIntensity={0.3}
      >
        <Text
          color={color}
          fontSize={fontSize}
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_bold.typeface.json"
        >
          {text}
          <meshStandardMaterial 
            color={color}
            metalness={0.3}
            roughness={0.4}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </Text>
        
        <Sparkles
          count={80}
          scale={[fontSize * 3, fontSize * 3, fontSize * 3]}
          size={1.2 * fontSize}
          speed={0.4}
          color={color}
        />
      </Float>
    </group>
  );
};

interface AnimatedTextProps {
  text: string;
  handlePos?: THREE.Vector3[];
  color?: string;
  fontSize?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  handlePos = [
    new THREE.Vector3(-4, 2, 0),
    new THREE.Vector3(-2, -2, 2),
    new THREE.Vector3(2, 2, -2),
    new THREE.Vector3(4, -2, 0),
  ],
  color = '#00ffff',
  fontSize = 1.5,
}) => {
  // Create curve from handle positions
  const curve = useMemo(() => 
    new THREE.CatmullRomCurve3(handlePos, true, 'centripetal'), 
    [handlePos]
  );

  // Split text into individual letters for more dynamic effect
  const letters = text.split('');

  return (
    <>
      {letters.map((letter, index) => {
        // Create slightly different curves for each letter
        const offsetPositions = handlePos.map((pos, i) => {
          const offset = new THREE.Vector3(
            Math.sin(index * 0.5) * 0.3,
            Math.cos(index * 0.3) * 0.2,
            Math.sin(index * 0.7) * 0.4
          );
          return pos.clone().add(offset);
        });
        
        const letterCurve = new THREE.CatmullRomCurve3(offsetPositions, true, 'centripetal');
        
        return (
          <CurveText
            key={index}
            text={letter}
            curve={letterCurve}
            color={color}
            fontSize={fontSize}
          />
        );
      })}
      
      {/* Visualize the curve path */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={curve.getPoints(50).length}
            array={new Float32Array(curve.getPoints(50).flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#333333" opacity={0.3} transparent />
      </line>
    </>
  );
};

interface SceneProps {
  text: string;
}

const TextAnimation: React.FC<SceneProps> = ({ text = "FLOWING" }) => (
  <div style={{ width: '100%', height: '100vh', background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)' }}>
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      {/* Enhanced lighting for 3D effect */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.8}
        color="#ff00ff"
        castShadow
      />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0a', 5, 20]} />
      
      <AnimatedText text={text} />
      
      {/* Background particles */}
      <Sparkles
        count={200}
        scale={[20, 20, 20]}
        size={0.5}
        speed={0.1}
        color="#ffffff"
        opacity={0.3}
      />
    </Canvas>
  </div>
);

export default TextAnimation;