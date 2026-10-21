import profile from "./profile.json";

export const projects = profile.projects.map(project => ({
  title: project.title,
  startsRow: project.startsRow ?? false,
  description: project.description,
  image: project.image.src,
  imageWidth: project.image.width,
  imageHeight: project.image.height,
  previewType: project.previewType ?? "laptop",
  screenArtwork: project.screenArtwork,
  status: project.status,
  href: project.titleLink,
  links: project.links ?? [],
  technologies: project.languages,
}));
