// routes/_index.tsx
import React, { Suspense} from "react";
import Navbar from "~/components/navbar";
import type { MetaFunction } from "@remix-run/node";

import DaCubes4 from "~/components/three4";

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
    <div className="min-h-screen bg-gray-900">
      <Navbar 
        links={[
          { href: "/", text: "Home" },
          { href: "/about", text: "About" },
          { href: "/contact", text: "Contact" }
        ]} 
        logo={<div className="text-white font-bold">LOGO</div>}
      />
      
      <div className="relative z-10 pt-24 text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
        Adam Aslan's Portfolio with interactive 3D cubes for navigation to other pages
        </h1>
        <h2>Click on the cubes!</h2>
      </div>

      <Suspense fallback={<div className="text-white text-center">Loading 3D navigation...</div>}>
        <DaCubes4 
          cubes={customCubes}
          textSize={0.8}
          engraveDepth={0.3}
          fontUrl="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/fonts/helvetiker_regular.typeface.json"
        />
      </Suspense>
      
    </div>
  );
}