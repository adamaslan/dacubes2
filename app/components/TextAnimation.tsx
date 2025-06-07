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
    const size = 26;
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
    
    // Reduced movement speed by 75% for more stable letter positioning
    pathOffset.current += delta * (0.02 + Math.sin(time * 0.3) * 0.005);
    
    const scrollInfluence = scroll ? scroll.offset * 0.4 : 0;
    const totalOffset = (pathOffset.current + scrollInfluence + initialOffset) % 1;
    
    // Get position and tangent
    const position = curve.getPoint(totalOffset);
    const tangent = curve.getTangent(totalOffset);
    
    // Reduced floating motion by 50% for more stability
    const floatY = Math.sin(time * 1.2 + initialOffset * 10) * 0.05;
    const floatX = Math.cos(time * 0.8 + initialOffset * 8) * 0.025;
    
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
          count={hovered ? 10 : 6}
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

// Background Effects Components
interface BackgroundEffectProps {
  intensity?: number;
  color?: string;
  secondaryColor?: string;
}

// Matrix Rain Effect
const MatrixRain: React.FC<BackgroundEffectProps> = ({ 
  intensity = 1, 
  color = '#00ff00',
  secondaryColor = '#004400'
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  const count = Math.floor(50 * intensity);
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * viewport.width * 2,
        Math.random() * viewport.height * 2,
        (Math.random() - 0.5) * 20
      ]);
    }
    return pos;
  }, [count, viewport]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    positions.forEach((pos, i) => {
      const matrix = new THREE.Matrix4();
      pos[1] -= 0.1 * intensity;
      if (pos[1] < -viewport.height) pos[1] = viewport.height;
      
      matrix.setPosition(pos[0], pos[1], pos[2]);
      matrix.scale(new THREE.Vector3(0.1, Math.random() * 2 + 1, 0.1));
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.1, 1, 0.1]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Neural Network Effect
const NeuralNetwork: React.FC<BackgroundEffectProps> = ({ 
  intensity = 1, 
  color = '#00ffff',
  secondaryColor = '#ff00ff'
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  const nodeCount = Math.floor(20 * intensity);
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * viewport.width * 1.5,
        (Math.random() - 0.5) * viewport.height * 1.5,
        (Math.random() - 0.5) * 15
      ),
      connections: []
    }));
  }, [nodeCount, viewport]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    nodes.forEach((node, i) => {
      const pulse = Math.sin(time * 2 + i) * 0.5 + 0.5;
      node.position.x += Math.sin(time * 0.5 + i) * 0.01;
      node.position.y += Math.cos(time * 0.3 + i) * 0.01;
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.position}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
          {nodes.slice(i + 1).map((otherNode, j) => {
            const distance = node.position.distanceTo(otherNode.position);
            if (distance < 3) {
              const points = [node.position, otherNode.position];
              return (
                <line key={`${i}-${j}`}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={points.length}
                      array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial 
                    color={secondaryColor} 
                    opacity={0.3 * (1 - distance / 3)} 
                    transparent 
                  />
                </line>
              );
            }
            return null;
          })}
        </group>
      ))}
    </group>
  );
};

// Geometric Waves Effect
const GeometricWaves: React.FC<BackgroundEffectProps> = ({ 
  intensity = 1, 
  color = '#ff6b6b',
  secondaryColor = '#4ecdc4'
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  const count = Math.floor(100 * intensity);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const x = (i % 10 - 4.5) * 2;
      const z = (Math.floor(i / 10) - 5) * 2;
      const y = Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time) * 2;
      
      dummy.position.set(x, y, z);
      dummy.rotation.x = time + i * 0.1;
      dummy.rotation.y = time * 0.5 + i * 0.05;
      dummy.scale.setScalar(0.5 + Math.sin(time + i) * 0.3);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[0.2]} />
      <meshPhongMaterial color={color} transparent opacity={0.7} />
    </instancedMesh>
  );
};

