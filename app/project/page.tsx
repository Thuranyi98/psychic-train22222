import type { Metadata } from "next";
import { projects } from "../data/projects";
import { Footer, Icon } from "../components/ui";
import ProjectPreview from "../components/project-preview";
import "../pages.css";

export const metadata: Metadata = { title: "Thura Nyi | Projects", description: "Selected development and design projects." };

export default function ProjectsPage() {
  return <div className="projects-page">
    <h1 className="sr-only">Projects</h1>
    <div className="projects-grid section">
    {projects.map((project, index) => <section className={`project-section${project.startsRow ? " project-row-start" : ""}`} id={`project-${index + 1}`} key={project.title} aria-labelledby={`project-title-${index}`}>
      <div className="project-content">
        <div className={`project-preview${project.previewType === "mobile" ? " project-preview-mobile" : ""}`}>
          <ProjectPreview image={project.image} alt={project.title} mobile={project.previewType === "mobile"} playbookArtwork={project.screenArtwork === "playbook"} />
        </div>
        <div className="project-details">
          <div className="project-index" aria-hidden="true"><span className="divider" />{String(index + 1).padStart(2, "0")}</div>
          <h2 id={`project-title-${index}`}>{project.title}</h2>
          {project.status && <p className="project-status">{project.status}</p>}
          <p>{project.description}</p>
          {project.technologies.length > 0 && <p className="technology-list">{project.technologies.join(" / ")}</p>}
          <div className="project-links">{project.href && <a className="primary-button" href={project.href} target="_blank" rel="noopener noreferrer">View project<Icon name="arrow-right" /></a>}
          {project.links.filter(link => link.link !== project.href).map(link => <a key={link.link} href={link.link} target="_blank" rel="noopener noreferrer">{link.name} &rarr;</a>)}</div>
        </div>
      </div>
    </section>)}
    </div>
    <Footer />
  </div>;
}
