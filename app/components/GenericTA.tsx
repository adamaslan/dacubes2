// === BACKGROUND EFFECTS ===
// components/3d/effects/BackgroundEffects.tsx

import React, { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles, useScroll, Billboard, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type BackgroundEffect = 'sparkles' | 'neural' | 'particles' | 'grid' | 'none';

interface BackgroundEffectsProps {
  effect: BackgroundEffect;
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  config?: Record<string, any>;
}

// Neural Network Effect Component
export const NeuralNetwork: React.FC<{
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
}> = ({ intensity = 1, primaryColor = '#00ffff', secondaryColor = '#ff00ff' }) => {
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
    }));
  }, [nodeCount, viewport]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    nodes.forEach((node, i) => {
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
            <meshBasicMaterial color={primaryColor} />
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

// Particle Flow Effect Component
export const ParticleFlow: React.FC<{
  intensity?: number;
  primaryColor?: string;
  config?: { speed?: number; size?: number; opacity?: number };
}> = ({ intensity = 1, primaryColor = '#ffd93d', config = {} }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { speed = 0.02, size = 0.05, opacity = 0.6 } = config;
  const particleCount = Math.floor(500 * intensity);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      vel[i * 3] = (Math.random() - 0.5) * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * speed;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }

    return [pos, vel];
  }, [particleCount, viewport, speed]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(positions[i * 3]) > viewport.width) {
        positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
        velocities[i * 3] = (Math.random() - 0.5) * speed;
      }
      if (Math.abs(positions[i * 3 + 1]) > viewport.height) {
        positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
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
        color={primaryColor}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Grid Effect Component
export const GridEffect: React.FC<{
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  config?: { size?: number; divisions?: number; opacity?: number };
}> = ({ intensity = 1, primaryColor = '#00ffff', secondaryColor = '#ffffff', config = {} }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const { size = 20, divisions = 20, opacity = 0.3 } = config;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Main grid */}
      <gridHelper
        args={[size * intensity, divisions * intensity, primaryColor, secondaryColor]}
        material-opacity={opacity}
        material-transparent={true}
      />
      
      {/* Vertical grid for 3D effect */}
      <gridHelper
        args={[size * intensity, divisions * intensity, primaryColor, secondaryColor]}
        rotation={[Math.PI / 2, 0, 0]}
        material-opacity={opacity * 0.5}
        material-transparent={true}
      />
      
      {/* Animated grid lines */}
      <mesh>
        <boxGeometry args={[size * intensity * 0.1, 0.01, size * intensity * 0.1]} />
        <meshBasicMaterial
          color={primaryColor}
          opacity={opacity * 0.8}
          transparent
          wireframe
        />
      </mesh>
    </group>
  );
};

// Main Background Effects Component
export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({
  effect,
  intensity = 1,
  primaryColor = '#00ffff',
  secondaryColor = '#ff00ff',
  config = {}
}) => {
  const renderEffect = () => {
    const props = { intensity, primaryColor, secondaryColor, config };

    switch (effect) {
      case 'neural':
        return <NeuralNetwork {...props} />;
      case 'particles':
        return <ParticleFlow {...props} />;
      case 'grid':
        return <GridEffect {...props} />;
      case 'sparkles':
        return (
          <Billboard follow={true} lockX={false} lockY={false} lockZ={true}>
            <Sparkles
              count={50 * intensity}
              scale={[20, 20, 20]}
              size={0.7}
              speed={0.05}
              color={primaryColor}
              opacity={0.15}
            />
          </Billboard>
        );
      case 'none':
      default:
        return null;
    }
  };

  return <>{renderEffect()}</>;
};

// === LIGHTING SYSTEM ===
// components/3d/lighting/LightingRig.tsx

interface LightingRigProps {
  preset?: 'default' | 'dramatic' | 'soft' | 'neon';
  primaryColor?: string;
  secondaryColor?: string;
  intensity?: number;
}

