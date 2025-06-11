import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced Billboard component with 15% more 3D depth
interface Enhanced3DBillboardProps {
  text: string;
  position?: [number, number, number];
  color?: string;
  fontSize?: number;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
  enhance3D?: number; // Enhancement factor (1.15 = 15% more 3D)
  depthLayers?: number;
  shadowIntensity?: number;
  volumetricEffect?: boolean;
  glowIntensity?: number;
  perspectiveShift?: number;
  letterSpacing?: number;
  fontFamily?: string;
  onHover?: (hovered: boolean) => void;
  animationSpeed?: number;
  metalness?: number;
  roughness?: number;
}

const Enhanced3DBillboard: React.FC<Enhanced3DBillboardProps> = ({
  text,
  position = [0, 0, 0],
  color = '#00ffff',
  fontSize = 1,
  billboardMode = 'horizontal',
  enhance3D = 1.15, // 15% enhancement by default
  depthLayers = 8,
  shadowIntensity = 0.6,
  volumetricEffect = true,
  glowIntensity = 0.8,
  perspectiveShift = 0.12,
  letterSpacing = 0.05,
  fontFamily = "/fonts/helvetiker_bold.typeface.json",
  onHover,
  animationSpeed = 1.0,
  metalness = 0.8,
  roughness = 0.2
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const billboardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport, camera } = useThree();

  // Enhanced responsive sizing with 3D factor
  const enhanced3DSize = useMemo(() => {
    const baseSize = fontSize;
    const responsiveScale = Math.min(viewport.width / 10, viewport.height / 10, 1.5);
    const hoverScale = hovered ? 1.1 : 1.0;
    const depthScale = enhance3D;
    return baseSize * responsiveScale * hoverScale * depthScale;
  }, [fontSize, viewport.width, viewport.height, hovered, enhance3D]);

  // Enhanced 3D texture with depth mapping
  const enhanced3DTexture = useMemo(() => {
    const size = 64; // Higher resolution for better 3D effect
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    const imageData = context.createImageData(size, size);
    const data = imageData.data;
    
    // Create depth-based texture pattern
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % size;
      const y = Math.floor((i / 4) / size);
      
      // Multiple noise layers for enhanced depth
      const centerX = size / 2;
      const centerY = size / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const normalizedDistance = distance / (size / 2);
      
      // Create depth gradient
      const depthNoise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.3 + 0.7;
      const radialDepth = (1 - normalizedDistance) * 0.5 + 0.5;
      const combined = (depthNoise + radialDepth) / 2;
      
      const value = combined * 255 * enhance3D;
      data[i] = Math.min(255, value);
      data[i + 1] = Math.min(255, value * 0.9);
      data[i + 2] = Math.min(255, value * 0.8);
      data[i + 3] = 255;
    }
    
    context.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;
    return texture;
  }, [enhance3D]);

  // Enhanced normal map for 3D depth
  const depthNormalMap = useMemo(() => {
    const size = 32;
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
      
      // Generate normal map for enhanced 3D effect
      const normalX = (Math.sin(x * 0.2) * 0.5 + 0.5) * 255;
      const normalY = (Math.cos(y * 0.2) * 0.5 + 0.5) * 255;
      const normalZ = 255 * enhance3D; // Enhanced Z component
      
      data[i] = normalX;
      data[i + 1] = normalY;
      data[i + 2] = normalZ;
      data[i + 3] = 255;
    }
    
    context.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [enhance3D]);

  // Animation with enhanced 3D movement
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime * animationSpeed;
    
    // Enhanced 3D floating motion
    const floatY = Math.sin(time * 1.2) * 0.08 * enhance3D;
    const floatX = Math.cos(time * 0.8) * 0.04 * enhance3D;
    const floatZ = Math.sin(time * 0.6) * 0.03 * enhance3D;
    
    // Apply enhanced position with perspective shift
    const basePosition = new THREE.Vector3(...position);
    basePosition.x += floatX + (hovered ? perspectiveShift : 0);
    basePosition.y += floatY;
    basePosition.z += floatZ + (hovered ? perspectiveShift * 0.5 : 0);
    
    groupRef.current.position.copy(basePosition);
    
    // Enhanced rotation for 3D effect
    if (billboardMode === 'none') {
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.05 * enhance3D;
    }
  });

  // Billboard configuration
  const getBillboardProps = () => {
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
  };

  // Enhanced 3D materials with depth
  const enhanced3DMaterials = useMemo(() => {
    const baseEmissiveIntensity = glowIntensity * (hovered ? 1.5 : 1.0);
    
    return {
      // Deep shadow layers for enhanced depth
      deepShadow: {
        color: "#000000",
        metalness: 0.1,
        roughness: 0.9,
        opacity: shadowIntensity * 0.8,
        transparent: true,
      },
      mediumShadow: {
        color: "#111111",
        metalness: 0.2,
        roughness: 0.8,
        opacity: shadowIntensity * 0.6,
        transparent: true,
      },
      lightShadow: {
        color: "#222222",
        metalness: 0.3,
        roughness: 0.7,
        opacity: shadowIntensity * 0.4,
        transparent: true,
      },
      // Main text with enhanced 3D properties
      main: {
        color: color,
        metalness: metalness * enhance3D,
        roughness: roughness / enhance3D,
        emissive: color,
        emissiveIntensity: baseEmissiveIntensity,
        map: enhanced3DTexture,
        normalMap: depthNormalMap,
        normalScale: new THREE.Vector2(enhance3D, enhance3D),
      },
      // Enhanced rim lighting
      rim: {
        color: color,
        metalness: 1.0,
        roughness: 0.0,
        emissive: color,
        emissiveIntensity: baseEmissiveIntensity * 1.5,
        opacity: hovered ? 0.9 : 0.7,
        transparent: true,
      },
      // Volumetric glow effect
      volumetric: {
        color: color,
        metalness: 0.0,
        roughness: 1.0,
        emissive: color,
        emissiveIntensity: baseEmissiveIntensity * 2,
        opacity: 0.15,
        transparent: true,
        side: THREE.BackSide,
      }
    };
  }, [color, enhanced3DTexture, depthNormalMap, enhance3D, hovered, glowIntensity, shadowIntensity, metalness, roughness]);

  // Handle hover interactions
  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
    onHover?.(isHovered);
  };

  // Generate depth layers for enhanced 3D effect
  const renderDepthLayers = () => {
    const layers = [];
    
    // Deep shadow layers
    for (let i = 0; i < Math.floor(depthLayers * 0.4); i++) {
      const depth = (i + 1) * 0.08 * enhance3D;
      const opacity = shadowIntensity * (1 - i / depthLayers);
      layers.push(
        <Text
          key={`shadow-${i}`}
          position={[depth, -depth, -depth]}
          fontSize={enhanced3DSize * (1 + i * 0.02)}
          anchorX="center"
          anchorY="middle"
          font={fontFamily}
          letterSpacing={letterSpacing}
        >
          {text}
          <meshStandardMaterial
            color="#000000"
            metalness={0.1}
            roughness={0.9}
            opacity={opacity}
            transparent
          />
        </Text>
      );
    }
    
    // Mid-tone layers
    for (let i = 0; i < Math.floor(depthLayers * 0.3); i++) {
      const depth = i * 0.04 * enhance3D;
      const opacity = 0.6 * (1 - i / depthLayers);
      layers.push(
        <Text
          key={`mid-${i}`}
          position={[depth * 0.7, -depth * 0.7, -depth]}
          fontSize={enhanced3DSize * (1 + i * 0.01)}
          anchorX="center"
          anchorY="middle"
          font={fontFamily}
          letterSpacing={letterSpacing}
        >
          {text}
          <meshStandardMaterial
            color="#333333"
            metalness={0.3}
            roughness={0.7}
            opacity={opacity}
            transparent
          />
        </Text>
      );
    }
    
    return layers;
  };

  const textContent = (
    <Float
      speed={animationSpeed}
      rotationIntensity={hovered ? 1.2 : 0.8}
      floatIntensity={hovered ? 0.6 : 0.4}
    >
      <group
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
      >
        {/* Depth layers for enhanced 3D effect */}
        {renderDepthLayers()}

        {/* Volumetric background layer */}
        {volumetricEffect && (
          <Text
            position={[0, 0, -0.1]}
            fontSize={enhanced3DSize * 1.3}
            anchorX="center"
            anchorY="middle"
            font={fontFamily}
            letterSpacing={letterSpacing}
          >
            {text}
            <meshStandardMaterial {...enhanced3DMaterials.volumetric} />
          </Text>
        )}

        {/* Main text with enhanced 3D properties */}
        <Text
          fontSize={enhanced3DSize}
          anchorX="center"
          anchorY="middle"
          font={fontFamily}
          letterSpacing={letterSpacing}
        >
          {text}
          <meshStandardMaterial {...enhanced3DMaterials.main} />
        </Text>

        {/* Enhanced rim lighting */}
        <Text
          position={[0, 0, 0.05 * enhance3D]}
          fontSize={enhanced3DSize * 0.98}
          anchorX="center"
          anchorY="middle"
          font={fontFamily}
          letterSpacing={letterSpacing}
        >
          {text}
          <meshStandardMaterial {...enhanced3DMaterials.rim} />
        </Text>

        {/* Enhanced sparkles with 3D positioning */}
        <Sparkles
          count={hovered ? 15 : 10}
          scale={[enhanced3DSize * 4, enhanced3DSize * 4, enhanced3DSize * 2 * enhance3D]}
          size={hovered ? 1.5 * enhanced3DSize : enhanced3DSize}
          speed={hovered ? 0.8 : 0.4}
          color={color}
          opacity={hovered ? 0.9 : 0.7}
        />

        {/* Enhanced debug info */}
        {hovered && (
          <Html
            position={[0, enhanced3DSize + 1, 0]}
            center
            distanceFactor={8}
            style={{
              color: '#ffffff',
              fontSize: '10px',
              fontFamily: 'Monaco, Consolas, monospace',
              background: `linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,40,0.95))`,
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${color}`,
              boxShadow: `0 0 15px ${color}60`,
              pointerEvents: 'none',
              minWidth: '200px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ color: color, fontWeight: 'bold', marginBottom: '4px' }}>
              🎭 3D ENHANCED: "{text}"
            </div>
            <div style={{ fontSize: '9px', lineHeight: '1.2' }}>
              Enhancement: {((enhance3D - 1) * 100).toFixed(0)}% more 3D<br/>
              Depth Layers: {depthLayers}<br/>
              Size Scale: {enhanced3DSize.toFixed(2)}<br/>
              Billboard: {billboardMode}<br/>
              Volumetric: {volumetricEffect ? 'ON' : 'OFF'}
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
};

export default Enhanced3DBillboard;