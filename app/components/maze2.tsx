import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Box } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import * as THREE from 'three'

// TypeScript interfaces for better type safety
interface BallProps {
  position: [number, number, number];
  mazeRotation: { x: number; z: number };
  walls: WallConfig[]; // Add walls prop
}

interface Velocity {
  x: number;
  y: number; // For vertical movement due to gravity
  z: number;
}

interface WallConfig {
  position: [number, number, number];
  scale: [number, number, number];
  // Add half-extents for easier collision calculation
  halfExtents: { x: number; y: number; z: number }; 
}

interface GoalProps {
  position: [number, number, number]
  color: string
  label: string
}

function Ball({ position, mazeRotation, walls }: BallProps) { // Add walls to props
  const ballRef = useRef<THREE.Mesh>(null);
  const [velocity, setVelocity] = useState<Velocity>({ x: 0, y: 0, z: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const GRAVITY = -0.05;
    const FRICTION = 0.98;
    const BOUNCE_FACTOR = 0.7;
    const BALL_RADIUS = 0.2;

    if (ballRef.current) {
      const ball = ballRef.current;

      let newVelocityX = velocity.x + mazeRotation.x * 0.15;
      let newVelocityZ = velocity.z + mazeRotation.z * 0.15;
      let newVelocityY = velocity.y + GRAVITY;

      newVelocityX *= FRICTION;
      newVelocityZ *= FRICTION;

      let newX = ball.position.x + newVelocityX;
      let newY = ball.position.y + newVelocityY;
      let newZ = ball.position.z + newVelocityZ;

      const floorY = BALL_RADIUS;
      if (newY < floorY) {
        newY = floorY;
        newVelocityY = -newVelocityY * BOUNCE_FACTOR;
        newVelocityX *= 0.9;
        newVelocityZ *= 0.9;
      }

      // Collision with walls
      for (const wall of walls) {
        // AABB collision detection
        const wallMinX = wall.position[0] - wall.halfExtents.x;
        const wallMaxX = wall.position[0] + wall.halfExtents.x;
        const wallMinZ = wall.position[2] - wall.halfExtents.z;
        const wallMaxZ = wall.position[2] + wall.halfExtents.z;
        // Assuming walls are tall enough, so only checking X and Z for simplicity
        // For Y collision with walls (if ball can jump on them), add similar logic for Y

        const ballMinX = newX - BALL_RADIUS;
        const ballMaxX = newX + BALL_RADIUS;
        const ballMinZ = newZ - BALL_RADIUS;
        const ballMaxZ = newZ + BALL_RADIUS;

        if (
          ballMaxX > wallMinX &&
          ballMinX < wallMaxX &&
          ballMaxZ > wallMinZ &&
          ballMinZ < wallMaxZ
        ) {
          // Collision detected, determine penetration depth and adjust
          const overlapX1 = wallMaxX - ballMinX;
          const overlapX2 = ballMaxX - wallMinX;
          const overlapZ1 = wallMaxZ - ballMinZ;
          const overlapZ2 = ballMaxZ - wallMinZ;

          const minOverlapX = Math.min(Math.abs(overlapX1), Math.abs(overlapX2));
          const minOverlapZ = Math.min(Math.abs(overlapZ1), Math.abs(overlapZ2));

          if (minOverlapX < minOverlapZ) {
            if (Math.abs(overlapX1) < Math.abs(overlapX2)) {
              newX = wallMaxX + BALL_RADIUS;
            } else {
              newX = wallMinX - BALL_RADIUS;
            }
            newVelocityX = -newVelocityX * BOUNCE_FACTOR;
          } else {
            if (Math.abs(overlapZ1) < Math.abs(overlapZ2)) {
              newZ = wallMaxZ + BALL_RADIUS;
            } else {
              newZ = wallMinZ - BALL_RADIUS;
            }
            newVelocityZ = -newVelocityZ * BOUNCE_FACTOR;
          }
        }
      }
      
      // Boundary checks (can be kept as a fallback or adjusted if walls define the boundary)
      const boundary = 4.8; 
      if (newX > boundary) { newX = boundary; newVelocityX = -newVelocityX * BOUNCE_FACTOR; }
      if (newX < -boundary) { newX = -boundary; newVelocityX = -newVelocityX * BOUNCE_FACTOR; }
      if (newZ > boundary) { newZ = boundary; newVelocityZ = -newVelocityZ * BOUNCE_FACTOR; }
      if (newZ < -boundary) { newZ = -boundary; newVelocityZ = -newVelocityZ * BOUNCE_FACTOR; }

      ball.position.set(newX, newY, newZ);
      setVelocity({ x: newVelocityX, y: newVelocityY, z: newVelocityZ });

      const distanceToGoal1 = Math.sqrt((newX - 3.5) ** 2 + (newZ - 3.5) ** 2);
      const distanceToGoal2 = Math.sqrt((newX + 3.5) ** 2 + (newZ + 3.5) ** 2);

      if (distanceToGoal1 < 0.8) {
        setTimeout(() => navigate('/frontend'), 500);
      } else if (distanceToGoal2 < 0.8) {
        setTimeout(() => navigate('/about'), 500);
      }
    }
  }, [velocity, mazeRotation, navigate, walls]); // Add walls to dependencies

  return (
    <mesh ref={ballRef} position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#ff6b6b" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

// MazeWalls component now just renders based on props
function MazeWalls({ walls }: { walls: WallConfig[] }) {
  return (
    <>
      {walls.map((wall, index) => (
        <Box key={index} position={wall.position} scale={wall.scale}>
          <meshStandardMaterial color="#4ecdc4" />
        </Box>
      ))}
    </>
  );
}

function Goal({ position, color, label }: GoalProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

function MazeGame() {
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [mazeRotation, setMazeRotation] = useState({ x: 0, z: 0 });

  // Define walls here so they can be passed to Ball and MazeWalls
  const wallsData: Omit<WallConfig, 'halfExtents'>[] = [
    // Outer walls
    { position: [0, 0.5, -5], scale: [10, 1, 0.2] },
    { position: [0, 0.5, 5], scale: [10, 1, 0.2] },
    { position: [-5, 0.5, 0], scale: [0.2, 1, 10] },
    { position: [5, 0.5, 0], scale: [0.2, 1, 10] },
    // Inner maze walls
    { position: [2, 0.5, -2], scale: [0.2, 1, 4] },
    { position: [-2, 0.5, 2], scale: [0.2, 1, 4] },
    { position: [0, 0.5, 0], scale: [4, 1, 0.2] },
    { position: [1, 0.5, -3.5], scale: [2, 1, 0.2] },
    { position: [-1, 0.5, 3.5], scale: [2, 1, 0.2] },
  ];

  const walls: WallConfig[] = wallsData.map(wall => ({
    ...wall,
    halfExtents: { x: wall.scale[0] / 2, y: wall.scale[1] / 2, z: wall.scale[2] / 2 }
  }));

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Event handlers for maze tilt
  useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity && event.rotationRate) {
        // Using rotationRate might be more direct for tilt control
        // Adjust sensitivity as needed
        const tiltX = (event.rotationRate.beta || 0) * 0.005; // Tilting phone forward/backward
        const tiltZ = (event.rotationRate.alpha || 0) * 0.005; // Tilting phone left/right
        
        // Clamp values to prevent extreme tilts
        setMazeRotation({
          x: Math.max(-0.5, Math.min(0.5, tiltX)),
          z: Math.max(-0.5, Math.min(0.5, tiltZ)),
        });
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      const tiltAmount = 0.05; // How much to tilt per key press
      setMazeRotation(prev => {
        let newX = prev.x;
        let newZ = prev.z;
        switch (event.key) {
          case 'ArrowLeft': case 'a': newZ += tiltAmount; break;
          case 'ArrowRight': case 'd': newZ -= tiltAmount; break;
          case 'ArrowUp': case 'w': newX += tiltAmount; break;
          case 'ArrowDown': case 's': newX -= tiltAmount; break;
        }
        // Clamp values
        return {
          x: Math.max(-0.5, Math.min(0.5, newX)),
          z: Math.max(-0.5, Math.min(0.5, newZ)),
        };
      });
    };

    // No need for keyUp to reset tilt, it should persist

    if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
      (DeviceMotionEvent.requestPermission as () => Promise<'granted' | 'denied'>)()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <>
      {showInstructions && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          zIndex: 1000,
          maxWidth: '90%'
        }}>
          <h3>🎮 Maze Controls</h3>
          <p>📱 Mobile: Tilt your device to tilt the maze</p>
          <p>💻 Desktop: Use WASD or Arrow Keys to tilt the maze</p>
          <p>🎯 Guide the ball to the goals!</p>
        </div>
      )}
      
      <Canvas
        camera={{ position: [0, 8, 8], fov: 60 }}
        style={{ height: '100vh', background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        {/* Group for maze elements to apply rotation */}
        <group rotation={[mazeRotation.x, 0, mazeRotation.z]}> 
          {/* Maze floor */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          
          <MazeWalls walls={walls} />
          
          {/* Goals - their positions are relative to the rotated group */}
          <Goal position={[3.5, 0.1, 3.5]} color="#ff4757" label="FRONTEND" />
          <Goal position={[-3.5, 0.1, -3.5]} color="#3742fa" label="ABOUT" />
        </group>
        
        {/* Ball - position is absolute, but affected by mazeRotation prop */}
        <Ball position={[0, 0.5, 0]} mazeRotation={mazeRotation} walls={walls} /> {/* Pass walls to Ball */}
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </>
  );
}

export default function MazePage() {
  return <MazeGame />;
}