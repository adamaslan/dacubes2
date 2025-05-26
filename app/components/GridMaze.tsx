import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type GridMeshProps = {
  // You can add props here if needed
};

function GridScene() {
  const planeMeshRef = useRef<THREE.Mesh>(null);
  const highlightMeshRef = useRef<THREE.Mesh>(null);
  const [objects, setObjects] = useState<THREE.Mesh[]>([]);
  const mousePosition = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const { camera, scene } = useThree();
  
  // Create sphere mesh template
  const sphereGeometry = new THREE.SphereGeometry(0.4, 4, 2);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xFFEA00
  });
  
  useEffect(() => {
    // Set camera position
    camera.position.set(10, 15, -22);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);
  
  useEffect(() => {
    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!planeMeshRef.current || !highlightMeshRef.current) return;
      
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.current.setFromCamera(mousePosition.current, camera);
      const intersects = raycaster.current.intersectObject(planeMeshRef.current);
      
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
        highlightMeshRef.current.position.set(highlightPos.x, 0, highlightPos.z);
        
        const objectExist = objects.find(object => 
          object.position.x === highlightMeshRef.current!.position.x && 
          object.position.z === highlightMeshRef.current!.position.z
        );
        
        if (!objectExist) {
          highlightMeshRef.current.material.color.setHex(0xFFFFFF);
        } else {
          highlightMeshRef.current.material.color.setHex(0xFF0000);
        }
      }
    };
    
    // Handle mouse down
    const handleMouseDown = () => {
      if (!highlightMeshRef.current || !planeMeshRef.current) return;
      
      raycaster.current.setFromCamera(mousePosition.current, camera);
      const intersects = raycaster.current.intersectObject(planeMeshRef.current);
      
      if (intersects.length > 0) {
        const objectExist = objects.find(object => 
          object.position.x === highlightMeshRef.current!.position.x && 
          object.position.z === highlightMeshRef.current!.position.z
        );
        
        if (!objectExist) {
          const sphereClone = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
          sphereClone.position.copy(highlightMeshRef.current.position);
          scene.add(sphereClone);
          setObjects(prev => [...prev, sphereClone]);
          highlightMeshRef.current.material.color.setHex(0xFF0000);
          console.log(scene.children.length);
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [camera, objects, scene]);
  
  // Animation loop
  useFrame((state) => {
    if (!highlightMeshRef.current) return;
    
    const time = state.clock.getElapsedTime() * 1000;
    highlightMeshRef.current.material.opacity = 1 + Math.sin(time / 120);
    
    objects.forEach(object => {
      object.rotation.x = time / 1000;
      object.rotation.z = time / 1000;
      object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
    });
  });
  
  return (
    <>
      {/* Plane mesh for raycasting */}
      <mesh 
        ref={planeMeshRef} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial side={THREE.DoubleSide} visible={false} />
      </mesh>
      
      {/* Grid helper */}
      <gridHelper args={[20, 20]} />
      
      {/* Highlight mesh */}
      <mesh 
        ref={highlightMeshRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0.5, 0, 0.5]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          side={THREE.DoubleSide} 
          transparent 
          opacity={1} 
          color={0xFFFFFF}
        />
      </mesh>
    </>
  );
}

const GridMaze: React.FC<GridMeshProps> = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <GridScene />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
};

export default GridMaze;