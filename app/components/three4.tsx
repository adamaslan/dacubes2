import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// Remove this line as it's incorrect
// import '@types/three';
import { useNavigate } from '@remix-run/react';


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

// ==================== SETUP SECTION ====================
const DaCubes4: React.FC<DaCubes4Props> = ({
  fontUrl = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/fonts/helvetiker_regular.typeface.json',
  cubes = [],
  engraveDepth = 0.3,
  textSize = 0.6,
  movementIntensity = 0.5
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const clock = useRef(new THREE.Clock());
  const mixers = useRef<THREE.AnimationMixer[]>([]);

  // ==================== FONT & LINKS SECTION ====================
  const createTextGeometry = (font: any, text: string) => {
    // We'll import TextGeometry dynamically in useEffect
    if (typeof window === 'undefined') return null;
    return null; // Placeholder for server-side rendering
  };

  const handleObjectClick = (path: string) => {
    navigate(path);
  };

  // ==================== MAIN EFFECT ====================
  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    // Client-side only imports
    const loadModules = async () => {
      const FontLoaderModule = await import('three/examples/jsm/loaders/FontLoader');
      const TextGeometryModule = await import('three/examples/jsm/geometries/TextGeometry');
      const GLTFLoaderModule = await import('three/examples/jsm/loaders/GLTFLoader');
      
      const FontLoader = FontLoaderModule.FontLoader;
      const TextGeometry = TextGeometryModule.TextGeometry;
      const GLTFLoader = GLTFLoaderModule.GLTFLoader;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      mountRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 10);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Create text geometry function (now with loaded modules)
      const createTextGeometryClient = (font: any, text: string) => {
        const textGeo = new TextGeometry(text, {
          font: font,
          size: textSize,
          height: engraveDepth,
          curveSegments: 4,
        });
        textGeo.computeBoundingBox();
        return textGeo;
      };

      // Create shape object function
      const createShapeObject = async (data: CubeData, font: any) => {
        const group = new THREE.Group();
        let mainMesh: THREE.Object3D;

        // Load GLB model if provided, otherwise create geometric shape
        if (data.modelUrl) {
          const loader = new GLTFLoader();
          const gltf = await loader.loadAsync(data.modelUrl);
          mainMesh = gltf.scene;
          if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(mainMesh);
            mixer.clipAction(gltf.animations[0]).play();
            mixers.current.push(mixer);
          }
        } else {
          const geometry = new THREE.DodecahedronGeometry(2 + Math.random() * 2);
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
            metalness: 0.2,
            roughness: 0.5,
          });
          mainMesh = new THREE.Mesh(geometry, material);
        }

        // Add text label
        const textGeo = createTextGeometryClient(font, data.name);
        const textMesh = new THREE.Mesh(
          textGeo,
          new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        textMesh.position.z = 3.5;

        group.add(mainMesh);
        group.add(textMesh);
        return group;
      };

      // Setup cute movement
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

      fontLoader.load(fontUrl, async (font) => {
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

        camera.position.z = 25;
        camera.lookAt(0, 0, 0);
      });

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.current.getDelta();
        
        // Update all cube movements
        cubeUpdaters.forEach(update => update());
        
        // Update animation mixers
        mixers.current.forEach(mixer => mixer.update(delta));

        renderer.render(scene, camera);
      };
      animate();

      // Event handlers
      const handleClick = (e: MouseEvent) => {
        const mouse = new THREE.Vector2(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        );
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects[0]?.object.parent?.userData?.path) {
          handleObjectClick(intersects[0].object.parent.userData.path);
        }
      };

      window.addEventListener('click', handleClick);
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      return () => {
        window.removeEventListener('click', handleClick);
        scene.clear();
        renderer.dispose();
        if (mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    };

    loadModules();
  }, [cubes, engraveDepth, fontUrl, movementIntensity, navigate, textSize]);

  return <div ref={mountRef} className="w-full h-screen" />;
};

export default DaCubes4;