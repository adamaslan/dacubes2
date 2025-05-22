import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import "../styles/threejs.css";

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
    <div className="threejs-container">
      <Navbar links={navLinks} logo={logo} />
      
      <main className="threejs-main">
        <h1 className="threejs-title">GitHub Projects</h1>
        
        <div className="threejs-grid">
          <a href="https://github.com/yourusername/project1" 
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">GitHub 1</h2>
              <p className="threejs-card-text">React Project Repository</p>
              <p className="threejs-card-subtext">Click to view source code</p>
            </div>
          </a>

          {/* Repeat for other cards with appropriate color classes */}
        </div>
      </main>
    </div>
  );
}