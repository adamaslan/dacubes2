import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type VanillaGridMazeProps = {
  // You can add props here if needed
};

const VanillaGridMaze: React.FC<VanillaGridMazeProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
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
          highlightMesh.material.color.setHex(0xFFFFFF);
        } else {
          highlightMesh.material.color.setHex(0xFF0000);
        }
      }
    };
    
    // Handle mouse down
    const handleMouseDown = () => {
      const objectExist = objects.find(function(object) {
        return (object.position.x === highlightMesh.position.x) &&
               (object.position.z === highlightMesh.position.z);
      });
      
      if (!objectExist) {
        if (intersects.length > 0) {
          const sphereClone = sphereMesh.clone();
          sphereClone.position.copy(highlightMesh.position);
          scene.add(sphereClone);
          objects.push(sphereClone);
          highlightMesh.material.color.setHex(0xFF0000);
        }
      }
      console.log(scene.children.length);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    // Animation function
    function animate(time: number) {
      highlightMesh.material.opacity = 1 + Math.sin(time / 120);
      
      objects.forEach(function(object) {
        object.rotation.x = time / 1000;
        object.rotation.z = time / 1000;
        object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
      });
      
      renderer.render(scene, camera);
    }
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('resize', handleResize);
    
    // Start animation loop
    renderer.setAnimationLoop(animate);
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
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
  }, []);
  
  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default VanillaGridMaze;