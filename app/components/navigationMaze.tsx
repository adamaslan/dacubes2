import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from '@remix-run/react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type MazeProps = {
  // Optional props if needed
};

const NavigationMaze: React.FC<MazeProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentDestination, setCurrentDestination] = useState<string>("");

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const wallsRef = useRef<THREE.Group | null>(null);
  const mazeGridRef = useRef<boolean[][]>([]);
  const mazeFloorRef = useRef<THREE.Mesh | null>(null);

  // Physics-related references
  const ballVelocity = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const keyStates = useRef<{ [key: string]: boolean }>({});
  const lastTime = useRef<number>(0);
  const mazeRotation = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const targetMazeRotation = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));

  // Constants
  const CELL_SIZE = 4;
  const BALL_RADIUS = 0.7;
  const WALL_HEIGHT = 2;
  const FRICTION = 0.95;
  const GRAVITY = 0.015;
  const MAZE_TILT_SPEED = 0.05;
  const MAX_TILT = 0.2;
  const MAZE_SIZE = 10; // 10x10 grid

  // Define destinations
  const destinations = [
    { name: "Frontend", link: "/frontend", position: [0, 5], color: "#4287f5" },
    { name: "ThreeJS", link: "/threejs", position: [9, 5], color: "#f54242" }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // ==================== 1. SCENE SETUP ====================
    const setupScene = () => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      // More 8-bit style dark background
      scene.background = new THREE.Color(0x111111);

      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(MAZE_SIZE * CELL_SIZE / 2, MAZE_SIZE * CELL_SIZE, MAZE_SIZE * CELL_SIZE / 2);
      camera.lookAt(MAZE_SIZE * CELL_SIZE / 2, 0, MAZE_SIZE * CELL_SIZE / 2);
      cameraRef.current = camera;

      // Renderer with pixelated effect
      const renderer = new THREE.WebGLRenderer({ 
        antialias: false, // Disable antialiasing for pixelated look
        powerPreference: "high-performance" 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(1); // Force pixel ratio to 1 for pixelated look
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap; // More pixelated shadows
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 5;
      controls.maxDistance = MAZE_SIZE * CELL_SIZE * 1.5;
      controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
      controls.enableRotate = false; // Disable rotation to focus on maze tilting
      controlsRef.current = controls;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Reduced for more contrast
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(MAZE_SIZE * CELL_SIZE, MAZE_SIZE * CELL_SIZE, MAZE_SIZE * CELL_SIZE);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);

      // Add point lights at destinations for visual cues
      destinations.forEach(dest => {
        const pointLight = new THREE.PointLight(dest.color, 2, CELL_SIZE * 5);
        pointLight.position.set(
          dest.position[0] * CELL_SIZE + CELL_SIZE/2,
          WALL_HEIGHT * 1.5,
          dest.position[1] * CELL_SIZE + CELL_SIZE/2
        );
        scene.add(pointLight);
      });

      return { scene, camera, renderer, controls };
    };

    // ==================== 2. MAZE GENERATION ====================
    const generateAndCreateMaze = (scene: THREE.Scene) => {
      // Initialize the maze grid (true = wall, false = path)
      const mazeGrid: boolean[][] = Array(MAZE_SIZE).fill(null).map(() =>
        Array(MAZE_SIZE).fill(true)
      );
      mazeGridRef.current = mazeGrid;

      // Create a walls group
      const walls = new THREE.Group();
      scene.add(walls);
      wallsRef.current = walls;

      // Generate the maze layout
      const { startX, startZ } = generateMazeGrid();

      // Create floor with grid texture for 8-bit feel
      const floorSize = MAZE_SIZE * CELL_SIZE;
      const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
      
      // Create a grid texture for the floor
      const gridSize = 512;
      const gridCanvas = document.createElement('canvas');
      gridCanvas.width = gridSize;
      gridCanvas.height = gridSize;
      const gridContext = gridCanvas.getContext('2d');
      
      if (gridContext) {
        // Fill with base color
        gridContext.fillStyle = '#000033';
        gridContext.fillRect(0, 0, gridSize, gridSize);
        
        // Draw grid lines
        gridContext.strokeStyle = '#0066FF';
        gridContext.lineWidth = 2;
        
        // Draw vertical lines
        for (let i = 0; i <= MAZE_SIZE; i++) {
          const pos = (i / MAZE_SIZE) * gridSize;
          gridContext.beginPath();
          gridContext.moveTo(pos, 0);
          gridContext.lineTo(pos, gridSize);
          gridContext.stroke();
        }
        
        // Draw horizontal lines
        for (let i = 0; i <= MAZE_SIZE; i++) {
          const pos = (i / MAZE_SIZE) * gridSize;
          gridContext.beginPath();
          gridContext.moveTo(0, pos);
          gridContext.lineTo(gridSize, pos);
          gridContext.stroke();
        }
      }
      
      const floorTexture = new THREE.CanvasTexture(gridCanvas);
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.magFilter = THREE.NearestFilter; // Pixelated texture
      floorTexture.minFilter = THREE.NearestFilter; // Pixelated texture
      
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        map: floorTexture,
        roughness: 0.9,
        metalness: 0.1
      });
      
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(MAZE_SIZE * CELL_SIZE / 2 - CELL_SIZE / 2, 0, MAZE_SIZE * CELL_SIZE / 2 - CELL_SIZE / 2);
      floor.receiveShadow = true;
      scene.add(floor);
      mazeFloorRef.current = floor;

      // Create walls with 8-bit texture
      const wallGeometry = new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, CELL_SIZE);
      
      // Create pixelated wall texture
      const wallCanvas = document.createElement('canvas');
      wallCanvas.width = 64;
      wallCanvas.height = 64;
      const wallContext = wallCanvas.getContext('2d');
      
      if (wallContext) {
        // Base color
        wallContext.fillStyle = '#222266';
        wallContext.fillRect(0, 0, 64, 64);
        
        // Draw brick pattern
        wallContext.fillStyle = '#111155';
        const brickSize = 16;
        
        for (let y = 0; y < 64; y += brickSize) {
          const offset = (y % (brickSize * 2) === 0) ? 0 : brickSize / 2;
          for (let x = offset; x < 64; x += brickSize) {
            wallContext.fillRect(x, y, brickSize - 2, brickSize - 2);
          }
        }
      }
      
      const wallTexture = new THREE.CanvasTexture(wallCanvas);
      wallTexture.magFilter = THREE.NearestFilter; // Pixelated texture
      wallTexture.minFilter = THREE.NearestFilter; // Pixelated texture
      
      const wallMaterial = new THREE.MeshStandardMaterial({ 
        map: wallTexture,
        roughness: 1.0,
        metalness: 0.0
      });

      for (let z = 0; z < MAZE_SIZE; z++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
          if (mazeGrid[z][x]) {
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            wall.position.set(
              x * CELL_SIZE + CELL_SIZE / 2,
              WALL_HEIGHT / 2,
              z * CELL_SIZE + CELL_SIZE / 2
            );
            wall.castShadow = true;
            wall.receiveShadow = true;
            walls.add(wall);
          }
        }
      }

      // Create destination markers with pixelated look
      destinations.forEach(dest => {
        // Use a cube instead of cylinder for more 8-bit look
        const markerGeometry = new THREE.BoxGeometry(CELL_SIZE, 0.4, CELL_SIZE);
        
        // Create pixelated texture for marker
        const markerCanvas = document.createElement('canvas');
        markerCanvas.width = 64;
        markerCanvas.height = 64;
        const markerContext = markerCanvas.getContext('2d');
        
        if (markerContext) {
          // Checkerboard pattern
          const squareSize = 16;
          for (let y = 0; y < 64; y += squareSize) {
            for (let x = 0; x < 64; x += squareSize) {
              const isAlternate = (x / squareSize + y / squareSize) % 2 === 0;
              markerContext.fillStyle = isAlternate ? dest.color : lightenColor(dest.color, 30);
              markerContext.fillRect(x, y, squareSize, squareSize);
            }
          }
        }
        
        const markerTexture = new THREE.CanvasTexture(markerCanvas);
        markerTexture.magFilter = THREE.NearestFilter;
        markerTexture.minFilter = THREE.NearestFilter;
        
        const markerMaterial = new THREE.MeshStandardMaterial({ 
          map: markerTexture,
          emissive: dest.color,
          emissiveIntensity: 0.5,
          roughness: 1.0,
          metalness: 0.0
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(
          dest.position[0] * CELL_SIZE + CELL_SIZE / 2,
          0.21, // Just above the floor
          dest.position[1] * CELL_SIZE + CELL_SIZE / 2
        );
        marker.receiveShadow = true;
        scene.add(marker);

        // Add text label for destination with pixelated font
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = 256;
          canvas.height = 128;
          context.fillStyle = 'black';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          // Create pixelated text
          context.fillStyle = 'white';
          drawPixelText(context, dest.name, canvas.width / 2, canvas.height / 2, 4);
          
          const texture = new THREE.CanvasTexture(canvas);
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          
          const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.position.set(
            dest.position[0] * CELL_SIZE + CELL_SIZE / 2,
            WALL_HEIGHT + 1,
            dest.position[1] * CELL_SIZE + CELL_SIZE / 2
          );
          sprite.scale.set(4, 2, 1);
          scene.add(sprite);
        }
      });

      // Create player ball with pixelated texture
      const ballGeometry = new THREE.BoxGeometry(BALL_RADIUS * 2, BALL_RADIUS * 2, BALL_RADIUS * 2); // Cube instead of sphere
      
      // Create pixelated ball texture
      const ballCanvas = document.createElement('canvas');
      ballCanvas.width = 32;
      ballCanvas.height = 32;
      const ballContext = ballCanvas.getContext('2d');
      
      if (ballContext) {
        // Base color
        ballContext.fillStyle = '#FF0000';
        ballContext.fillRect(0, 0, 32, 32);
        
        // Add some pixel details
        ballContext.fillStyle = '#FF6666';
        ballContext.fillRect(4, 4, 8, 8);
        ballContext.fillRect(20, 4, 8, 8);
        ballContext.fillRect(4, 20, 8, 8);
        ballContext.fillRect(20, 20, 8, 8);
      }
      
      const ballTexture = new THREE.CanvasTexture(ballCanvas);
      ballTexture.magFilter = THREE.NearestFilter;
      ballTexture.minFilter = THREE.NearestFilter;
      
      const ballMaterial = new THREE.MeshStandardMaterial({ 
        map: ballTexture,
        emissive: 0xff0000,
        emissiveIntensity: 0.2,
        roughness: 1.0,
        metalness: 0.0
      });
      
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.set(
        startX * CELL_SIZE + CELL_SIZE / 2,
        BALL_RADIUS,
        startZ * CELL_SIZE + CELL_SIZE / 2
      );
      ball.castShadow = true;
      ball.receiveShadow = true;
      scene.add(ball);
      ballRef.current = ball;

      return ball;
    };

    // Helper function to draw pixelated text
    const drawPixelText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, pixelSize: number) => {
      const chars: {[key: string]: number[][]} = {
        'A': [
          [0,1,1,0],
          [1,0,0,1],
          [1,1,1,1],
          [1,0,0,1],
          [1,0,0,1]
        ],
        'B': [
          [1,1,1,0],
          [1,0,0,1],
          [1,1,1,0],
          [1,0,0,1],
          [1,1,1,0]
        ],
        // Add more characters as needed
      };
      
      // Default pixel pattern for characters not defined above
      const defaultChar = [
        [1,1,1,1],
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0],
        [1,1,1,1]
      ];
      
      const charWidth = 4 * pixelSize;
      const spacing = pixelSize;
      
      // Center text
      const totalWidth = text.length * (charWidth + spacing) - spacing;
      let startX = x - totalWidth / 2;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i].toUpperCase();
        const pattern = chars[char] || defaultChar;
        
        for (let row = 0; row < pattern.length; row++) {
          for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col]) {
              ctx.fillRect(
                startX + col * pixelSize,
                y - pattern.length * pixelSize / 2 + row * pixelSize,
                pixelSize,
                pixelSize
              );
            }
          }
        }
        
        startX += charWidth + spacing;
      }
    };

    // Helper function to lighten a color
    const lightenColor = (color: string, percent: number) => {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      
      return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      ).toString(16).slice(1);
    };

    // Generate the maze grid with more blocks in the middle
    const generateMazeGrid = () => {
      // Mark all destination positions as paths
      destinations.forEach(dest => {
        const [x, z] = dest.position;
        mazeGridRef.current[z][x] = false;
      });

      // Fixed starting position in the center
      const startX = 5;
      const startZ = 5;
      mazeGridRef.current[startZ][startX] = false;

      // Create two distinct paths to destinations with more walls in between
      
      // Path to Frontend (left side) - more winding path
      mazeGridRef.current[startZ][startX-1] = false; // First step left
      mazeGridRef.current[startZ][startX-2] = false; // Second step left
      mazeGridRef.current[startZ-1][startX-2] = false; // Step up
      mazeGridRef.current[startZ-2][startX-2] = false; // Step up again
      mazeGridRef.current[startZ-2][startX-3] = false; // Step left
      mazeGridRef.current[startZ-2][startX-4] = false; // Step left again
      mazeGridRef.current[startZ-1][startX-4] = false; // Step down
      mazeGridRef.current[startZ][startX-4] = false; // Step down again
      
      // Continue path to Frontend
      for (let x = startX-5; x >= 0; x--) {
        mazeGridRef.current[startZ][x] = false;
      }

      // Path to ThreeJS (right side) - more winding path
      mazeGridRef.current[startZ][startX+1] = false; // First step right
      mazeGridRef.current[startZ][startX+2] = false; // Second step right
      mazeGridRef.current[startZ+1][startX+2] = false; // Step down
      mazeGridRef.current[startZ+2][startX+2] = false; // Step down again
      mazeGridRef.current[startZ+2][startX+3] = false; // Step right
      mazeGridRef.current[startZ+2][startX+4] = false; // Step right again
      mazeGridRef.current[startZ+1][startX+4] = false; // Step up
      mazeGridRef.current[startZ][startX+4] = false; // Step up again
      
      // Continue path to ThreeJS
      for (let x = startX+5; x < MAZE_SIZE; x++) {
        mazeGridRef.current[startZ][x] = false;
      }

      // Add more blocks in the middle - create a complex structure
      
      // Add some vertical walls in the center area
      for (let z = 2; z < 8; z++) {
        if (z !== startZ && z !== startZ-1 && z !== startZ+1) {
          mazeGridRef.current[z][startX] = true; // Vertical wall through center
        }
      }
      
      // Add some horizontal walls in the center area
      for (let x = 2; x < 8; x++) {
        if (x !== startX && x !== startX-1 && x !== startX+1) {
          mazeGridRef.current[startZ][x] = true; // Horizontal wall through center
        }
      }
      
      // Create a small maze pattern in the center
      mazeGridRef.current[startZ-2][startX] = true;
      mazeGridRef.current[startZ+2][startX] = true;
      mazeGridRef.current[startZ][startX-2] = true;
      mazeGridRef.current[startZ][startX+2] = true;
      
      // Add diagonal walls
      mazeGridRef.current[startZ-1][startX-1] = true;
      mazeGridRef.current[startZ+1][startX+1] = true;
      mazeGridRef.current[startZ-1][startX+1] = true;
      mazeGridRef.current[startZ+1][startX-1] = true;
      
      // Add some vertical paths and dead ends for complexity
      for (let z = 1; z < 9; z++) {
        if (z !== startZ && z !== startZ-1 && z !== startZ+1 && z !== startZ-2 && z !== startZ+2) {
          // Create some vertical paths with dead ends
          if (z % 2 === 0) {
            for (let x = 1; x < 4; x++) {
              mazeGridRef.current[z][x] = false;
            }
            mazeGridRef.current[z][2] = true; // Block in the middle to create dead end
          } else {
            for (let x = 6; x < 9; x++) {
              mazeGridRef.current[z][x] = false;
            }
            mazeGridRef.current[z][7] = true; // Block in the middle to create dead end
          }
        }
      }

      // Add some horizontal paths and dead ends
      for (let x = 1; x < 9; x++) {
        if (x !== startX && x !== startX-1 && x !== startX+1 && x !== startX-2 && x !== startX+2) {
          // Create some horizontal paths with dead ends
          if (x % 2 === 0) {
            for (let z = 1; z < 4; z++) {
              mazeGridRef.current[z][x] = false;
            }
            mazeGridRef.current[2][x] = true; // Block in the middle to create dead end
          } else {
            for (let z = 6; z < 9; z++) {
              mazeGridRef.current[z][x] = false;
            }
            mazeGridRef.current[7][x] = true; // Block in the middle to create dead end
          }
        }
      }

      // Ensure the destinations are still accessible
      destinations.forEach(dest => {
        const [x, z] = dest.position;
        mazeGridRef.current[z][x] = false;
        
        // Ensure there's a path to each destination
        if (x === 0) { // Frontend (left)
          mazeGridRef.current[z][1] = false;
          mazeGridRef.current[z][2] = false;
        } else if (x === 9) { // ThreeJS (right)
          mazeGridRef.current[z][8] = false;
          mazeGridRef.current[z][7] = false;
        }
      });

      return { startX, startZ };
    };

    // ==================== 3. INTERACTION SETUP ====================
    const setupInteraction = () => {
      // Keyboard event handlers for tilting the maze
      const handleKeyDown = (e: KeyboardEvent) => {
        keyStates.current[e.key.toLowerCase()] = true;
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        keyStates.current[e.key.toLowerCase()] = false;
      };

      // Add event listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // Return cleanup function
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    };

    // ==================== 4. ANIMATION LOOP ====================
    const startAnimationLoop = (
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer,
      controls: OrbitControls,
      ball: THREE.Mesh
    ) => {
      const clock = new THREE.Clock();

      const checkDestinations = (position: THREE.Vector3) => {
        for (const dest of destinations) {
          const destX = dest.position[0] * CELL_SIZE + CELL_SIZE / 2;
          const destZ = dest.position[1] * CELL_SIZE + CELL_SIZE / 2;
          
          const distance = Math.sqrt(
            Math.pow(position.x - destX, 2) + 
            Math.pow(position.z - destZ, 2)
          );
          
          if (distance < CELL_SIZE / 2) {
            setCurrentDestination(dest.name);
            // Navigate after a short delay for visual feedback
            setTimeout(() => {
              navigate(dest.link);
            }, 1000);
            return;
          }
        }
      };

      const animate = (time: number) => {
        animationFrameId.current = requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        // Update maze tilt based on keyboard input
        if (keyStates.current['w'] || keyStates.current['arrowup']) {
          targetMazeRotation.current.x = -MAX_TILT;
        } else if (keyStates.current['s'] || keyStates.current['arrowdown']) {
          targetMazeRotation.current.x = MAX_TILT;
        } else {
          targetMazeRotation.current.x = 0;
        }
        
        if (keyStates.current['a'] || keyStates.current['arrowleft']) {
          targetMazeRotation.current.y = -MAX_TILT;
        } else if (keyStates.current['d'] || keyStates.current['arrowright']) {
          targetMazeRotation.current.y = MAX_TILT;
        } else {
          targetMazeRotation.current.y = 0;
        }
        
        // Smoothly interpolate current rotation towards target rotation
        mazeRotation.current.x += (targetMazeRotation.current.x - mazeRotation.current.x) * MAZE_TILT_SPEED;
        mazeRotation.current.y += (targetMazeRotation.current.y - mazeRotation.current.y) * MAZE_TILT_SPEED;
        
        // Apply rotation to the maze floor and walls
        if (wallsRef.current && mazeFloorRef.current) {
          wallsRef.current.rotation.x = mazeRotation.current.x;
          wallsRef.current.rotation.z = mazeRotation.current.y;
          mazeFloorRef.current.rotation.x = -Math.PI / 2 + mazeRotation.current.x;
          mazeFloorRef.current.rotation.z = mazeRotation.current.y;
        }
        
        // Ball movement based on gravity and maze tilt
        if (ballRef.current) {
          // Apply gravity in the direction of the tilt
          const gravityX = mazeRotation.current.y * GRAVITY * 60;
          const gravityZ = mazeRotation.current.x * GRAVITY * 60;
          
          ballVelocity.current.x += gravityX * delta;
          ballVelocity.current.z += gravityZ * delta;
          
          // Apply friction
          ballVelocity.current.multiplyScalar(FRICTION);
          
          // Calculate potential new position
          const potentialNewPos = ball.position.clone().add(
            ballVelocity.current.clone().multiplyScalar(delta * 60)
          );
          
          // Simple collision detection and response
          const currentGridX = Math.floor(ball.position.x / CELL_SIZE);
          const currentGridZ = Math.floor(ball.position.z / CELL_SIZE);
          const newGridX = Math.floor(potentialNewPos.x / CELL_SIZE);
          const newGridZ = Math.floor(potentialNewPos.z / CELL_SIZE);
          
          let collided = false;
          
          // Check collision with the cell the ball is moving into
          if (newGridX >= 0 && newGridX < MAZE_SIZE && newGridZ >= 0 && newGridZ < MAZE_SIZE) {
            if (mazeGridRef.current[newGridZ][newGridX]) {
              collided = true;
            }
          } else {
            // Collision with maze bounds
            collided = true;
          }

          if (!collided) {
            // No collision, move to the new position
            ball.position.copy(potentialNewPos);
            
            // Add 8-bit style movement - snap rotation for more pixelated feel
            ball.rotation.x += ballVelocity.current.z * 0.5;
            ball.rotation.z -= ballVelocity.current.x * 0.5;
            
            // Snap rotations to 45-degree increments for 8-bit feel
            ball.rotation.x = Math.round(ball.rotation.x / (Math.PI/8)) * (Math.PI/8);
            ball.rotation.z = Math.round(ball.rotation.z / (Math.PI/8)) * (Math.PI/8);
          } else {
            // Collision detected - bounce back slightly
            ballVelocity.current.multiplyScalar(-0.3);
          }

          // Check if ball is at one of the destinations
          checkDestinations(ball.position);
        }

        // Update maze tilt based on keyboard input
        if (wallsRef.current && mazeFloorRef.current) {
          // Apply keyboard forces to maze tilt
          if (keyStates.current['w'] || keyStates.current['arrowup']) {
            targetMazeRotation.current.x = -MAX_TILT;
          } else if (keyStates.current['s'] || keyStates.current['arrowdown']) {
            targetMazeRotation.current.x = MAX_TILT;
          } else {
            targetMazeRotation.current.x = 0;
          }
          
          if (keyStates.current['a'] || keyStates.current['arrowleft']) {
            targetMazeRotation.current.y = -MAX_TILT;
          } else if (keyStates.current['d'] || keyStates.current['arrowright']) {
            targetMazeRotation.current.y = MAX_TILT;
          } else {
            targetMazeRotation.current.y = 0;
          }
          
          // Smoothly interpolate current rotation toward target rotation
          mazeRotation.current.x += (targetMazeRotation.current.x - mazeRotation.current.x) * MAZE_TILT_SPEED;
          mazeRotation.current.y += (targetMazeRotation.current.y - mazeRotation.current.y) * MAZE_TILT_SPEED;
          
          // Apply rotation to maze floor and walls
          wallsRef.current.rotation.x = mazeRotation.current.x;
          wallsRef.current.rotation.z = mazeRotation.current.y;
          mazeFloorRef.current.rotation.x = -Math.PI / 2 + mazeRotation.current.x;
          mazeFloorRef.current.rotation.z = mazeRotation.current.y;
          
          // Apply gravity to ball based on maze tilt
          if (ballRef.current) {
            ballVelocity.current.x += mazeRotation.current.y * GRAVITY * delta * 60;
            ballVelocity.current.z += mazeRotation.current.x * GRAVITY * delta * 60;
          }
        }

        // Make camera follow the ball with some lag
        if (controlsRef.current && ballRef.current) {
          controlsRef.current.target.set(
            ballRef.current.position.x,
            0, // Keep camera target at ground level
            ballRef.current.position.z
          );
        }

        // Update controls
        controls.update();

        // Render the scene
        renderer.render(scene, camera);
      };

      animate(0);
    };

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // --- Execution Flow ---
    const { scene, camera, renderer, controls } = setupScene();
    const ball = generateAndCreateMaze(scene);
    const cleanupInteraction = setupInteraction();
    startAnimationLoop(scene, camera, renderer, controls, ball);

    setIsLoading(false);

    // Cleanup
    return () => {
      cleanupInteraction(); // Remove keyboard listeners
      window.removeEventListener('resize', handleResize);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose of Three.js objects to prevent memory leaks
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          (object as THREE.Mesh).geometry.dispose();
          if (Array.isArray((object as THREE.Mesh).material)) {
            ((object as THREE.Mesh).material as THREE.Material[]).forEach(material => material.dispose());
          } else {
            ((object as THREE.Mesh).material as THREE.Material).dispose();
          }
        }
      });
      renderer.dispose();
      controls.dispose();
    };
  }, [navigate]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white text-xl">
          Loading Maze...
        </div>
      )}

      {!isLoading && (
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
          <div className="bg-gray-800 bg-opacity-70 text-white p-3 rounded-lg max-w-md text-center">
            <p className="mb-2 text-lg">Use W,A,S,D or arrow keys to move the ball</p>
            <p className="text-sm">Find your way to Frontend or ThreeJS destinations</p>
            {currentDestination && (
              <p className="text-xl font-bold mt-2">
                Destination reached: {currentDestination}! Navigating...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationMaze;