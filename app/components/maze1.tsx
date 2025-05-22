import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from '@remix-run/react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Define types for destinations
type MazeDestination = {
  name: string;
  link: string;
  position: [number, number]; // [x, z] position in maze grid
  color: string;
};

type MazeProps = {
  destinations?: MazeDestination[];
  mazeComplexity?: number; // 1-10 scale
};

const ThreeMaze: React.FC<MazeProps> = ({
  destinations = [
    { name: "Page 1", link: "/page1", position: [0, 10], color: "#ff5733" },
    { name: "Page 2", link: "/page2", position: [10, 0], color: "#33ff57" },
    { name: "Page 3", link: "/page3", position: [10, 10], color: "#3357ff" },
  ],
  mazeComplexity = 5
}) => {
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
  const destinationMeshesRef = useRef<THREE.Mesh[]>([]);

  // Physics-related references
  const ballVelocity = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const keyStates = useRef<{ [key: string]: boolean }>({});
  const lastTime = useRef<number>(0);

  // Constants
  const CELL_SIZE = 4;
  const BALL_RADIUS = 0.7;
  const WALL_HEIGHT = 2;
  const FRICTION = 0.95; // Slightly increased friction
  const ACCELERATION = 0.008; // Slightly increased acceleration
  const MAZE_SIZE = 10; // Changed from 8 to 10 for 10x10 grid

  useEffect(() => {
    if (!mountRef.current) return;

    // ==================== 1. SCENE SETUP ====================
    const setupScene = () => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(0xf0f0f0);

      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(MAZE_SIZE * CELL_SIZE / 2, MAZE_SIZE * CELL_SIZE / 2, MAZE_SIZE * CELL_SIZE / 2);
      camera.lookAt(MAZE_SIZE * CELL_SIZE / 2, 0, MAZE_SIZE * CELL_SIZE / 2);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current!.appendChild(renderer.domElement); // Use non-null assertion as we checked mountRef.current
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 5;
      controls.maxDistance = MAZE_SIZE * CELL_SIZE * 1.5;
      controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
      controlsRef.current = controls;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(MAZE_SIZE * CELL_SIZE, MAZE_SIZE * CELL_SIZE, MAZE_SIZE * CELL_SIZE);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = MAZE_SIZE * CELL_SIZE * 3;
      directionalLight.shadow.camera.left = -MAZE_SIZE * CELL_SIZE;
      directionalLight.shadow.camera.right = MAZE_SIZE * CELL_SIZE;
      directionalLight.shadow.camera.top = MAZE_SIZE * CELL_SIZE;
      directionalLight.shadow.camera.bottom = -MAZE_SIZE * CELL_SIZE;
      scene.add(directionalLight);

      destinations.forEach(dest => {
        const pointLight = new THREE.PointLight(dest.color, 1, CELL_SIZE * 3);
        pointLight.position.set(
          dest.position[0] * CELL_SIZE + CELL_SIZE/2,
          WALL_HEIGHT * 1.5,
          dest.position[1] * CELL_SIZE + CELL_SIZE/2
        );
        scene.add(pointLight);
      });

      return { scene, camera, renderer, controls };
    };

    // ==================== 2. MAZE GENERATION AND GEOMETRY ====================
    const generateAndCreateMaze = (scene: THREE.Scene) => {
      // Initialize the maze grid (true = wall, false = path)
      const mazeGrid: boolean[][] = Array(MAZE_SIZE).fill(null).map(() =>
        Array(MAZE_SIZE).fill(true)
      );

      // Create a walls group
      const walls = new THREE.Group();
      scene.add(walls);
      wallsRef.current = walls;

      // Generate maze using recursive backtracking
      const generateMazeGrid = () => {
        // Mark all destination positions as paths
        destinations.forEach(dest => {
          const [x, z] = dest.position;
          if (x >= 0 && x < MAZE_SIZE && z >= 0 && z < MAZE_SIZE) {
            mazeGrid[z][x] = false; // Path
          }
        });

        // Create additional paths based on complexity
        const startX = 5; // Changed from 1 to 5 (middle of 10x10 grid)
        const startZ = 5; // Changed from 1 to 5 (middle of 10x10 grid)
        mazeGrid[startZ][startX] = false; // Starting position is a path

        const directions = [
          [0, -2], // North
          [2, 0],  // East
          [0, 2],  // South
          [-2, 0]  // West
        ];

        const carvePassages = (x: number, z: number) => {
          // Randomize directions
          const shuffledDirs = directions.sort(() => Math.random() - 0.5);

          for (const [dx, dz] of shuffledDirs) {
            const nx = x + dx;
            const nz = z + dz;

            // Check if the cell is within bounds and is a wall
            if (nx >= 0 && nx < MAZE_SIZE && nz >= 0 && nz < MAZE_SIZE && mazeGrid[nz][nx]) {
              // Mark the cells in between and the destination as paths
              mazeGrid[z + dz/2][x + dx/2] = false;
              mazeGrid[nz][nx] = false;

              // Recursively carve passages from the new cell
              carvePassages(nx, nz);
            }
          }
        };

        // Start carving passages from the starting position
        carvePassages(startX, startZ);

        // Ensure connectivity to all destinations by creating paths from start
        destinations.forEach(dest => {
          const [destX, destZ] = dest.position;

          // Create a simple path to ensure connectivity
          // This is a simplified approach that might create a less interesting maze
          // but ensures all destinations are reachable
          let currentX = startX;
          let currentZ = startZ;

          // Move horizontally first
          while (currentX !== destX) {
            const step = currentX < destX ? 1 : -1;
            currentX += step;
            if (currentX >= 0 && currentX < MAZE_SIZE && currentZ >= 0 && currentZ < MAZE_SIZE) {
               mazeGrid[currentZ][currentX] = false; // Path
            }
          }

          // Then move vertically
          while (currentZ !== destZ) {
            const step = currentZ < destZ ? 1 : -1;
            currentZ += step;
             if (currentX >= 0 && currentX < MAZE_SIZE && currentZ >= 0 && currentZ < MAZE_SIZE) {
               mazeGrid[currentZ][currentX] = false; // Path
             }
          }
        });

        // Add some randomness based on complexity (higher complexity = more walls)
        const randomWallsFactor = 0.1 * (10 - mazeComplexity);
        for (let z = 0; z < MAZE_SIZE; z++) {
          for (let x = 0; x < MAZE_SIZE; x++) {
            // Don't add walls at destination positions
            if (!mazeGrid[z][x] && Math.random() < randomWallsFactor) {
              // Check if this is not a destination position
              const isDestination = destinations.some(
                dest => dest.position[0] === x && dest.position[1] === z
              );

              // Check if this is not the starting position
              const isStart = (x === startX && z === startZ);

              if (!isDestination && !isStart) {
                mazeGrid[z][x] = true; // Convert some paths back to walls randomly
              }
            }
          }
        }

        return { startX, startZ };
      };

      // Create the 3D maze geometry
      const createMazeGeometry = (startPos: { startX: number, startZ: number }) => {
        const { startX, startZ } = startPos;

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(MAZE_SIZE * CELL_SIZE, MAZE_SIZE * CELL_SIZE);
        const floorMaterial = new THREE.MeshStandardMaterial({
          color: 0x999999, // Keep floor color
          roughness: 0.8,
          metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(MAZE_SIZE * CELL_SIZE / 2, 0, MAZE_SIZE * CELL_SIZE / 2);
        floor.receiveShadow = true;
        scene.add(floor);

        // Walls (now bushes)
        const wallGeometry = new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, CELL_SIZE);
        const wallMaterial = new THREE.MeshStandardMaterial({
          color: 0x228B22, // Dark green for bushes
          roughness: 0.8,
          metalness: 0.1
        });

        for (let z = 0; z < MAZE_SIZE; z++) {
          for (let x = 0; x < MAZE_SIZE; x++) {
            if (mazeGrid[z][x]) { // If it's a wall (bush)
              const wall = new THREE.Mesh(wallGeometry, wallMaterial);
              wall.position.set(
                x * CELL_SIZE + CELL_SIZE/2,
                WALL_HEIGHT/2,
                z * CELL_SIZE + CELL_SIZE/2
              );
              wall.castShadow = true;
              wall.receiveShadow = true;
              walls.add(wall);
            }
          }
        }

        // Add destination markers (clearings)
        const destinationMeshes: THREE.Mesh[] = [];
        destinations.forEach(dest => {
          const { position, color, name } = dest;

          // Create destination platform (clearing)
          const platformGeometry = new THREE.BoxGeometry(CELL_SIZE * 0.8, 0.5, CELL_SIZE * 0.8);
          const platformMaterial = new THREE.MeshStandardMaterial({
            color: color, // Keep destination color
            roughness: 0.3,
            metalness: 0.7
          });
          const platform = new THREE.Mesh(platformGeometry, platformMaterial);
          platform.position.set(
            position[0] * CELL_SIZE + CELL_SIZE/2,
            0.25,
            position[1] * CELL_SIZE + CELL_SIZE/2
          );
          platform.userData = { isDestination: true, name, link: dest.link };
          scene.add(platform);
          destinationMeshes.push(platform);

          // Create text sprite for the destination (optional, keep for now)
          const createTextSprite = (text: string) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) return null;

            canvas.width = 256;
            canvas.height = 128;

            context.fillStyle = 'rgba(0,0,0,0)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.font = 'Bold 24px Arial';
            context.textAlign = 'center';
            context.fillStyle = 'white';
            context.fillText(text, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(4, 2, 1);

            return sprite;
          };

          const textSprite = createTextSprite(name);
          if (textSprite) {
            textSprite.position.set(
              position[0] * CELL_SIZE + CELL_SIZE/2,
              WALL_HEIGHT + 1,
              position[1] * CELL_SIZE + CELL_SIZE/2
            );
            scene.add(textSprite);
          }
        });
        destinationMeshesRef.current = destinationMeshes;

        // Create the player's horse (was ball)
        const horseGeometry = new THREE.BoxGeometry(BALL_RADIUS * 1.5, BALL_RADIUS * 2, BALL_RADIUS * 1.5); // Use box geometry for 8-bit feel
        const horseMaterial = new THREE.MeshStandardMaterial({
          color: 0x8B4513, // Saddle brown color for horse
          roughness: 0.5,
          metalness: 0.1
        });
        const ball = new THREE.Mesh(horseGeometry, horseMaterial); // Still using 'ball' variable name for consistency
        ball.position.set(
          startX * CELL_SIZE + CELL_SIZE/2,
          BALL_RADIUS, // Position slightly above ground
          startZ * CELL_SIZE + CELL_SIZE/2
        );
        ball.castShadow = true;
        ball.receiveShadow = true;
        scene.add(ball);
        ballRef.current = ball;

        return ball;
      };

      const startPos = generateMazeGrid();
      mazeGridRef.current = mazeGrid;
      const ball = createMazeGeometry(startPos);
      return ball;
    };

    // ==================== 3. INTERACTION SETUP ====================
    const setupInteraction = () => {
      const handleKeyDown = (e: KeyboardEvent) => {
        keyStates.current[e.key.toLowerCase()] = true;
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        keyStates.current[e.key.toLowerCase()] = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    };

    // ==================== 4. PHYSICS & ANIMATION ====================
    const startAnimationLoop = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls, ball: THREE.Mesh) => {

      // Check wall collision (simplified grid check)
      const checkWallCollision = (position: THREE.Vector3) => {
        // Convert world position to grid indices
        const gridX = Math.floor(position.x / CELL_SIZE);
        const gridZ = Math.floor(position.z / CELL_SIZE);

        // Check bounds
        if (gridX < 0 || gridX >= MAZE_SIZE || gridZ < 0 || gridZ >= MAZE_SIZE) {
          return true; // Out of bounds, treat as collision
        }

        return mazeGridRef.current[gridZ][gridX]; // true = wall
      };

      // Check if ball is at a destination
      const checkDestinations = (position: THREE.Vector3) => {
        for (const destMesh of destinationMeshesRef.current) {
          const destPos = destMesh.position;
          const distance = Math.sqrt(
            Math.pow(position.x - destPos.x, 2) +
            Math.pow(position.z - destPos.z, 2)
          );

          if (distance < CELL_SIZE * 0.5) {
            // Ball is at a destination
            const destData = destMesh.userData;
            setCurrentDestination(destData.name);

            // Navigate after a short delay
            setTimeout(() => {
              navigate(destData.link);
            }, 1000);

            return true;
          }
        }

        setCurrentDestination("");
        return false;
      };

      // Animation loop
      const animate = (time: number) => {
        animationFrameId.current = requestAnimationFrame(animate);

        // Calculate delta time
        const delta = lastTime.current ? (time - lastTime.current) : 16;
        lastTime.current = time;

        // Ball movement with keyboard
        // Apply keyboard forces
        const moveDirection = new THREE.Vector3();
        if (keyStates.current['w'] || keyStates.current['arrowup']) {
          moveDirection.z -= 1;
        }
        if (keyStates.current['s'] || keyStates.current['arrowdown']) {
          moveDirection.z += 1;
        }
        if (keyStates.current['a'] || keyStates.current['arrowleft']) {
          moveDirection.x -= 1;
        }
        if (keyStates.current['d'] || keyStates.current['arrowright']) {
          moveDirection.x += 1;
        }

        // Normalize movement direction if multiple keys are pressed
        if (moveDirection.lengthSq() > 0) {
            moveDirection.normalize();
            // Apply acceleration in the direction
            ballVelocity.current.add(moveDirection.multiplyScalar(ACCELERATION * delta));
        }


        // Apply friction
        ballVelocity.current.multiplyScalar(FRICTION);

        // Calculate potential new position
        const potentialNewPos = ball.position.clone().add(
          ballVelocity.current.clone().multiplyScalar(delta)
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
        } else {
            // Collision detected
            // A more sophisticated collision response would check which wall was hit
            // and reflect the velocity accordingly. For this simple grid system,
            // we'll just dampen the velocity significantly.
            ballVelocity.current.multiplyScalar(-0.1); // Bounce back slightly and lose most velocity
             // Optionally, nudge the ball back to the edge of the current cell
             // This is complex with sphere-box collision, so we'll skip for now.
        }


        // Check if ball is at one of the destinations
        checkDestinations(ball.position);

        // Make camera follow the ball with some lag
        if (cameraRef.current && controlsRef.current) {
          controlsRef.current.target.set(
            ball.position.x,
            0, // Keep camera target at ground level
            ball.position.z
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
  }, [destinations, mazeComplexity, navigate]);

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
            {currentDestination && (
              <p className="text-xl font-bold">
                Destination reached: {currentDestination}! Navigating...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeMaze;