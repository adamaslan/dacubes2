import React, { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles, useScroll, Billboard, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced CurveText component with Billboard integration
interface CurveTextProps {
  text: string;
  curve: THREE.CatmullRomCurve3;
  color?: string;
  fontSize?: number;
  initialOffset?: number;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
}

const CurveText: React.FC<CurveTextProps> = React.memo(({
  text,
  curve,
  color = 'white',
  fontSize = 1,
  initialOffset = 0,
  billboardMode = 'horizontal'
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const billboardRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const pathOffset = useRef(initialOffset);
  const { viewport, camera } = useThree();
  const [hovered, setHovered] = useState(false);
  
  // Responsive font size with hover effect
  const responsiveFontSize = useMemo(() => {
    const baseSize = fontSize;
    const scale = Math.min(viewport.width / 10, viewport.height / 10, 1.5);
    const hoverScale = hovered ? 1.2 : 1.0;
    return baseSize * scale * hoverScale;
  }, [fontSize, viewport.width, viewport.height, hovered]);
  
  // Enhanced texture creation with multiple layers
  const textureData = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    // Create layered noise texture
    const imageData = context.createImageData(size, size);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % size;
      const y = Math.floor((i / 4) / size);
      
      // Multiple noise layers for complexity
      const noise1 = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.5 + 0.5;
      const noise2 = Math.random() * 0.3 + 0.7;
      const combined = (noise1 + noise2) / 2;
      
      const value = combined * 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Advanced animation with easing
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Smooth movement with sine wave variation
    pathOffset.current += delta * (0.08 + Math.sin(time * 0.5) * 0.02);
    
    const scrollInfluence = scroll ? scroll.offset * 0.4 : 0;
    const totalOffset = (pathOffset.current + scrollInfluence + initialOffset) % 1;
    
    // Get position and tangent
    const position = curve.getPoint(totalOffset);
    const tangent = curve.getTangent(totalOffset);
    
    // Add floating motion
    const floatY = Math.sin(time * 2 + initialOffset * 10) * 0.1;
    const floatX = Math.cos(time * 1.5 + initialOffset * 8) * 0.05;
    
    position.y += floatY;
    position.x += floatX;
    
    groupRef.current.position.copy(position);
    
    // Conditional orientation based on billboard mode
    if (billboardMode === 'none') {
      const lookAtTarget = position.clone().add(tangent);
      groupRef.current.lookAt(lookAtTarget);
      groupRef.current.rotation.z += delta * 0.3;
    }
  });

  // Billboard configuration based on mode
  const getBillboardProps = useCallback(() => {
    switch (billboardMode) {
      case 'full':
        return { follow: true, lockX: false, lockY: false, lockZ: false };
      case 'horizontal':
        return { follow: true, lockX: true, lockY: false, lockZ: true };
      case 'vertical':
        return { follow: true, lockX: false, lockY: true, lockZ: false };
      default:
        return null;
    }
  }, [billboardMode]);

  // Enhanced materials with animation
  const materials = useMemo(() => ({
    shadow: {
      color: "#000000",
      metalness: 0.1,
      roughness: 0.9,
      opacity: hovered ? 0.4 : 0.3,
      transparent: true,
    },
    mid: {
      color: "#333333",
      metalness: 0.3,
      roughness: 0.7,
      opacity: hovered ? 0.7 : 0.6,
      transparent: true,
    },
    main: {
      color: color,
      metalness: hovered ? 0.9 : 0.7,
      roughness: hovered ? 0.1 : 0.2,
      emissive: color,
      emissiveIntensity: hovered ? 0.25 : 0.15,
      map: textureData,
      normalMap: textureData,
    },
    rim: {
      color: color,
      metalness: 1.0,
      roughness: 0.0,
      emissive: color,
      emissiveIntensity: hovered ? 0.5 : 0.3,
      opacity: hovered ? 0.9 : 0.8,
      transparent: true,
    }
  }), [color, textureData, hovered]);

  const textContent = (
    <Float
      speed={1.0}
      rotationIntensity={hovered ? 1.0 : 0.6}
      floatIntensity={hovered ? 0.4 : 0.2}
    >
      {/* Enhanced layered text with interaction */}
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Shadow layers */}
        <Text
          position={[0.08, -0.08, -0.15]}
          fontSize={responsiveFontSize * 1.02}
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_bold.typeface.json"
        >
          {text}
          <meshStandardMaterial {...materials.shadow} />
        </Text>

        <Text
          position={[0.04, -0.04, -0.08]}
          fontSize={responsiveFontSize * 1.01}
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_bold.typeface.json"
        >
          {text}
          <meshStandardMaterial {...materials.mid} />
        </Text>

        {/* Main text */}
        <Text
          fontSize={responsiveFontSize}
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_bold.typeface.json"
        >
          {text}
          <meshStandardMaterial {...materials.main} />
        </Text>

        {/* Rim light */}
        <Text
          position={[0, 0, 0.02]}
          fontSize={responsiveFontSize * 0.99}
          anchorX="center"
          anchorY="middle"
          font="/fonts/helvetiker_bold.typeface.json"
        >
          {text}
          <meshStandardMaterial {...materials.rim} />
        </Text>

        {/* Enhanced sparkles with conditional rendering */}
        <Sparkles
          count={hovered ? 100 : 60}
          scale={[responsiveFontSize * 3, responsiveFontSize * 3, responsiveFontSize * 3]}
          size={hovered ? 1.2 * responsiveFontSize : 0.8 * responsiveFontSize}
          speed={hovered ? 0.6 : 0.3}
          color={color}
          opacity={hovered ? 0.8 : 0.6}
        />

        {/* HTML overlay for debug info when hovered */}
        {hovered && (
          <Html
            position={[0, responsiveFontSize + 0.5, 0]}
            center
            distanceFactor={8}
            style={{
              color: color,
              fontSize: '12px',
              fontFamily: 'monospace',
              background: 'rgba(0,0,0,0.5)',
              padding: '4px 8px',
              borderRadius: '4px',
              pointerEvents: 'none'
            }}
          >
            {text} • Mode: {billboardMode}
          </Html>
        )}
      </group>
    </Float>
  );

  const billboardProps = getBillboardProps();

  return (
    <group ref={groupRef}>
      {billboardProps ? (
        <Billboard ref={billboardRef} {...billboardProps}>
          {textContent}
        </Billboard>
      ) : (
        textContent
      )}
    </group>
  );
});

CurveText.displayName = 'CurveText';

interface AnimatedTextProps {
  text: string;
  handlePos?: THREE.Vector3[];
  color?: string;
  fontSize?: number;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
  interactiveMode?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = React.memo(({
  text,
  handlePos = [
    new THREE.Vector3(-4, 2, 0),
    new THREE.Vector3(-2, -2, 2),
    new THREE.Vector3(2, 2, -2),
    new THREE.Vector3(4, -2, 0),
  ],
  color = '#00ffff',
  fontSize = 1.5,
  billboardMode = 'horizontal',
  interactiveMode = true
}) => {
  const { viewport } = useThree();
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);
  
  // Responsive curve scaling
  const scaledHandlePos = useMemo(() => {
    const scale = Math.min(viewport.width / 8, viewport.height / 8, 1);
    return handlePos.map(pos => pos.clone().multiplyScalar(scale));
  }, [handlePos, viewport.width, viewport.height]);

  // Create main curve
  const curve = useMemo(() => 
    new THREE.CatmullRomCurve3(scaledHandlePos, true, 'centripetal'), 
    [scaledHandlePos]
  );

  // Enhanced letter processing with interactive features
  const letterData = useMemo(() => {
    const letters = text.split('');
    const nonSpaceLetters = letters.filter(letter => letter !== ' ');
    const totalLetters = nonSpaceLetters.length;
    
    return letters.map((letter, index) => {
      if (letter === ' ') return { letter, skip: true };
      
      const letterSpacing = 1 / totalLetters;
      const letterOffset = index * letterSpacing;
      
      // Dynamic curve generation with variation
      const offsetPositions = scaledHandlePos.map((pos, posIndex) => {
        const variation = selectedLetter === index ? 1.5 : 1.0;
        const offset = new THREE.Vector3(
          Math.sin(index * 0.7) * 0.7 * variation,
          Math.cos(index * 0.5) * 0.5 * variation,
          Math.sin(index * 0.9) * 0.8 * variation
        );
        return pos.clone().add(offset);
      });
      
      return {
        letter,
        skip: false,
        curve: new THREE.CatmullRomCurve3(offsetPositions, true, 'centripetal'),
        offset: letterOffset,
        index,
      };
    });
  }, [text, scaledHandlePos, selectedLetter]);

  // Interactive curve visualization
  const curveVisualization = useMemo(() => {
    const points = curve.getPoints(40);
    return (
      <>
        {/* Main curve */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color={selectedLetter !== null ? color : "#222222"} 
            opacity={selectedLetter !== null ? 0.4 : 0.2} 
            transparent 
          />
        </line>
        
        {/* Control points */}
        {scaledHandlePos.map((pos, index) => (
          <Billboard key={index} follow={true} lockX={false} lockY={false} lockZ={true}>
            <mesh position={pos}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial 
                color={color} 
                opacity={0.3} 
                transparent 
              />
            </mesh>
          </Billboard>
        ))}
      </>
    );
  }, [curve, scaledHandlePos, selectedLetter, color]);

  const handleLetterInteraction = useCallback((index: number | null) => {
    if (interactiveMode) {
      setSelectedLetter(index);
    }
  }, [interactiveMode]);

  return (
    <>
      {letterData.map((data, index) => {
        if (data.skip) return null;
        
        return (
          <group
            key={`${data.letter}-${index}`}
            onPointerOver={() => handleLetterInteraction(data.index)}
            onPointerOut={() => handleLetterInteraction(null)}
          >
            <CurveText
              text={data.letter}
              curve={data.curve}
              color={selectedLetter === data.index ? '#ffffff' : color}
              fontSize={selectedLetter === data.index ? fontSize * 1.1 : fontSize}
              initialOffset={data.offset}
              billboardMode={billboardMode}
            />
          </group>
        );
      })}
      
      {curveVisualization}
    </>
  );
});

AnimatedText.displayName = 'AnimatedText';

interface SceneProps {
  text: string;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
  interactiveMode?: boolean;
}

const TextAnimation: React.FC<SceneProps> = ({ 
  text = "FLOWING",
  billboardMode = 'horizontal',
  interactiveMode = true
}) => {
  // Enhanced lighting with shadows
  const lightingSetup = useMemo(() => (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight 
        position={[-8, -8, -8]} 
        intensity={0.6} 
        color="#00ffff" 
        distance={25}
        decay={2}
      />
      <spotLight 
        position={[0, 12, 0]} 
        angle={0.5} 
        penumbra={0.9} 
        intensity={0.8}
        color="#ff00ff"
        distance={20}
        decay={2}
        castShadow
      />
      <rectAreaLight
        position={[0, 0, 5]}
        width={10}
        height={10}
        color="#ffffff"
        intensity={0.2}
      />
    </>
  ), []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e)',
      touchAction: 'manipulation',
      cursor: interactiveMode ? 'pointer' : 'default'
    }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        shadows
        frameloop="always"
      >
        {lightingSetup}
        