export const LightingRig: React.FC<LightingRigProps> = ({
  preset = 'default',
  primaryColor = '#ffffff',
  secondaryColor = '#00ffff',
  intensity = 1
}) => {
  const getLightingSetup = () => {
    const baseIntensity = intensity;
    
    switch (preset) {
      case 'dramatic':
        return (
          <>
            <ambientLight intensity={0.1 * baseIntensity} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5 * baseIntensity}
              color="#ffffff"
              castShadow
            />
            <spotLight
              position={[0, 15, 0]}
              angle={0.3}
              penumbra={0.8}
              intensity={1.2 * baseIntensity}
              color={primaryColor}
              distance={25}
              decay={2}
            />
          </>
        );
      
      case 'soft':
        return (
          <>
            <ambientLight intensity={0.6 * baseIntensity} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.8 * baseIntensity}
              color="#ffffff"
            />
            <pointLight
              position={[-5, -5, -5]}
              intensity={0.4 * baseIntensity}
              color={secondaryColor}
              distance={15}
              decay={2}
            />
          </>
        );
      
      case 'neon':
        return (
          <>
            <ambientLight intensity={0.2 * baseIntensity} />
            <pointLight
              position={[-8, -8, -8]}
              intensity={0.8 * baseIntensity}
              color={primaryColor}
              distance={25}
              decay={2}
            />
            <pointLight
              position={[8, 8, 8]}
              intensity={0.8 * baseIntensity}
              color={secondaryColor}
              distance={25}
              decay={2}
            />
            <spotLight
              position={[0, 12, 0]}
              angle={0.5}
              penumbra={0.9}
              intensity={0.6 * baseIntensity}
              color={primaryColor}
              distance={20}
              decay={2}
            />
          </>
        );
      
      case 'default':
      default:
        return (
          <>
            <ambientLight intensity={0.3 * baseIntensity} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2 * baseIntensity}
              color="#ffffff"
            />
            <pointLight
              position={[-8, -8, -8]}
              intensity={0.6 * baseIntensity}
              color={primaryColor}
              distance={25}
              decay={2}
            />
            <spotLight
              position={[0, 12, 0]}
              angle={0.5}
              penumbra={0.9}
              intensity={0.8 * baseIntensity}
              color={secondaryColor}
              distance={20}
              decay={2}
            />
          </>
        );
    }
  };

  return <>{getLightingSetup()}</>;
};

// === MAIN SCENE WRAPPER ===
// components/3d/Scene3D.tsx

interface Scene3DProps {
  children?: React.ReactNode;
  backgroundEffect?: BackgroundEffect;
  backgroundIntensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  lightingPreset?: 'default' | 'dramatic' | 'soft' | 'neon';
  cameraPosition?: [number, number, number];
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  orbitControls?: boolean;
  style?: React.CSSProperties;
  effectConfig?: Record<string, any>;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  backgroundEffect = 'none',
  backgroundIntensity = 1,
  primaryColor = '#00ffff',
  secondaryColor = '#ff00ff',
  lightingPreset = 'default',
  cameraPosition = [0, 0, 10],
  fogColor = '#0a0a0a',
  fogNear = 12,
  fogFar = 30,
  orbitControls = true,
  style = {},
  effectConfig = {}
}) => {
  const defaultStyle = {
    width: '100%',
    height: '75vh',
    background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e)',
    touchAction: 'manipulation',
    cursor: 'pointer',
    ...style
  };

  return (
    <div style={defaultStyle}>
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop="always"
      >
        <LightingRig
          preset={lightingPreset}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />

        <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

        {children}

        <BackgroundEffects
          effect={backgroundEffect}
          intensity={backgroundIntensity}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          config={effectConfig}
        />

        {orbitControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
          />
        )}
      </Canvas>
    </div>
  );
};

// === SPHERE COMPONENT ===
// components/3d/objects/Sphere1.tsx

export const Sphere1: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [angle, setAngle] = useState(0);
  
  useFrame(() => {
    setAngle(prev => prev + 0.01);
    const x = Math.cos(angle) * 4;
    const z = Math.sin(angle) * 4;
    if (sphereRef.current) {
      sphereRef.current.position.set(x, 0, z);
      sphereRef.current.rotateX(0.01);
    }
  });
  
  return (
    <mesh ref={sphereRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial metalness={1} roughness={0} />
      <Text
        position={[0, 0, 1.1]}
        color="hotpink"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        Adam Aslan
      </Text>
    </mesh>
  );
};

// === ANIMATED TEXT COMPONENT ===
// components/3d/text/AnimatedText.tsx

interface AnimatedTextProps {
  text: string;
  handlePos?: THREE.Vector3[];
  color?: string;
  fontSize?: number;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
  interactiveMode?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = React.memo(({
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

      const letterSpacing = 0.375 / totalLetters;
      const letterOffset = (index * letterSpacing) % 1;

      const offsetPositions = scaledHandlePos.map((pos) => {
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
              letterIndex={index}
            />
          </group>
        );
      })}

      {curveVisualization}
    </>
  );
});

AnimatedText.displayName = 'AnimatedText';

// === CURVE TEXT COMPONENT ===
// components/3d/text/CurveText.tsx

interface CurveTextProps {
  text: string;
  curve: THREE.CatmullRomCurve3;
  color?: string;
  fontSize?: number;
  initialOffset?: number;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
  letterIndex?: number;
}

export const CurveText: React.FC<CurveTextProps> = React.memo(({
  text,
  curve,
  color = 'white',
  fontSize = 1,
  initialOffset = 0,
  billboardMode = 'horizontal',
  letterIndex = 0,
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

  // Enhanced texture creation
  const textureData = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    if (!context) return null;

    const imageData = context.createImageData(size, size);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % size;
      const y = Math.floor((i / 4) / size);

      const noise1 = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + 0.5;
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

  // Animation with debugging
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const baseSpeed = 0.02;
    const oscillation = Math.sin(time * 0.3) * 0.005;
    const currentSpeed = baseSpeed + oscillation;
    pathOffset.current += delta * currentSpeed;

    const scrollInfluence = scroll ? scroll.offset * 0.4 : 0;
    const totalOffset = (pathOffset.current + scrollInfluence + initialOffset) % 1;

    const position = curve.getPoint(totalOffset);
    const tangent = curve.getTangent(totalOffset);

    const floatY = Math.sin(time * 1.2 + initialOffset * 10) * 0.05;
    const floatX = Math.cos(time * 0.8 + initialOffset * 8) * 0.025;

    position.y += floatY;
    position.x += floatX;

    groupRef.current.position.copy(position);

    if (billboardMode === 'none') {
      const lookAtTarget = position.clone().add(tangent);
      groupRef.current.lookAt(lookAtTarget);
      groupRef.current.rotation.z += delta * 0.3;
    }
  });

  // Billboard configuration
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

  // Enhanced materials
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
        >
          {text}
          <meshStandardMaterial {...materials.shadow} />
        </Text>

        <Text
          position={[0.04, -0.04, -0.08]}
          fontSize={responsiveFontSize * 1.01}
          anchorX="center"
          anchorY="middle"
        >
          {text}
          <meshStandardMaterial {...materials.mid} />
        </Text>

        {/* Main text */}
        <Text
          fontSize={responsiveFontSize}
          anchorX="center"
          anchorY="middle"
        >
          {text}
          <meshStandardMaterial {...materials.main} />
        </Text>

        {/* Rim light */}
        <Text
          position={[0, 0, 0.03]}
          fontSize={responsiveFontSize * 0.99}
          anchorX="center"
          anchorY="middle"
        >
          {text}
          <meshStandardMaterial {...materials.rim} />
        </Text>

        {/* Sparkles */}
        <Sparkles
          count={hovered ? 10 : 6}
          scale={[responsiveFontSize * 3, responsiveFontSize * 3, responsiveFontSize * 3]}
          size={hovered ? 1.2 * responsiveFontSize : 0.8 * responsiveFontSize}
          speed={hovered ? 0.6 : 0.3}
          color={color}
          opacity={hovered ? 0.8 : 0.6}
        />

        {/* Debug info on hover */}
        {hovered && (
          <Html
            position={[0, responsiveFontSize + 0.8, 0]}
            center
            distanceFactor={6}
            style={{
              color: '#ffffff',
              fontSize: '12px',
              fontFamily: 'monospace',
              background: 'rgba(0,0,0,0.8)',
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${color}`,
              pointerEvents: 'none',
            }}
          >
            <div>
              Letter: "{text}" #{letterIndex}
              <br />
              Scale: {responsiveFontSize.toFixed(2)}
              <br />
              Hovered: {hovered ? 'Yes' : 'No'}
            </div>
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

// === USAGE EXAMPLES ===

// Example 1: Simple TextAnimation wrapper
export const TextAnimation: React.FC<{
  text: string;
  backgroundEffect?: BackgroundEffect;
  backgroundIntensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
  interactiveMode?: boolean;
}> = ({
  text = "FLOWING",
  backgroundEffect = 'neural',
  backgroundIntensity = 1,
  primaryColor = '#00ffff',
  secondaryColor = '#ff00ff',
  billboardMode = 'horizontal',
  interactiveMode = true
}) => {
  return (
    <Scene3D
      backgroundEffect={backgroundEffect}
      backgroundIntensity={backgroundIntensity}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      lightingPreset="neon"
    >
      <AnimatedText
        text={text}
        billboardMode={billboardMode}
        interactiveMode={interactiveMode}
        color={primaryColor}
      />
      <Sphere1 />
    </Scene3D>
  );
};

// Example 2: Just background effects
export const BackgroundEffectDemo: React.FC<{
  effect: BackgroundEffect;
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
}> = ({ effect, intensity = 1, primaryColor = '#00ffff', secondaryColor = '#ff00ff' }) => {
  return (
    <Scene3D
      backgroundEffect={effect}
      backgroundIntensity={intensity}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      lightingPreset="soft"
      style={{ height: '400px' }}
    >
      {/* Just the background effect, no other content */}
    </Scene3D>
  );
};