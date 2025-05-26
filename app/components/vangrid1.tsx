import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useNavigate } from '@remix-run/react';

// Function to create text sprite
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
  context.font = 'Bold 24px Arial';
  context.textAlign = 'center';
  context.fillStyle = 'black';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Create texture and sprite
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2, 1, 1);
  
  return sprite;
};

type VanillaGridMazeProps = {
  destinations?: {
    name: string;
    link: string;
    position: [number, number]; // [x, z] position on grid
  }[];
};

const VanillaGridMaze: React.FC<VanillaGridMazeProps> = ({ 
  destinations = [
    { name: "Page 1", link: "/", position: [5, 5] },
    { name: "About", link: "/about", position: [10, 5] },
    { name: "Contact", link: "/contact", position: [5, 10] }
  ] 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Initialize scene
    const scene = new THREE.Scene();
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Initialize orbit controls
    const orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(10, 15, -22);
    orbit.update();
    
    // Create plane mesh
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false
      })
    );
    planeMesh.rotateX(-Math.PI / 2);
    scene.add(planeMesh);
    
    // Create grid helper
    const grid = new THREE.GridHelper(20, 20);
    scene.add(grid);
    
    // Add grid numbering
    for (let i = 0; i <= 20; i++) {
      for (let j = 0; j <= 20; j++) {
        // Only add numbers at intervals to avoid cluttering
        if (i % 5 === 0 && j % 5 === 0) {
          const gridText = createTextSprite(`${i},${j}`);
          if (gridText) {
            gridText.position.set(i, 0.1, j);
            gridText.scale.set(1, 0.5, 1); // Make the grid numbers smaller
            scene.add(gridText);
          }
        }
      }
    }
    
    // Create highlight mesh
    const highlightMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true
      })
    );
    highlightMesh.rotateX(-Math.PI / 2);
    highlightMesh.position.set(0.5, 0, 0.5);
    scene.add(highlightMesh);
    
    // Initialize raycaster and mouse position
    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let intersects: THREE.Intersection[] = [];
    
    // Create sphere mesh template
    const sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 4, 2),
      new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xFFEA00
      })
    );
    
    // Array to store created objects
    const objects: THREE.Mesh[] = [];
    
    // Create destination objects with text labels
    destinations.forEach(dest => {
      // Create sphere for destination
      const sphereClone = sphereMesh.clone();
      sphereClone.position.set(dest.position[0] + 0.5, 0.4, dest.position[1] + 0.5);
      sphereClone.material = new THREE.MeshBasicMaterial({
        color: 0x00AAFF,
        wireframe: false
      });
      
      // Add navigation data to sphere
      sphereClone.userData = { path: dest.link, name: dest.name };
      
      // Create text sprite
      const textSprite = createTextSprite(dest.name);
      if (textSprite) {
        textSprite.position.set(dest.position[0] + 0.5, 1.5, dest.position[1] + 0.5);
        textSprite.userData = { path: dest.link };
        scene.add(textSprite);
      }
      
      scene.add(sphereClone);
      objects.push(sphereClone);
    });
    
    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObject(planeMesh);
      
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
        highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
        
        const objectExist = objects.find(function(object) {
          return (object.position.x === highlightMesh.position.x) &&
                 (object.position.z === highlightMesh.position.z);
        });
        
        if (!objectExist) {
          // Just make the highlight less visible when not over an object
          highlightMesh.material.opacity = 0.2;
          highlightMesh.material.color.setHex(0xFFFFFF);
        } else {
          // Make highlight more visible when over an object
          highlightMesh.material.opacity = 0.5;
          highlightMesh.material.color.setHex(0xFF0000);
        }
      }
    };
    
    // Track if user is dragging
    let isDragging = false;
    
    const handleMouseDown = () => {
      isDragging = false;
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) return;
      
      // Check if we clicked on an object with navigation data
      raycaster.setFromCamera(mousePosition, camera);
      const objectIntersects = raycaster.intersectObjects(objects);
      
      if (objectIntersects.length > 0) {
        const clickedObject = objectIntersects[0].object;
        if (clickedObject.userData?.path) {
          // Visual feedback
          clickedObject.scale.multiplyScalar(1.2);
          
          // Navigate after a short delay
          setTimeout(() => {
            navigate(clickedObject.userData.path);
          }, 200);
        }
      }
      // Removed the code that creates new objects when clicking on empty cells
    };
    
    const handleMouseMove2 = () => {
      isDragging = true;
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    // Animation function
    function animate(time: number) {
      highlightMesh.material.opacity = 0.2 + 0.3 * Math.sin(time / 120);
      
      objects.forEach(function(object) {
        object.rotation.x = time / 1000;
        object.rotation.z = time / 1000;
        // Reduce the height variation to keep objects closer to grid
        object.position.y = 0.4 + 0.1 * Math.abs(Math.sin(time / 1000));
      });
      
      renderer.render(scene, camera);
    }
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove2);
    window.addEventListener('resize', handleResize);
    
    // Start animation loop
    renderer.setAnimationLoop(animate);
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove2);
      window.removeEventListener('resize', handleResize);
      
      // Stop animation loop
      renderer.setAnimationLoop(null);
      
      // Remove renderer from DOM
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
    };
  }, [destinations, navigate]);
  
  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default VanillaGridMaze;