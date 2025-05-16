// routes/_index.tsx
import React, { Suspense} from "react";
import Navbar from "~/components/navbar";
import type {  MetaFunction } from "@remix-run/node";

import DaCubes4 from "~/components/three4";
import "../styles/index-route.css";


export const meta: MetaFunction = () => {
  return [
    { title: "Adam Aslan Portfolio" },
    { name: "description", content: "Adam Aslan's Portfolio with interactive 3D cubes for navigation to other pages" },
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
        logo={<div className="navbar-logo-text" style={{fontFamily: "'Permanent Marker', cursive"}}>Adam's Portfolio</div>} 
      />
      
      <div className="header-content"> {/* Changed from Tailwind classes */}
        <h1 className="main-title" style={{fontFamily: "'Permanent Marker', cursive"}}> 
        Interactive 3D cubes for navigation to other pages
        </h1>
        <h2 className="subtitle" style={{fontFamily: "'Permanent Marker', cursive"}}>Click on the cubes!</h2>
      </div>

      <Suspense fallback={<div className="loading-message">Loading 3D navigation...</div>}> {/* Changed from Tailwind classes */}
        <DaCubes4 
          cubes={customCubes}
          // textSize={0.8} // Removed this line
          // engraveDepth={0.3}
          // fontUrl="https://fonts.gstatic.com/s/permanentmarker/v16/Fh4uPib9Iyv2ucM6pGQMWimMp004La2Cfw.json"
        />
      </Suspense>
      
    </div>
  );
}