import profile from "./profile.json";

export const projects = profile.projects.map(project => ({
  title: project.title,
  description: project.description,
  image: project.image.src,
  href: project.titleLink,
  links: project.links ?? [],
  technologies: project.languages,
}));
