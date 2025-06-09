import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import "../styles/frontend.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Frontend Projects" },
    { name: "description", content: "Explore our GitHub projects" },
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
        <h1 className="threejs-title">Frontend Projects</h1>
        
        <div className="threejs-grid" id="parent">
        
          <div className="threejs-card threejs-card-purp">
            <a href="https://github.com/adamaslan/dfl" className="project-content-link">
              <div className="threejs-card-content">
                <h2 className="threejs-card-title">Drinks Food Life</h2>
                <p className="threejs-card-text">Fullstack NextJS React App running on Vercel featuring a complex grid using Tailwind</p>
                <p className="threejs-card-subtext">Click to explore the code</p>
              </div>
            </a>
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
              <source src="/dfl1b.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="threejs-card threejs-card-purp">
            <a href="https://github.com/adamaslan/intartmag" className="project-content-link">
              <div className="threejs-card-content">
                <h2 className="threejs-card-title">International Art Magazine</h2>
                <p className="threejs-card-text">This website features a responsive Navbar that turns transparent and begins pink for mobile.</p>
                <p className="threejs-card-subtext">Click to explore the code</p>
              </div>
            </a>
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
              <source src="/iam1b.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="threejs-card threejs-card-purp">
            <a href="https://github.com/yourusername/project2" className="project-content-link">
              <div className="threejs-card-content">
                <h2 className="threejs-card-title">Tasty Tech Bytes</h2>
                <p className="threejs-card-text">Fullstack React Remix App running on Netlify featuring a complex grid using Tailwind</p>
                <p className="threejs-card-subtext">Click to explore the code</p>
              </div>
            </a>
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
              <source src="/ttb2.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="threejs-card threejs-card-purp">
            <a href="https://github.com/adamaslan/dfl/blob/main/src/app/besttacosinbk/page.js" className="project-content-link">
              <div className="threejs-card-content">
                <h2 className="threejs-card-title">Taco Poll Results Chart</h2>
                <p className="threejs-card-text">A Vibrant Recharts Graph that utilizes the D3 library to create a responsive graph with hover effects for superior User Experience and Interaction</p>
                <p className="threejs-card-subtext">Click to explore the code</p>
              </div>
            </a>
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
              <source src="/taco-graph.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </main>
    </div>
  );
}