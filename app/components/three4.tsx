import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from '@remix-run/react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ==================== 1. TYPES AND INTERFACES ====================
type CubeData = {
  name: string;
  link: string;
  modelUrl?: string;
};

type DaCubes4Props = {
  cubes?: CubeData[];
  movementIntensity?: number;
};

// ==================== 2. COMPONENT DEFINITION ====================
const DaCubes4: React.FC<DaCubes4Props> = ({
  cubes = [],
  movementIntensity = 0.5
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const clock = useRef(new THREE.Clock());
  const sceneCurrent = useRef<THREE.Scene | null>(null);
  const rendererCurrent = useRef<THREE.WebGLRenderer | null>(null);
  const mixers = useRef<THREE.AnimationMixer[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const controlsRef = useRef<OrbitControls | null>(null);
  const isDragging = useRef(false);
  // Define clickableObjects at component level
  const clickableObjects = useRef<THREE.Object3D[]>([]);
  // Track selected object for keyboard navigation
  const selectedObjectIndex = useRef<number>(-1);

  // Navigation handler for cube clicks
  const handleObjectClick = (path: string) => {
    navigate(path);
  };

  // ==================== 3. SCENE SETUP AND MANAGEMENT ====================
  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    // Scene & renderer setup
    const scene = new THREE.Scene();
    sceneCurrent.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererCurrent.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.enablePan = false; // Disable panning for better UX

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create text using sprite instead of geometry
    const createTextSprite = (text: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      // Set canvas dimensions
      canvas.width = 256;
      canvas.height = 128;
      
      // Draw background (transparent)
      context.fillStyle = 'rgba(0,0,0,0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text styling
      context.font = 'Bold 36px Arial';
      context.textAlign = 'center';
      context.fillStyle = 'black'; // Changed from 'white' to 'black'
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      // Create texture and sprite
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(5, 2.5, 1);
      
      return sprite;
    };

    // Create shape object with text
    const createShapeObject = async (data: CubeData) => {
      const group = new THREE.Group();
      let mainMesh: THREE.Object3D;
      let textSprite: THREE.Sprite | null = null;
      let textOrbitAngle = Math.random() * Math.PI * 2; // randomize initial angle

      if (data.modelUrl) {
        try {
          const loader = new GLTFLoader();
          const gltf = await loader.loadAsync(data.modelUrl);
          mainMesh = gltf.scene;
          
          // Handle animations if present
          if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(mainMesh);
            mixer.clipAction(gltf.animations[0]).play();
            mixers.current.push(mixer);
          }
        } catch (error) {
          console.error(`Failed to load model ${data.modelUrl}:`, error);
          // Fallback to geometric shape on error
          const geometry = new THREE.DodecahedronGeometry(2 + Math.random() * 2);
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
            metalness: 0.2,
            roughness: 0.5,
          });
          mainMesh = new THREE.Mesh(geometry, material);
        }
      } else {
        // Create geometric shape if no model URL
        const geometry = new THREE.DodecahedronGeometry(2 + Math.random() * 2);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
          metalness: 0.2,
          roughness: 0.5,
        });
        mainMesh = new THREE.Mesh(geometry, material);
      }

      // Add text label
      textSprite = createTextSprite(data.name);
      if (textSprite) {
        textSprite.position.z = 3.5;
        // Add navigation data to text sprite
        textSprite.userData = { path: data.link };
        group.add(textSprite);
        // Store reference for orbit animation
        (group as any).textSprite = textSprite;
        (group as any).textOrbitAngle = textOrbitAngle;
      }

      group.add(mainMesh);
      return group;
    };

    // Object movement and animation function
    const setupCuteMovement = (object: THREE.Object3D) => {
      const initialPosition = object.position.clone();
      const speed = (0.2 + Math.random() * 0.3) * 2; // 20% faster
      const angleOffset = Math.random() * Math.PI * 2;
      const orbitRadius = 3.5; // distance from cube center

      return () => {
        const time = clock.current.getElapsedTime() * speed;

        // Bouncy floating animation
        object.position.y = initialPosition.y + Math.sin(time + angleOffset) * 1.5;
        object.rotation.x = Math.sin(time * 0.5) * 0.5;
        object.rotation.y = Math.cos(time * 0.3) * 0.5;
        object.rotation.z = Math.sin(time * 0.4) * 0.3;

        // Gentle scale pulsation
        object.scale.setScalar(1 + Math.sin(time * 2) * 0.05 * movementIntensity);

        // Orbit text sprite around the cube
        const group = object as any;
        if (group.textSprite) {
          // Update the orbit angle
          group.textOrbitAngle += 0.01; // adjust speed as desired
          const angle = group.textOrbitAngle;
          group.textSprite.position.x = Math.cos(angle) * orbitRadius;
          group.textSprite.position.z = Math.sin(angle) * orbitRadius;
          group.textSprite.position.y = 0.5 * Math.sin(angle * 2); // optional: add some vertical movement
          group.textSprite.lookAt(0, 0, 0); // make text always face the camera (optional)
        }
      };
    };

    // Create objects directly (no font loader needed)
    const cubeUpdaters: (() => void)[] = [];

    const loadObjects = async () => {
      const positions: THREE.Vector3[] = []; // Track existing positions
      const minDistance = 6; // Minimum distance between cube centers
      
      // Clear clickable objects array before adding new ones
      clickableObjects.current = [];
      
      // Define boundaries to ensure objects stay in visible area
      const maxRadius = 15; // Reduced from previous value
      const maxHeight = 6;  // Reduced from previous value
      const maxDepth = 2;   // Keep objects closer to camera
      
      for (const data of cubes) {
        const group = await createShapeObject(data);
        
        // Try to find a position that's far enough from existing cubes
        let attempts = 0;
        let validPosition = false;
        let newPosition = new THREE.Vector3();
        
        while (!validPosition && attempts < 50) {
          // Position randomly in a spherical pattern with tighter constraints
          const radius = 5 + Math.random() * maxRadius;
          const angle = Math.random() * Math.PI * 2;
          
          newPosition.set(
            Math.cos(angle) * radius,
            Math.random() * maxHeight - maxHeight/2,
            Math.max(-maxDepth, Math.min(maxDepth, Math.sin(angle) * radius))
          );
          
          // Check distance from all existing positions
          validPosition = true;
          for (const pos of positions) {
            if (newPosition.distanceTo(pos) < minDistance) {
              validPosition = false;
              break;
            }
          }
          
          attempts++;
        }
        
        // Set the position and track it
        group.position.copy(newPosition);
        positions.push(newPosition.clone());
        
        group.userData = { path: data.link };
        scene.add(group);
        cubeUpdaters.push(setupCuteMovement(group));
        
        // Add group to clickable objects
        clickableObjects.current.push(group);
      }
      
      setIsLoading(false);
    };
    
    loadObjects().catch(error => {
      console.error("Failed to load objects:", error);
      setIsLoading(false);
    });

    // ==================== 4. INTERACTION AND ANIMATION LOOP ====================
    // Click handler for object selection
    // Track mouse events for distinguishing between dragging and clicking
    const handleMouseDown = () => {
      isDragging.current = false;
    };

    const handleMouseMove = () => {
      isDragging.current = true;
    };

    // Add touch support
    const handleTouchStart = () => {
      isDragging.current = false;
    };
    
    const handleTouchMove = () => {
      isDragging.current = true;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (isDragging.current || !sceneCurrent.current) return;
      
      // Prevent default to avoid scrolling
      e.preventDefault();
      
      const touch = e.changedTouches[0];
      const mouse = new THREE.Vector2(
        (touch.clientX / window.innerWidth) * 2 - 1,
        -(touch.clientY / window.innerHeight) * 2 + 1
      );
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(sceneCurrent.current.children, true);
    
      if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        
        // Check if the clicked object itself has navigation data
        if (clickedObject.userData?.path) {
          // Visual feedback before navigation
          clickedObject.scale.multiplyScalar(1.2);
          
          // Delay navigation for visual feedback
          setTimeout(() => {
            handleObjectClick(clickedObject.userData.path);
          }, 200);
          return;
        }
        
        // Traverse up to find the object with userData.path
        while (clickedObject && !clickedObject.userData?.path) {
          if (!clickedObject.parent || clickedObject.parent === sceneCurrent.current) {
            break;
          }
          clickedObject = clickedObject.parent as THREE.Object3D;
        }
        
        if (clickedObject?.userData?.path) {
          // Visual feedback before navigation
          clickedObject.scale.multiplyScalar(1.2);
          if (clickedObject instanceof THREE.Mesh && 
              clickedObject.material instanceof THREE.MeshStandardMaterial) {
            clickedObject.material.emissive.set(0x333333);
          }
          
          // Delay navigation for visual feedback
          setTimeout(() => {
            handleObjectClick(clickedObject.userData.path);
          }, 200);
        }
      }
    };

    // Modify keyboard navigation handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!clickableObjects.current.length) return;
      
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            // Previous object
            selectedObjectIndex.current = (selectedObjectIndex.current - 1 + clickableObjects.current.length) % clickableObjects.current.length;
          } else {
            // Next object
            selectedObjectIndex.current = (selectedObjectIndex.current + 1) % clickableObjects.current.length;
          }
          
          // Highlight the selected object
          const selectedObject = clickableObjects.current[selectedObjectIndex.current];
          // Move camera to focus on this object
          if (controlsRef.current) {
            controlsRef.current.target.copy(selectedObject.position);
          }
          break;
          
        case 'Enter':
          // Activate the currently selected object
          if (selectedObjectIndex.current >= 0 && selectedObjectIndex.current < clickableObjects.current.length) {
            const selectedObject = clickableObjects.current[selectedObjectIndex.current];
            if (selectedObject.userData?.path) {
              handleObjectClick(selectedObject.userData.path);
            }
          }
          break;
      }
    };

    // Modify click handler to check if user was dragging
    const handleClick = (e: MouseEvent) => {
      if (isDragging.current || !sceneCurrent.current) return;
      
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      
      // Raycast against all scene children to catch both cubes and text sprites
      const intersects = raycaster.intersectObjects(sceneCurrent.current.children, true);

      if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        
        // Check if the clicked object itself has navigation data
        if (clickedObject.userData?.path) {
          handleObjectClick(clickedObject.userData.path);
          return;
        }
        
        // Traverse up to find the object with userData.path
        while (clickedObject && !clickedObject.userData?.path) {
          if (!clickedObject.parent || clickedObject.parent === sceneCurrent.current) {
            break;
          }
          clickedObject = clickedObject.parent as THREE.Object3D;
        }
        
        if (clickedObject?.userData?.path) {
          handleObjectClick(clickedObject.userData.path);
        }
      }
    };

    // Resize handler for responsive rendering
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      if (rendererCurrent.current) {
        rendererCurrent.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      const delta = clock.current.getDelta();
      
      // Update all cube movements
      cubeUpdaters.forEach(update => update());
      
      // Update animation mixers
      mixers.current.forEach(mixer => mixer.update(delta));

      // Update orbit controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererCurrent.current && sceneCurrent.current) {
        rendererCurrent.current.render(sceneCurrent.current, camera);
      }
    };
    
    // Start animation loop
    animate();

    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (sceneCurrent.current) {
        sceneCurrent.current.clear();
      }
      
      if (rendererCurrent.current) {
        rendererCurrent.current.dispose();
        if (mountRef.current && rendererCurrent.current.domElement) {
          mountRef.current.removeChild(rendererCurrent.current.domElement);
        }
      }
      
      // Clear mixers
      mixers.current = [];
    };
  }, [cubes, movementIntensity, navigate]);

  return (
    <div ref={mountRef} className="w-full h-screen">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-lg">
          Loading 3D objects...
        </div>
      )}
    </div>
  );
};

export default DaCubes4;