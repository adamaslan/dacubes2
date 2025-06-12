import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Enhanced3DBillboardProps {
  text: string;
  position?: [number, number, number];
  color?: string;
  fontSize?: number;
  billboardMode?: 'full' | 'horizontal' | 'vertical' | 'none';
  enhance3D?: number;
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
  enhance3D = 1.15,
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
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();

  const enhanced3DSize = useMemo(() => {
    const responsiveScale = Math.min(viewport.width / 10, viewport.height / 10, 1.5);
    const hoverScale = hovered ? 1.1 : 1.0;
    return fontSize * responsiveScale * hoverScale * enhance3D;
  }, [fontSize, viewport.width, viewport.height, hovered, enhance3D]);

  // Combined texture generation for both diffuse and normal
  const enhanced3DTextures = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    if (!context) return { diffuse: null, normal: null };
    
    // Diffuse texture
    const imageData = context.createImageData(size, size);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % size;
      const y = Math.floor((i / 4) / size);
      
      const centerX = size / 2;
      const centerY = size / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const normalizedDistance = distance / (size / 2);
      
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
    const diffuseTexture = new THREE.CanvasTexture(canvas);
    
    // Normal map (simplified)
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = 32;
    normalCanvas.height = 32;
    const normalContext = normalCanvas.getContext('2d');
    
    if (normalContext) {
      const normalData = normalContext.createImageData(32, 32);
      const nData = normalData.data;
      
      for (let i = 0; i < nData.length; i += 4) {
        const x = (i / 4) % 32;
        const y = Math.floor((i / 4) / 32);
        
        nData[i] = (Math.sin(x * 0.2) * 0.5 + 0.5) * 255;
        nData[i + 1] = (Math.cos(y * 0.2) * 0.5 + 0.5) * 255;
        nData[i + 2] = 255 * enhance3D;
        nData[i + 3] = 255;
      }
      
      normalContext.putImageData(normalData, 0, 0);
    }
    
    const normalTexture = new THREE.CanvasTexture(normalCanvas);
    
    return { diffuse: diffuseTexture, normal: normalTexture };
  }, [enhance3D]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime * animationSpeed;
    
    const floatY = Math.sin(time * 1.2) * 0.08 * enhance3D;
    const floatX = Math.cos(time * 0.8) * 0.04 * enhance3D;
    const floatZ = Math.sin(time * 0.6) * 0.03 * enhance3D;
    
    const basePosition = new THREE.Vector3(...position);
    basePosition.x += floatX + (hovered ? perspectiveShift : 0);
    basePosition.y += floatY;
    basePosition.z += floatZ + (hovered ? perspectiveShift * 0.5 : 0);
    
    groupRef.current.position.copy(basePosition);
    
    if (billboardMode === 'none') {
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.05 * enhance3D;
    }
  });

  const getBillboardProps = () => {
    switch (billboardMode) {
      case 'full': return { follow: true, lockX: false, lockY: false, lockZ: false };
      case 'horizontal': return { follow: true, lockX: true, lockY: false, lockZ: true };
      case 'vertical': return { follow: true, lockX: false, lockY: true, lockZ: false };
      default: return null;
    }
  };

  const baseEmissiveIntensity = glowIntensity * (hovered ? 1.5 : 1.0);
  
  const materials = {
    main: {
      color: color,
      metalness: metalness * enhance3D,
      roughness: roughness / enhance3D,
      emissive: color,
      emissiveIntensity: baseEmissiveIntensity,
      map: enhanced3DTextures.diffuse,
      normalMap: enhanced3DTextures.normal,
      normalScale: new THREE.Vector2(enhance3D, enhance3D),
    },
    volumetric: {
      color: color,
      emissive: color,
      emissiveIntensity: baseEmissiveIntensity * 2,
      opacity: 0.15,
      transparent: true,
      side: THREE.BackSide,
    }
  };

  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered);
    onHover?.(isHovered);
  };

  // Simplified depth layers
  const renderDepthLayers = () => {
    const layers = [];
    const shadowLayers = Math.floor(depthLayers * 0.6);
    
    for (let i = 0; i < shadowLayers; i++) {
      const depth = (i + 1) * 0.06 * enhance3D;
      const opacity = shadowIntensity * (1 - i / shadowLayers);
      const shadowColor = i < shadowLayers / 2 ? "#000000" : "#333333";
      
      layers.push(
        <Text
          key={`shadow-${i}`}
          position={[depth, -depth, -depth]}
          fontSize={enhanced3DSize * (1 + i * 0.015)}
          anchorX="center"
          anchorY="middle"
          font={fontFamily}
          letterSpacing={letterSpacing}
        >
          {text}
          <meshStandardMaterial
            color={shadowColor}
            metalness={0.2}
            roughness={0.8}
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
        {renderDepthLayers()}

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
            <meshStandardMaterial {...materials.volumetric} />
          </Text>
        )}

        <Text
          fontSize={enhanced3DSize}
          anchorX="center"
          anchorY="middle"
          font={fontFamily}
          letterSpacing={letterSpacing}
        >
          {text}
          <meshStandardMaterial {...materials.main} />
        </Text>

        <Sparkles
          count={hovered ? 15 : 10}
          scale={[enhanced3DSize * 4, enhanced3DSize * 4, enhanced3DSize * 2 * enhance3D]}
          size={hovered ? 1.5 * enhanced3DSize : enhanced3DSize}
          speed={hovered ? 0.8 : 0.4}
          color={color}
          opacity={hovered ? 0.9 : 0.7}
        />

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
        <Billboard {...billboardProps}>
          {textContent}
        </Billboard>
      ) : (
        textContent
      )}
    </group>
  );
};

export default Enhanced3DBillboard;