import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import { projectsIn } from "~/data/projects";
import "../styles/frontend.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Frontend Projects" },
    { name: "description", content: "Explore our GitHub projects" },
  ];
};

export default function FrontendProjects() {
  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
  ];

  const logo = <div>Adam Timur Aslan</div>;
  const projects = projectsIn("frontend");

  return (
    <div className="threejs-container">
      <Navbar links={navLinks} logo={logo} />

      <main className="threejs-main">
        <h1 className="threejs-title">Frontend Projects</h1>

        <div className="threejs-grid" id="parent">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/frontend/${project.slug}`}
              className={`threejs-card ${project.cardClass}`}
            >
              {project.poster && (
                <img
                  src={project.poster}
                  alt=""
                  loading="lazy"
                  className="threejs-card-poster"
                />
              )}
              <div className="threejs-card-content">
                <h2 className="threejs-card-title">{project.title}</h2>
                <p className="threejs-card-text">{project.blurb}</p>
                <p className="threejs-card-subtext">Read more &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
