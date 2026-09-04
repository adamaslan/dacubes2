// routes/_index.tsx
import React, { Suspense} from "react";
import Navbar from "~/components/navbar";
import type {  MetaFunction } from "@remix-run/node";
import TextAnimation from "../components/TextAnimation";
import VanillaGridMaze from "../components/VanillaGridMaze";
// import MovingObject from "../components/genericsphere-stars";
import { useTheme } from "../hooks/useTheme";
import "../styles/index.css";

// Posh-mode desaturates the canvases to match the ivory/brass register —
// see app/hooks/useTheme.ts. Without this the page goes elegant while the
// 3D scenes stay neon, which is the single most likely way the toggle ships
// looking broken.
const SCENE_COLORS = {
  cyber: {
    frontend: { primary: "pink", secondary: "#FF69B4" },
    threejs: { primary: "#00f2f2", secondary: "#ffffff" },
    ai: { primary: "#00ff88", secondary: "#9945ff" },
  },
  posh: {
    frontend: { primary: "#a68a4b", secondary: "#c9b48a" },
    threejs: { primary: "#5b7a93", secondary: "#8a9aa8" },
    ai: { primary: "#5c2a2a", secondary: "#8f5a4a" },
  },
} as const;


export const meta: MetaFunction = () => {
  return [
    { title: "Adam Aslan Portfolio" },
    { name: "description", content: "3D AI Fullstack Developer - Welcome to my portfolio showcasing various projects including ThreeJS and AI work." },
    { property: "og:title", content: "Adam Aslan Portfolio" },
    { property: "og:description", content: "Explore the 3D, AI, and Fullstack development portfolio of Adam Aslan." },
    { property: "og:type", content: "website" },
    { property: "og:video", content: "/sound1.mov" },
    { property: "og:video:type", content: "video/mp4" },
  ];
};

export default function Index() {
  const theme = useTheme();
  const colors = SCENE_COLORS[theme];
  const backgroundIntensity = theme === "posh" ? 0.6 : 1.2;

  return (
    <div className="page-container">
      <Navbar 
        links={[
          { href: "/", text: "Home" },
          { href: "/about", text: "About" },
          { href: "/contact", text: "Contact" }
        ]} 
        logo={<div className="navbar-logo">Adam Aslan's Portfolio</div>} 
      />
      
      <div className="header-content">
        <h1 className="main-title">3D AI Fullstack Developer</h1>
        <h2 className="subtitle">Welcome to My Portfolio</h2>
      </div>

      <Suspense fallback={<div className="loading-message">Loading 3D navigation...</div>}> 
        <div className="portfolio-grid">
        <a href="/frontend">     <div className="portfolio-item">    <span className="portfolio-label">Click here to explore my frontend portfolio</span> </div></a>
        
       
        <div className="portfolio-item">
            <TextAnimation
              text="Frontend"
              backgroundEffect="particles"
              backgroundIntensity={backgroundIntensity}
              primaryColor={colors.frontend.primary}
              secondaryColor={colors.frontend.secondary}
            />
            </div>

      <a href="/threejs">  <div className="portfolio-item">     <span className="portfolio-label">Click here to explore my ThreeJS and React Three Fiber Portfolio</span> </div></a>


          <div className="portfolio-item">
            {/* <span className="portfolio-label">ThreeJS</span> */}
            <TextAnimation
              text="ThreeJS"
              backgroundEffect="grid"
              backgroundIntensity={backgroundIntensity}
              primaryColor={colors.threejs.primary}
              secondaryColor={colors.threejs.secondary}
            />
          </div>

      <a href="/ai" aria-label="Explore AI Work portfolio including RAG, knowledge graphs, and MCP integrations">
        <div className="portfolio-item">
          <span className="portfolio-label">Click here to explore my AI Work</span>
        </div>
      </a>

      <div className="portfolio-item">
        <TextAnimation
          text="AI Work"
          backgroundEffect="neural"
          backgroundIntensity={backgroundIntensity}
          primaryColor={colors.ai.primary}
          secondaryColor={colors.ai.secondary}
        />
      </div>
        </div>
      </Suspense>
      {/* <Suspense fallback={null}>
            <MovingObject />
          </Suspense> */}

      <Suspense fallback={<div className="loading-message">Loading Grid Maze...</div>}>
        <VanillaGridMaze />
      </Suspense>
    </div>
  );
}