        <fog attach="fog" args={['#0a0a0a', 12, 30]} />
        
        <AnimatedText 
          text={text} 
          billboardMode={billboardMode}
          interactiveMode={interactiveMode}
        />
        
        {/* Enhanced background with Billboard particles */}
        <Billboard follow={true} lockX={false} lockY={false} lockZ={true}>
          <Sparkles
            count={150}
            scale={[20, 20, 20]}
            size={0.3}
            speed={0.05}
            color="#ffffff"
            opacity={0.15}
          />
        </Billboard>
        
        {/* Floating background elements */}
        {Array.from({ length: 5 }, (_, i) => (
          <Billboard key={i} follow={true} lockX={true} lockY={false} lockZ={false}>
            <mesh position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 10
            ]}>
              <ringGeometry args={[0.5, 0.8, 16]} />
              <meshBasicMaterial 
                color="#00ffff" 
                opacity={0.1} 
                transparent 
                side={THREE.DoubleSide}
              />
            </mesh>
          </Billboard>
        ))}
      </Canvas>
      
      {/* UI Controls */}
      {interactiveMode && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#ffffff',
          fontFamily: 'monospace',
          fontSize: '12px',
          background: 'rgba(0,0,0,0.5)',
          padding: '10px',
          borderRadius: '8px',
          pointerEvents: 'none'
        }}>
          Billboard Mode: {billboardMode}<br/>
          Interactive: {interactiveMode ? 'ON' : 'OFF'}<br/>
          Hover letters for effects
        </div>
      )}
    </div>
  );
};

export default TextAnimation;