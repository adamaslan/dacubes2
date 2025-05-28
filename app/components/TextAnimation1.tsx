import React, { useEffect, useRef } from 'react';
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getBgSphere from "./getBgSphere";

import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

interface TextAnimationProps {
  message?: string;
  fontPath?: string;
  bgHue?: number;
}

const TextAnimation: React.FC<TextAnimationProps> = ({
  message = "Three.js",
  fontPath = "./fonts/ChakraPetch-Bold.ttf",
  bgHue = 0.6
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    text: THREE.Group | null;
    animationId: number | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    text: null,
    animationId: null
  });

  function createOutlines({ font, message }: { font: Font; message: string }) {
    const strokeGroup = new THREE.Group();
  
    let totalDist = 1.0;
    const lineMaterial = new LineMaterial({
      color: 0xffffff,
      linewidth: 3,
      dashed: true,
      dashSize: totalDist * 2,
      gapSize: totalDist * 2,
      dashOffset: Math.random() * totalDist,
    });
  
    function getStrokeMesh({ shape, i = 0.0 }: { shape: THREE.Shape; i?: number }) {
      let points = shape.getPoints();
      let points3d: number[] = [];
      points.forEach((p) => {
        points3d.push(p.x, p.y, 0);
      });
      const lineGeo = new LineGeometry();
      lineGeo.setPositions(points3d);
    
      totalDist = shape.getLength();
      lineMaterial.dashSize = totalDist * 2;
      lineMaterial.gapSize = totalDist * 2;
      lineMaterial.dashOffset = Math.random() * totalDist;
      
      const strokeMesh = new Line2(lineGeo, lineMaterial);
      strokeMesh.computeLineDistances();
      let offset = i * 0;
      strokeMesh.userData.update = (t: number) => {
        strokeMesh.material.dashOffset = t * (totalDist * 0.1) + offset;
      };
      return strokeMesh;
    }
  
    const shapes = font.generateShapes(message, 1);
    shapes.forEach((s: THREE.Shape, i: number) => {
      strokeGroup.add(getStrokeMesh({ shape: s, i }));
  
      if (s.holes?.length > 0) {
        s.holes.forEach((h) => {
          strokeGroup.add(getStrokeMesh({ shape: new THREE.Shape(h.getPoints()), i }));
        });
      }
    });
    strokeGroup.userData.update = (t: number) => {
      strokeGroup.children.forEach((c) => {
        c.userData.update?.(t);
      });
    };
    return strokeGroup;
  }
  
  function createText({ font, message }: { font: Font; message: string }) {
    const textGroup = new THREE.Group();
    const props = {
      font,
      size: 1,
      depth: 0.1,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: 2,
    };
    const textGeo = new TextGeometry(message, props);
    textGeo.computeBoundingBox();
    const centerOffset = -0.5 * (textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x);
    const glassMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.5,
      transmission: 1.0,
      transparent: true,
      thickness: 1.0,
    });
    const textMesh = new THREE.Mesh(textGeo, glassMat);
    textMesh.position.x = centerOffset;
    textGroup.add(textMesh);
  
    const outlineText = createOutlines({ font, message });
    outlineText.position.set(centerOffset, 0, 0.2);
    textGroup.add(outlineText);
  
    textGroup.userData.update = (t: number) => {
      let timeStep = t * 0.005;
      outlineText.userData.update(timeStep);
    };
    return textGroup;
  }

  function initScene(res: any) {
    const { scene, camera, renderer, controls } = sceneRef.current;
    if (!scene || !camera || !renderer || !controls) return;
    
    const font = new Font(res);
    const text = createText({ font, message });
    scene.add(text);
    sceneRef.current.text = text;
    animate(0);
  }
  
  function animate(timeStep: number) {
    const { scene, camera, renderer, text } = sceneRef.current;
    if (!scene || !camera || !renderer) return;
    
    sceneRef.current.animationId = requestAnimationFrame(animate);
    if (text) {
      text.userData.update(timeStep);
    }
    renderer.render(scene, camera);
    if (sceneRef.current.controls) {
      sceneRef.current.controls.update();
    }
  }
  
  function loadFont() {
    const loader = new TTFLoader();
    loader.load(fontPath, (res: any) => {
      initScene(res);
    });
  }

  function handleWindowResize() {
    const { camera, renderer } = sceneRef.current;
    if (!camera || !renderer || !containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // const bgSphere = getBgSphere({ hue: bgHue });
    // scene.add(bgSphere);
    
    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      text: null,
      animationId: null
    };
    
    // Initialize
    loadFont();
    
    // Event listeners
    window.addEventListener('resize', handleWindowResize);
    
    // Cleanup
    return () => {
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (containerRef.current && sceneRef.current.renderer && containerRef.current.contains(sceneRef.current.renderer.domElement)) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [bgHue, fontPath, message]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  );
};

export default TextAnimation;