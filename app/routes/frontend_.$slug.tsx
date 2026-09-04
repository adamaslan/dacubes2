import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import { findProject } from "~/data/projects";
import "../styles/frontend.css";
import "../styles/project-detail.css";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const project = findProject("frontend", params.slug ?? "");
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ project });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.project.title ?? "Project";
  return [
    { title: `${title} — Frontend Projects` },
    { name: "description", content: data?.project.blurb ?? "" },
  ];
};

export default function FrontendProjectDetail() {
  const { project } = useLoaderData<typeof loader>();

  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
  ];
  const logo = <div>Adam Timur Aslan</div>;

  return (
    <div className="project-detail-container">
      <Navbar links={navLinks} logo={logo} />

      <main className="project-detail-main">
        <Link to="/frontend" className="project-detail-back">
          &larr; Back to Frontend Projects
        </Link>

        <h1 className="project-detail-title">{project.title}</h1>
        <p className="project-detail-stack">{project.stack.join(" · ")}</p>

        <p className="project-detail-summary">{project.summary}</p>

        {project.video && (
          <div className="project-detail-media">
            <video controls preload="none" poster={project.poster}>
              <source src={project.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {project.detail.map((block) => (
          <div className="project-detail-block" key={block.heading}>
            <h2 className="project-detail-block-heading">{block.heading}</h2>
            <p className="project-detail-block-body">{block.body}</p>
          </div>
        ))}

        <div className="project-detail-links">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="project-detail-link"
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
