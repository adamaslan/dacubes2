import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import "./frontend.css";

export const meta: MetaFunction = () => {
  return [
    { title: "GitHub Projects" },
    { name: "description", content: "Explore our GitHub projects" },
  ];
};

export default function AIProjects() {
  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
  ];

  const logo = <div>My Logo</div>;

  return (
    <div className="projects-container">
      <Navbar links={navLinks} logo={logo} />
      
      <main className="projects-main">
        <h1 className="projects-heading">GitHub Projects</h1>
        
        <div className="projects-grid" id="parent">
          <a href="https://github.com/yourusername/project1" className="project-card blue">
            <div className="project-content">
              <h2 className="project-title">GitHub 1</h2>
              <p className="project-description">React Project Repository</p>
              <p className="project-cta">Click to view source code</p>
            </div>
          </a>

          <a href="https://github.com/yourusername/project2" className="project-card green">
            <div className="project-content">
              <h2 className="project-title">GitHub 2</h2>
              <p className="project-description">Node.js Backend API</p>
              <p className="project-cta">Click to explore the code</p>
            </div>
          </a>

          <a href="https://github.com/yourusername/project3" target="_blank" rel="noopener noreferrer" 
             className="block w-[280px] sm:w-[320px] md:w-[360px] aspect-square mx-auto bg-purple-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group">
            <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">GitHub 3</h2>
              <p className="text-white text-sm sm:text-base">Three.js 3D Models</p>
              <p className="text-purple-100 text-xs sm:text-sm mt-2">View 3D project code</p>
            </div>
          </a>

          <a href="https://github.com/yourusername/project4" target="_blank" rel="noopener noreferrer" 
             className="block w-[280px] sm:w-[320px] md:w-[360px] aspect-square mx-auto bg-red-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group">
            <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">GitHub 4</h2>
              <p className="text-white text-sm sm:text-base">Full Stack Application</p>
              <p className="text-red-100 text-xs sm:text-sm mt-2">Explore the repository</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}