import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Box } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import * as THREE from 'three'

// TypeScript interfaces for better type safety
interface BallProps {
  position: [number, number, number]
  onGoalReached?: () => void
}

interface Velocity {
  x: number
  z: number
}

interface WallConfig {
  position: [number, number, number]
  scale: [number, number, number]
}

interface GoalProps {
  position: [number, number, number]
  color: string
  label: string
}

function Ball({ position }: BallProps) {
  const ballRef = useRef<THREE.Mesh>(null)
  const [velocity, setVelocity] = useState<Velocity>({ x: 0, z: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y } = event.accelerationIncludingGravity
        setVelocity({ x: (x || 0) * 0.001, z: (y || 0) * 0.001 })
      }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      const speed = 0.02
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
          setVelocity(prev => ({ ...prev, x: -speed }))
          break
        case 'ArrowRight':
        case 'd':
          setVelocity(prev => ({ ...prev, x: speed }))
          break
        case 'ArrowUp':
        case 'w':
          setVelocity(prev => ({ ...prev, z: -speed }))
          break
        case 'ArrowDown':
        case 's':
          setVelocity(prev => ({ ...prev, z: speed }))
          break
      }
    }

    const handleKeyUp = () => {
      setVelocity({ x: 0, z: 0 })
    }

    // Request device motion permission for iOS with proper typing
    if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
      (DeviceMotionEvent.requestPermission as () => Promise<'granted' | 'denied'>)()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion)
          }
        })
        .catch(console.error)
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion)
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion)
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (ballRef.current) {
      const ball = ballRef.current
      const newX = Math.max(-4.5, Math.min(4.5, ball.position.x + velocity.x))
      const newZ = Math.max(-4.5, Math.min(4.5, ball.position.z + velocity.z))
      
      ball.position.x = newX
      ball.position.z = newZ

      // Check for goal collisions
      const distanceToGoal1 = Math.sqrt((newX - 3.5) ** 2 + (newZ - 3.5) ** 2)
      const distanceToGoal2 = Math.sqrt((newX + 3.5) ** 2 + (newZ + 3.5) ** 2)

      if (distanceToGoal1 < 0.8) {
        setTimeout(() => navigate('/frontend'), 500)
      } else if (distanceToGoal2 < 0.8) {
        setTimeout(() => navigate('/about'), 500)
      }
    }
  }, [velocity, navigate])

  return (
    <mesh ref={ballRef} position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#ff6b6b" metalness={0.3} roughness={0.4} />
    </mesh>
  )
}

function MazeWalls() {
  const walls: WallConfig[] = [
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
  ]

  return (
    <>
      {walls.map((wall, index) => (
        <Box key={index} position={wall.position} scale={wall.scale}>
          <meshStandardMaterial color="#4ecdc4" />
        </Box>
      ))}
    </>
  )
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
  const [showInstructions, setShowInstructions] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 5000)
    return () => clearTimeout(timer)
  }, [])

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
          <p>📱 Mobile: Tilt your device</p>
          <p>💻 Desktop: Use WASD or Arrow Keys</p>
          <p>🎯 Red Goal → Frontend | Blue Goal → About</p>
        </div>
      )}
      
      <Canvas
        camera={{ position: [0, 8, 8], fov: 60 }}
        style={{ height: '100vh', background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        {/* Maze floor */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        
        <MazeWalls />
        
        {/* Goals */}
        <Goal position={[3.5, 0, 3.5]} color="#ff4757" label="Frontend" />
        <Goal position={[-3.5, 0, -3.5]} color="#3742fa" label="ABOUT" />
        
        {/* Ball */}
        <Ball position={[0, 0.5, 0]} />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </>
  )
}

export default function MazePage() {
  return <MazeGame />
}