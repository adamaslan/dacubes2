// routes/_index.tsx
import React, { Suspense} from "react";
import Navbar from "~/components/navbar";
import type {  MetaFunction } from "@remix-run/node";
// import GridMaze from '~/components/GridMaze';
import VanillaGridMaze from '~/components/vangrid1';

import DaCubes4 from "~/components/three4";
import DreiNav from "~/components/DreiNav";
import TextAnimation from "../components/TextAnimation";
//  import  TextAnimation2 from "../components/TextAnimation1b";
import "../styles/index-route.css";
// import ThreeMaze from "~/components/maze1";
// import NavigationMaze from "~/components/navigationMaze";
import MazePage from "~/components/maze2";

export const meta: MetaFunction = () => {
  return [
    { title: "Adam Aslan Portfolio" },
    { name: "description", content: "3D AI Fullstack Developer - Welcome to my portfolio showcasing various projects including ThreeJS and AI work." },
    // General Open Graph tags for the portfolio
    { property: "og:title", content: "Adam Aslan Portfolio" },
    { property: "og:description", content: "Explore the 3D, AI, and Fullstack development portfolio of Adam Aslan." },
    { property: "og:type", content: "website" },
    // Optional: Add an image representing your portfolio for og:image
    // { property: "og:image", content: "/path/to/your-portfolio-preview-image.jpg" }, // Absolute URL when deployed

    // Optional: If you want to specifically highlight /sound1.mov when sharing the main page URL
    // You might choose to omit these if the video isn't a central piece of the homepage
    { property: "og:video", content: "/sound1.mov" }, // Absolute URL needed when deployed: e.g., https://yourdomain.com/sound1.mov
    { property: "og:video:type", content: "video/mp4" },
    // { property: "og:video:width", content: "1280" },
    // { property: "og:video:height", content: "720" },
  ];
};

export default function Index() {
  const customCubes = [
    { name: 'Frontend', link: '/frontend' },
    // { name: 'AI Projects', link: '/aiprojects' },
    // { name: 'Blender', link: '/blender' },
    { name: 'Contact', link: '/contact' },
    { name: 'ThreeJS', link: '/threejs' },  
  ];

  return (
    <div className="page-container"> {/* Changed from Tailwind classes */}
      <Navbar 
        links={[
          { href: "/", text: "Home" },
          { href: "/about", text: "About" },
          { href: "/contact", text: "Contact" }
        ]} 
        logo={<div className="navbar-logo-tetxt" style={{fontFamily: "'Permanent Marker', cursive"}}>Adam Aslan's Portfolio</div>} 
      />
      
      <div className="header-content"> {/* Changed from Tailwind classes */}
        <h1 className="main-title" style={{fontFamily: "'Permanent Marker', cursive"}}> 
        3D AI Fullstack Developer
        </h1>
        <h2 className="subtitle" style={{fontFamily: "'Permanent Marker', cursive"}}>Welcome to My Portfolio</h2>
      </div>

      {/* Add TextAnimation component */}
      {/* <div style={{ height: '300px', marginBottom: '30px' }}> */}
        {/* <TextAnimation 
          message="Welcome to Adam's Portfolio" 
          fontPath="/fonts/ChakraPetch-Bold.ttf" 
          bgHue={0.3} 
        /> */}
      {/* </div> */}

      <Suspense fallback={<div className="loading-message">Loading 3D navigation...</div>}> 
        {/* <VanillaGridMaze /> */}
        {/* Comment out other components */}
        <div style={{ 
          width: '100vw', 
          height: '100vh', 
          background: '#ff69b4',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 45vw)',
          gap: '2vw',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2vw'
        }}>
          <a href="/frontend" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
           <TextAnimation 
  text="Frontend" 
  effect="waves"
  backgroundIntensity={1.2}
  primaryColor="#ff6b6b"
  secondaryColor="#4ecdc4"
/>
          </a>
          <a href="/threejs" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
    <TextAnimation 
  text="ThreeJS" 
  backgroundEffect="grid"
  backgroundIntensity={1}
  primaryColor="#00ffff"
  secondaryColor="#ff00ff"
/>
          </a>
        </div>
        {/* <TextAnimation2 text="ThreeJS" /> */}
      </Suspense>
    </div>
  );
}