// Particle Flow Effect
const ParticleFlow: React.FC<BackgroundEffectProps> = ({ 
  intensity = 1, 
  color = '#ffd93d',
  secondaryColor = '#ff6b9d'
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  const particleCount = Math.floor(1000 * intensity);
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return [pos, vel];
  }, [particleCount, viewport]);

  useFrame(() => {
    if (!pointsRef.current) return;
    
    const positionAttribute = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Reset particles that go too far
      if (Math.abs(positions[i * 3]) > viewport.width) {
        positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      }
      if (Math.abs(positions[i * 3 + 1]) > viewport.height) {
        positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      }
    }
    
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Holographic Grid Effect
const HolographicGrid: React.FC<BackgroundEffectProps> = ({ 
  intensity = 1, 
  color = '#00ffff',
  secondaryColor = '#ff00ff'
}) => {
  const gridRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  const gridSize = Math.floor(20 * intensity);
  
  useFrame((state) => {
    if (!gridRef.current) return;
    
    const time = state.clock.elapsedTime;
    gridRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    gridRef.current.rotation.y = time * 0.1;
    gridRef.current.position.y = Math.sin(time * 0.5) * 2;
  });

  return (
    <group ref={gridRef}>
      {/* Horizontal lines */}
      {Array.from({ length: gridSize }, (_, i) => (
        <line key={`h-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                -viewport.width, (i - gridSize/2) * 0.5, -5,
                viewport.width, (i - gridSize/2) * 0.5, -5
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} opacity={0.3} transparent />
        </line>
      ))}
      
      {/* Vertical lines */}
      {Array.from({ length: gridSize }, (_, i) => (
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                (i - gridSize/2) * 0.5, -viewport.height, -5,
                (i - gridSize/2) * 0.5, viewport.height, -5
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={secondaryColor} opacity={0.3} transparent />
        </line>
      ))}
    </group>
  );
};

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
    new THREE.Vector3(-4, 1, 0),
    new THREE.Vector3(-2, -1, 0),
    new THREE.Vector3(2, 1, 0),
    new THREE.Vector3(4, -1, 0),
  ],
  color = '#00ffff',
  fontSize = 1.5,
  billboardMode = 'horizontal',
  interactiveMode = true
}) => {
  const { viewport } = useThree();
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);
  
  const scaledHandlePos = useMemo(() => {
    const scale = Math.min(viewport.width / 8, viewport.height / 8, 1);
    return handlePos.map(pos => pos.clone().multiplyScalar(scale));
  }, [handlePos, viewport.width, viewport.height]);

  const curve = useMemo(() => 
    new THREE.CatmullRomCurve3(scaledHandlePos, true, 'centripetal'), 
    [scaledHandlePos]
  );

  const letterData = useMemo(() => {
    const letters = text.split('');
    const nonSpaceLetters = letters.filter(letter => letter !== ' ');
    const totalLetters = nonSpaceLetters.length;
    
    return letters.map((letter, index) => {
      if (letter === ' ') return { letter, skip: true };
      
      const letterSpacing = .375 / totalLetters;
      const letterOffset = (index * letterSpacing) % 1;
      
      const offsetPositions = scaledHandlePos.map((pos, posIndex) => {
        const variation = selectedLetter === index ? 1.1 : 1.0;
        const offset = new THREE.Vector3(
          Math.sin(index * 0.3) * 0.25 * variation,
          Math.cos(index * 0.2) * 0.2 * variation,
          0.01 * variation
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

  const curveVisualization = useMemo(() => {
    const points = curve.getPoints(40);
    return (
      <>
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
            onPointerOver={() => handleLetterInteraction(data.index ?? null)}
            onPointerOut={() => handleLetterInteraction(null)}
          >
            <CurveText
              text={data.letter}
              curve={data.curve as THREE.CatmullRomCurve3}
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

// Background Effect Types
export type BackgroundEffect = 
  | 'sparkles' 
  | 'matrix' 
  | 'neural' 
  | 'waves' 
  | 'particles' 
  | 'grid' 
  | 'none';

interface SceneProps {
  text: string;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
  interactiveMode?: boolean;
  backgroundEffect?: BackgroundEffect;
  backgroundIntensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

const TextAnimation: React.FC<SceneProps> = ({ 
  text = "FLOWING",
  billboardMode = 'horizontal',
  interactiveMode = true,
  backgroundEffect = 'neural',
  backgroundIntensity = 1,
  primaryColor = '#00ffff',
  secondaryColor = '#ff00ff'
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
        color={primaryColor} 
        distance={25}
        decay={2}
      />
      <spotLight 
        position={[0, 12, 0]} 
        angle={0.5} 
        penumbra={0.9} 
        intensity={0.8}
        color={secondaryColor}
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
  ), [primaryColor, secondaryColor]);

  // Background effect renderer
  const renderBackgroundEffect = () => {
    const props = {
      intensity: backgroundIntensity,
      color: primaryColor,
      secondaryColor: secondaryColor
    };

    switch (backgroundEffect) {
      case 'matrix':
        return <MatrixRain {...props} />;
      case 'neural':
        return <NeuralNetwork {...props} />;
      case 'waves':
        return <GeometricWaves {...props} />;
      case 'particles':
        return <ParticleFlow {...props} />;
      case 'grid':
        return <HolographicGrid {...props} />;
      case 'sparkles':
        return (
          <Billboard follow={true} lockX={false} lockY={false} lockZ={true}>
            <Sparkles
              count={50 * backgroundIntensity}
              scale={[20, 20, 20]}
              size={0.7}
              speed={0.05}
              color={primaryColor}
              opacity={0.15}
            />
            <Sparkles
              count={50 * backgroundIntensity}
              scale={[20, 20, 20]}
              size={0.65}
              speed={0.04}
              color={secondaryColor}
              opacity={0.15}
            />
          </Billboard>
        );
      case 'none':
      default:
        return null;
    }
  };

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
          color={primaryColor}
        />
        
        {/* Dynamic background effect */}
        {renderBackgroundEffect()}
        
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
          Background: {backgroundEffect}<br/>
          Intensity: {backgroundIntensity}<br/>
          Interactive: {interactiveMode ? 'ON' : 'OFF'}<br/>
          Hover letters for effects
        </div>
      )}
    </div>
  );
};

export default TextAnimation;