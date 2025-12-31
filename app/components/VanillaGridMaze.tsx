import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type VanillaGridMazeProps = {
  onComplete?: () => void;
};

// Maze layout: 1 = wall, 0 = path, 2 = start, 3 = end
const MAZE_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const VanillaGridMaze: React.FC<VanillaGridMazeProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchInput = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Initialize renderer with shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x1a1a2e);
    container.appendChild(renderer.domElement);

    // Initialize scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

    // Initialize camera - isometric-style view
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(20, 25, 20);
    camera.lookAt(7.5, 0, 7.5);

    // Lighting for 3D effect
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Add point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0xff69b4, 0.5, 20);
    pointLight1.position.set(3, 5, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00f2f2, 0.5, 20);
    pointLight2.position.set(12, 5, 12);
    scene.add(pointLight2);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d2d44,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(7, 0, 7);
    floor.receiveShadow = true;
    scene.add(floor);

    // Wall material with gradient effect
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a6a,
      roughness: 0.5,
      metalness: 0.3,
    });

    // Wall geometry
    const wallHeight = 0.8;
    const wallGeometry = new THREE.BoxGeometry(1, wallHeight, 1);

    // Start position
    let startX = 1;
    let startZ = 1;

    // End position
    let endX = 13;
    let endZ = 13;

    // Store wall positions for collision detection
    const walls: { x: number; z: number }[] = [];

    // Build the maze
    for (let row = 0; row < MAZE_LAYOUT.length; row++) {
      for (let col = 0; col < MAZE_LAYOUT[row].length; col++) {
        const cell = MAZE_LAYOUT[row][col];

        if (cell === 1) {
          // Create wall
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(col + 0.5, wallHeight / 2, row + 0.5);
          wall.castShadow = true;
          wall.receiveShadow = true;
          scene.add(wall);
          walls.push({ x: col + 0.5, z: row + 0.5 });

          // Add top accent
          const topGeometry = new THREE.BoxGeometry(1.05, 0.1, 1.05);
          const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x6a6a8a,
            roughness: 0.3,
            metalness: 0.5,
          });
          const top = new THREE.Mesh(topGeometry, topMaterial);
          top.position.set(col + 0.5, wallHeight + 0.05, row + 0.5);
          scene.add(top);
        } else if (cell === 2) {
          startX = col + 0.5;
          startZ = row + 0.5;
        } else if (cell === 3) {
          endX = col + 0.5;
          endZ = row + 0.5;
        }
      }
    }

    // Create goal (glowing portal to frontend)
    const goalGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    const goalMaterial = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      emissive: 0xff69b4,
      emissiveIntensity: 0.5,
    });
    const goal = new THREE.Mesh(goalGeometry, goalMaterial);
    goal.position.set(endX, 0.05, endZ);
    scene.add(goal);

    // Goal glow ring
    const ringGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      emissive: 0xff69b4,
      emissiveIntensity: 1,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(endX, 0.3, endZ);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Goal arrow pointing up
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(endX, 1.0, endZ);
    scene.add(arrow);

    // "FRONTEND" text indicator (simple box for now)
    const labelGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.1);
    const labelMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.3,
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(endX, 1.5, endZ);
    scene.add(label);

    // Create player ball
    const ballRadius = 0.3;
    const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f2f2,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x00f2f2,
      emissiveIntensity: 0.2,
    });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(startX, ballRadius, startZ);
    ball.castShadow = true;
    scene.add(ball);

    // Ball trail effect
    const trailGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const trailMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f2f2,
      transparent: true,
      opacity: 0.5,
      emissive: 0x00f2f2,
      emissiveIntensity: 0.3,
    });
    const trailParticles: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const particle = new THREE.Mesh(trailGeometry, trailMaterial.clone());
      particle.visible = false;
      scene.add(particle);
      trailParticles.push(particle);
    }
    let trailIndex = 0;
    let lastTrailTime = 0;

    // Player velocity
    const velocity = { x: 0, z: 0 };
    const speed = 0.08;
    const friction = 0.9;

    // Collision detection
    const checkCollision = (newX: number, newZ: number): boolean => {
      for (const wall of walls) {
        const dx = Math.abs(newX - wall.x);
        const dz = Math.abs(newZ - wall.z);
        if (dx < 0.5 + ballRadius && dz < 0.5 + ballRadius) {
          return true;
        }
      }
      // Check boundaries
      if (newX < ballRadius || newX > 15 - ballRadius ||
          newZ < ballRadius || newZ > 15 - ballRadius) {
        return true;
      }
      return false;
    };

    // Check if player reached goal
    const checkGoal = (): boolean => {
      const dx = ball.position.x - endX;
      const dz = ball.position.z - endZ;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance < 0.5;
    };

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      // Prevent page scrolling with arrow keys
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    // Game state
    let gameWon = false;
    let winTime = 0;
    const winDuration = 2500; // ms before redirect

    // Win celebration particles
    const celebrationParticles: THREE.Mesh[] = [];
    const celebrationGeometry = new THREE.SphereGeometry(0.15, 8, 8);

    // Animation function
    let lastTime = 0;
    function animate(time: number) {
      const delta = time - lastTime;
      lastTime = time;

      // Win animation
      if (gameWon) {
        const elapsed = time - winTime;
        const progress = Math.min(elapsed / winDuration, 1);

        // Ball grows and glows
        const scale = 1 + progress * 2;
        ball.scale.set(scale, scale, scale);
        ballMaterial.emissiveIntensity = 0.2 + progress * 2;

        // Ball rises up
        ball.position.y = ballRadius + progress * 3;

        // Rotate ball faster
        ball.rotation.x += 0.1;
        ball.rotation.y += 0.15;

        // Spawn celebration particles
        if (Math.random() < 0.3) {
          const colors = [0xff69b4, 0x00f2f2, 0xffff00, 0x00ff00, 0xff00ff];
          const particleMat = new THREE.MeshStandardMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            emissive: colors[Math.floor(Math.random() * colors.length)],
            emissiveIntensity: 1,
          });
          const particle = new THREE.Mesh(celebrationGeometry, particleMat);
          particle.position.copy(ball.position);
          particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            Math.random() * 0.2 + 0.1,
            (Math.random() - 0.5) * 0.3
          );
          particle.userData.life = 1;
          scene.add(particle);
          celebrationParticles.push(particle);
        }

        // Update celebration particles
        for (let i = celebrationParticles.length - 1; i >= 0; i--) {
          const p = celebrationParticles[i];
          p.position.add(p.userData.velocity);
          p.userData.velocity.y -= 0.008; // gravity
          p.userData.life -= 0.02;
          p.scale.setScalar(p.userData.life);

          if (p.userData.life <= 0) {
            scene.remove(p);
            p.geometry.dispose();
            (p.material as THREE.Material).dispose();
            celebrationParticles.splice(i, 1);
          }
        }

        // Redirect after animation completes
        if (progress >= 1) {
          if (onComplete) {
            onComplete();
          } else {
            window.location.href = '/frontend';
          }
        }

        // Continue rendering during win animation
        renderer.render(scene, camera);
        return;
      }

      if (!gameWon) {
        // Handle keyboard input
        const keys = keysPressed.current;
        if (keys.has('w') || keys.has('arrowup')) velocity.z -= speed;
        if (keys.has('s') || keys.has('arrowdown')) velocity.z += speed;
        if (keys.has('a') || keys.has('arrowleft')) velocity.x -= speed;
        if (keys.has('d') || keys.has('arrowright')) velocity.x += speed;

        // Handle touch/joystick input
        velocity.x += touchInput.current.x * speed;
        velocity.z += touchInput.current.z * speed;

        // Apply friction
        velocity.x *= friction;
        velocity.z *= friction;

        // Calculate new position
        let newX = ball.position.x + velocity.x;
        let newZ = ball.position.z + velocity.z;

        // Check collisions separately for X and Z
        if (!checkCollision(newX, ball.position.z)) {
          ball.position.x = newX;
        } else {
          velocity.x = 0;
        }

        if (!checkCollision(ball.position.x, newZ)) {
          ball.position.z = newZ;
        } else {
          velocity.z = 0;
        }

        // Rotate ball based on movement
        ball.rotation.z -= velocity.x * 2;
        ball.rotation.x += velocity.z * 2;

        // Update trail
        if (time - lastTrailTime > 50 && (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.z) > 0.01)) {
          const particle = trailParticles[trailIndex];
          particle.position.set(ball.position.x, ballRadius, ball.position.z);
          particle.visible = true;
          (particle.material as THREE.MeshStandardMaterial).opacity = 0.5;
          trailIndex = (trailIndex + 1) % trailParticles.length;
          lastTrailTime = time;
        }

        // Fade trail particles
        trailParticles.forEach((particle) => {
          if (particle.visible) {
            const mat = particle.material as THREE.MeshStandardMaterial;
            mat.opacity -= 0.02;
            if (mat.opacity <= 0) {
              particle.visible = false;
            }
          }
        });

        // Check if reached goal
        if (checkGoal()) {
          gameWon = true;
          winTime = time;
          setShowWin(true);
        }
      }

      // Animate goal
      ring.rotation.z = time * 0.002;
      arrow.position.y = 1.0 + Math.sin(time * 0.003) * 0.2;
      arrow.rotation.y = time * 0.002;
      goalMaterial.emissiveIntensity = 0.3 + Math.sin(time * 0.005) * 0.2;

      // Camera follows ball slightly
      const targetX = 7.5 + (ball.position.x - 7.5) * 0.3;
      const targetZ = 7.5 + (ball.position.z - 7.5) * 0.3;
      camera.position.x += (targetX + 13 - camera.position.x) * 0.02;
      camera.position.z += (targetZ + 13 - camera.position.z) * 0.02;
      camera.lookAt(7.5, 0, 7.5);

      renderer.render(scene, camera);
    }

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    // Start animation loop
    renderer.setAnimationLoop(animate);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);

      renderer.setAnimationLoop(null);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

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
  }, [onComplete]);

  // Joystick touch handlers
  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const joystick = joystickRef.current;
    const knob = knobRef.current;
    if (!joystick || !knob) return;

    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMove = (clientX: number, clientY: number) => {
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const maxDistance = rect.width / 2 - 20;

      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);
      const angle = Math.atan2(deltaY, deltaX);

      const knobX = Math.cos(angle) * distance;
      const knobY = Math.sin(angle) * distance;

      knob.style.transform = `translate(${knobX}px, ${knobY}px)`;

      // Normalize to -1 to 1
      touchInput.current.x = knobX / maxDistance;
      touchInput.current.z = knobY / maxDistance;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleEnd = () => {
      knob.style.transform = 'translate(0px, 0px)';
      touchInput.current.x = 0;
      touchInput.current.z = 0;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
    };

    if ('touches' in e) {
      const touch = (e as React.TouchEvent).touches[0];
      handleMove(touch.clientX, touch.clientY);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    } else {
      handleMove((e as React.MouseEvent).clientX, (e as React.MouseEvent).clientY);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
    }
  };

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
      }}
      tabIndex={0}
    >
      {/* Win Overlay */}
      {showWin && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, rgba(255,105,180,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          zIndex: 100,
          animation: 'fadeIn 0.5s ease-out',
        }}>
          <div style={{
            color: 'white',
            fontFamily: 'Chewy, cursive',
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            textShadow: '0 0 20px #ff69b4, 0 0 40px #ff69b4, 0 0 60px #00f2f2',
            animation: 'pulse 0.5s ease-in-out infinite alternate',
          }}>
            YOU WIN!
          </div>
          <div style={{
            color: '#00f2f2',
            fontFamily: 'Chewy, cursive',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            marginTop: '20px',
            textShadow: '0 0 10px #00f2f2',
          }}>
            Entering Frontend Portfolio...
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontFamily: 'Chewy, cursive',
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: showWin ? 0 : 1,
        transition: 'opacity 0.3s',
      }}>
        <div style={{ marginBottom: '10px' }}>🎮 Navigate the Maze!</div>
        <div style={{ fontSize: '0.8em', opacity: 0.8 }}>
          Use WASD / Arrow Keys or the joystick to reach the pink goal
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}</style>

      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleJoystickStart}
        onMouseDown={handleJoystickStart}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          display: showWin ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          zIndex: 20,
          cursor: 'pointer',
        }}
      >
        <div
          ref={knobRef}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00f2f2, #ff69b4)',
            boxShadow: '0 4px 15px rgba(0, 242, 242, 0.4)',
            transition: 'transform 0.05s ease-out',
          }}
        />
      </div>

      {/* Direction arrows around joystick */}
      {!showWin && (
        <>
          <div style={{
            position: 'absolute',
            bottom: '165px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            pointerEvents: 'none',
            zIndex: 15,
          }}>▲</div>
          <div style={{
            position: 'absolute',
            bottom: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            pointerEvents: 'none',
            zIndex: 15,
          }}>▼</div>
          <div style={{
            position: 'absolute',
            bottom: '90px',
            left: 'calc(50% - 75px)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            pointerEvents: 'none',
            zIndex: 15,
          }}>◀</div>
          <div style={{
            position: 'absolute',
            bottom: '90px',
            left: 'calc(50% + 60px)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            pointerEvents: 'none',
            zIndex: 15,
          }}>▶</div>
        </>
      )}
    </div>
  );
};

export default VanillaGridMaze;
