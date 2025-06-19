import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import "../styles/threejs.css";

export const meta: MetaFunction = () => {
  return [
    { title: "ThreeJS and React 3 Fiber Projects" },
    { name: "description", content: "Explore ThreeJS and React 3 Fiber projects" },
  ];
};

export default function AIProjects() {
  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
  ];

  const logo = <div>Adam Timur Aslan</div>;

  return (
    <div className="threejs-container">
      <Navbar links={navLinks} logo={logo} />
      
      <main className="threejs-main">
        <h1 className="threejs-title">ThreeJS and React 3 Fiber Examples</h1>
        
        <div className="threejs-grid">
        <div
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">Rotating Sphere with Orbiting Text on Homepage 🌍🔴</h2>
              <p className="threejs-card-text">This React component creates an animated 3D splash screen using the **@react-three/fiber** and **@react-three/drei** libraries. It features a metallic sphere that continuously rotates on its own axes while simultaneously orbiting a central point. The sphere has the text **"ZXY"** rendered in red and beveled, appearing to be embedded on its surface. The animation is displayed within a styled canvas, illuminated by ambient and point lighting, making it suitable for a dynamic loading or branding screen.</p>
              {/* <p className="threejs-card-subtext">Click to view source code</p> */}
              </div> <video 
              autoPlay 
              loop 
              muted
              controls
              onClick={(e) => {
                if (e.currentTarget.requestFullscreen) {
                  e.currentTarget.requestFullscreen();
                }
              }}
              style={{ cursor: 'pointer' }}
            >
                <source src="/zxy4.mov" type="video/mp4" />
                Your browser does not support the video tag.
        </video>
            </div>
        
          <div
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">Interactive Blender Object in ThreeJS Environment with Custom Font</h2>
              <p className="threejs-card-text">This Vue.js component sets up a functioning 3D scene using **Three.js** and **Troika-Three-Text** to render animated 3D text with a font I created within a browser. When the component is mounted, it initializes a scene with a perspective camera, a WebGL renderer, and a point light to illuminate the environment. The key feature is a rotating 3D text mesh that displays the phrase **"nyc sound guy"** in bright red, created using the `Text` class from Troika. The text is positioned slightly above the center and continuously rotates along the Y-axis in the animation loop, which is handled with `requestAnimationFrame`. The scene is appended to a container div, and all Three.js resources are properly disposed of in the `beforeUnmount` hook to prevent memory leaks. The implementation demonstrates a clean and efficient way to integrate animated 3D text into a Vue.js application using modern 3D web technologies.
              </p>
              {/* <p className="threejs-card-subtext">Click to view source code</p> */}
              </div>
              <video 
              autoPlay 
              loop 
              muted
              controls
              onClick={(e) => {
                if (e.currentTarget.requestFullscreen) {
                  e.currentTarget.requestFullscreen();
                }
              }}
              style={{ cursor: 'pointer' }}
            >
                <source src="/sound1.mov" type="video/mp4" />
                Your browser does not support the video tag.
        </video>
           
        </div>
          <div 
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">Interactive Shapes and Text Component</h2>
              <p className="threejs-card-text">This React component defines a dynamic 3D scene using the @react-three/fiber and @react-three/drei libraries, which allow React developers to work seamlessly with Three.js. The main component, MovingObject1, renders a canvas that displays various 3D shapes (box, sphere, cylinder, torus) and animated text elements that move based on sine wave calculations, giving a lively, interactive feel. The Box1 component manages static 3D shapes and includes a rotating red box, while MovingText animates text objects ("nycpony") in different colors and motion patterns using the useFrame hook. The scene also includes environmental features like a Sky component and lighting (ambient and point light) to enhance realism. SetCanvasSize attempts to ensure the canvas fills the viewport, although its implementation may be unnecessary or buggy due to misuse of set. Overall, the code demonstrates how to build an animated, visually engaging 3D scene within a React app.</p>
              {/* <p className="threejs-card-subtext">Click to view source code</p> */}
              </div> <video 
              autoPlay 
              loop 
              muted
              controls
              onClick={(e) => {
                if (e.currentTarget.requestFullscreen) {
                  e.currentTarget.requestFullscreen();
                }
              }}
              style={{ cursor: 'pointer' }}
            >
                <source src="/nycpony.mov" type="video/mp4" />
                Your browser does not support the video tag.
        </video>
            
          </div>
          <div 
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">Interactive Stars, Sphere, Text Space, and Donut Banner</h2>
              <p className="threejs-card-text">This React component creates an interactive 3D scene using **@react-three/fiber** and **@react-three/drei**. It features a **metallic sphere** that orbits in a circular path with the text "TTB" floating in front of it, and a **rotating orange torus** at the center. The scene is set within a responsive canvas with a dark background, enhanced by pink-tinted hemispheric and point lighting, and a dynamic **starfield** for added depth. Users can interactively explore the scene thanks to **OrbitControls** for camera movement. The code demonstrates a clean, modular way to build animated 3D web visuals in React. </p>
              {/* <p className="threejs-card-subtext">Click to view source code</p> */}
             
            </div>
            <video 
              autoPlay 
              loop 
              muted
              controls
              onClick={(e) => {
                if (e.currentTarget.requestFullscreen) {
                  e.currentTarget.requestFullscreen();
                }
              }}
              style={{ cursor: 'pointer' }}
            >
                <source src="/stars1.mov" type="video/mp4" />
                Your browser does not support the video tag.
        </video>
          </div>
          {/* Repeat for other cards with appropriate color classes */}
        </div>
      </main>
    </div>
  );
}