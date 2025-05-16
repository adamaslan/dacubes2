import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from '@remix-run/react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Added .js extension
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; // Added .js extension
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; // Added explicit import
import "../styles/global.css"
// ==================== 1. TYPES AND INTERFACES ====================
type CubeData = {
  name: string;
  link: string;
  modelUrl?: string;
};

type DaCubes4Props = {
  fontUrl?: string;
  cubes?: CubeData[];
  engraveDepth?: number;
  textSize?: number;
  movementIntensity?: number;
};

// ==================== 2. COMPONENT DEFINITION ====================
const DaCubes4: React.FC<DaCubes4Props> = ({
  fontUrl = 'https://cdn.jsdelivr.net/npm/three/examples/fonts/gentilis_regular.typeface.json',
  cubes = [],
  engraveDepth = 0.3,
  textSize = 0.6,
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

    // Create text geometry helper function
    const createTextGeometry = (font: any, text: string) => {
      return new TextGeometry(text, {
        font: font,
        size: textSize,
        depth: engraveDepth,
        curveSegments: 4,
      });
    };

    // Create shape object with text
    const createShapeObject = async (data: CubeData, font: any) => {
      const group = new THREE.Group();
      let mainMesh: THREE.Object3D;

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
      const textGeo = createTextGeometry(font, data.name);
      const textMesh = new THREE.Mesh(
        textGeo,
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      textMesh.position.z = 3.5;

      group.add(mainMesh);
      group.add(textMesh);
      return group;
    };

    // Object movement and animation function
    const setupCuteMovement = (object: THREE.Object3D) => {
      const initialPosition = object.position.clone();
      const speed = 0.2 + Math.random() * 0.3;
      const angleOffset = Math.random() * Math.PI * 2;

      return () => {
        const time = clock.current.getElapsedTime() * speed;
        
        // Bouncy floating animation
        object.position.y = initialPosition.y + Math.sin(time + angleOffset) * 1.5;
        object.rotation.x = Math.sin(time * 0.5) * 0.5;
        object.rotation.y = Math.cos(time * 0.3) * 0.5;
        object.rotation.z = Math.sin(time * 0.4) * 0.3;

        // Gentle scale pulsation
        object.scale.setScalar(1 + Math.sin(time * 2) * 0.05 * movementIntensity);
      };
    };

    // Load fonts and create objects
    const fontLoader = new FontLoader();
    const cubeUpdaters: (() => void)[] = [];

    fontLoader.load(
      fontUrl, 
      // On success
      async (font) => {
        for (const data of cubes) {
          const group = await createShapeObject(data, font);
          
          // Position randomly in a spherical pattern
          const radius = 10 + Math.random() * 10;
          const angle = Math.random() * Math.PI * 2;
          group.position.set(
            Math.cos(angle) * radius,
            Math.random() * 8 - 4,
            Math.sin(angle) * radius
          );

          group.userData = { path: data.link };
          scene.add(group);
          cubeUpdaters.push(setupCuteMovement(group));
        }
        
        setIsLoading(false);
      },
      // On progress
      (xhr) => {
        console.log(`Font loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      // On error
      (error) => {
        console.error('Font loading failed:', error);
        setIsLoading(false);
      }
    );

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
  }, [cubes, engraveDepth, fontUrl, movementIntensity, navigate, textSize]);

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