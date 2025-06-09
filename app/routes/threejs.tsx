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
          <a href="https://github.com/yourusername/project1" 
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">GitHub 1</h2>
              <p className="threejs-card-text">React Project Repository</p>
              {/* <p className="threejs-card-subtext">Click to view source code</p> */}
              <video autoPlay loop muted>
                <source src="/zxy4.mov" type="video/mp4" />
                Your browser does not support the video tag.
        </video>
            </div>
          </a>
          <a href="https://github.com/yourusername/project1" 
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">GitHub 1</h2>
              <p className="threejs-card-text">React Project Repository</p>
              {/* <p className="threejs-card-subtext">Click to view source code</p> */}
         
              <video autoPlay loop muted>
                <source src="/sound1.mov" type="video/mp4" />
                Your browser does not support the video tag.
        </video>
            </div>
          </a>
          <a href="https://github.com/yourusername/project1" 
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">GitHub 1</h2>
              <p className="threejs-card-text">React Project Repository</p>
              <p className="threejs-card-subtext">Click to view source code</p>
              <video autoPlay loop muted>
                <source src="/nycpony.mov" type="video/mp4" />
                Your browser does not support the video tag.
        </video>
            </div>
          </a>
          <a href="https://github.com/yourusername/project1" 
             className="threejs-card threejs-card-blue">
            <div className="threejs-card-content">
              <h2 className="threejs-card-title">GitHub 1</h2>
              <p className="threejs-card-text">React Project Repository</p>
              <p className="threejs-card-subtext">Click to view source code</p>
              <video autoPlay loop muted>
                <source src="/stars1.mov" type="video/mp4" />
                Your browser does not support the video tag.
        </video>
            </div>
          </a>
          {/* Repeat for other cards with appropriate color classes */}
        </div>
      </main>
    </div>
  );
}