import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from '@remix-run/react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
      const speed = (0.2 + Math.random() * 0.3) * 1.2; // 20% faster
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
      for (const data of cubes) {
        const group = await createShapeObject(data);
        
        // Position randomly in a spherical pattern, but restrict Z so cubes don't go deep into the background
        const radius = 10 + Math.random() * 10;
        const angle = Math.random() * Math.PI * 2;
        const zMax = 2; // reduced maximum distance into background by 50%
        group.position.set(
          Math.cos(angle) * radius,
          Math.random() * 8 - 4,
          Math.max(-zMax, Math.min(zMax, Math.sin(angle) * radius)) // clamp Z
        );

        group.userData = { path: data.link };
        scene.add(group);
        cubeUpdaters.push(setupCuteMovement(group));
      }
      
      setIsLoading(false);
    };
    
    loadObjects().catch(error => {
      console.error("Failed to load objects:", error);
      setIsLoading(false);
    });

    // ==================== 4. INTERACTION AND ANIMATION LOOP ====================
    // Click handler for object selection
    const handleClick = (e: MouseEvent) => {
      if (!sceneCurrent.current) return;
      
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(sceneCurrent.current.children, true);

      if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        
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

      if (rendererCurrent.current && sceneCurrent.current) {
        rendererCurrent.current.render(sceneCurrent.current, camera);
      }
    };
    
    // Start animation loop
    animate();

    // Add event listeners
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      
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