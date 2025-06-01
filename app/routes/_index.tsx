// routes/_index.tsx
import React, { Suspense} from "react";
import Navbar from "~/components/navbar";
import type {  MetaFunction } from "@remix-run/node";
// import GridMaze from '~/components/GridMaze';
import VanillaGridMaze from '~/components/vangrid1';

import DaCubes4 from "~/components/three4";
import DreiNav from "~/components/DreiNav";
import TextAnimation from "../components/TextAnimation";
import "../styles/index-route.css";
// import ThreeMaze from "~/components/maze1";
// import NavigationMaze from "~/components/navigationMaze";
import MazePage from "~/components/maze2";

export const meta: MetaFunction = () => {
  return [
    { title: "Adam Aslan Portfolio" },
    { name: "description", content: "3D AI Fullstack Developer" },
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
        <div style={{ width: '100vw', height: '100vh', background: '#282c34' }}>
    <TextAnimation text="Adam  Aslan" />
  </div>
      </Suspense>
    </div>
  );
}