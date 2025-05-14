// routes/_index.tsx
import React from "react";
import Navbar from "~/components/navbar";
import type { MetaFunction } from "@remix-run/node";
import DaCubes4 from "~/components/three4";

export const meta: MetaFunction = () => {
  return [
    { title: "3D Cubes Experience" },
    { name: "description", content: "Interactive 3D cubes navigation" },
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
          Interactive 3D Navigation
        </h1>
      </div>

      <DaCubes4 
        cubes={customCubes}
        textSize={0.8}
        engraveDepth={0.3}
        fontUrl="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/fonts/helvetiker_regular.typeface.json"
      />
    </div>
  );
}