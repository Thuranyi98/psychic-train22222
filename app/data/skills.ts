import profile from "./profile.json";

const labels: Record<string, string> = {
  "Type Script": "TypeScript",
  "Open AI": "OpenAI",
  FramerMotion: "Framer Motion",
  MONGODB: "MongoDB",
  Node: "Node.js",
  Express: "Express.js",
  RaspberryPi: "Raspberry Pi",
  HomeBridge: "Homebridge",
  Tailwind: "Tailwind CSS",
  EC2: "Amazon EC2",
  "MMQR (Payment Gateway)": "MMQR",
};

const skills = new Set(profile.experience.flatMap(job => job.technologies).map(skill => labels[skill] ?? skill));
const categories = [
  { title: "Web & mobile", skills: ["TypeScript", "React", "Next.js", "React Native", "Expo", "Redux", "Nuqs", "Tailwind CSS", "Framer Motion"] },
  { title: "Backend & data", skills: ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redis", "Hasura"] },
  { title: "Cloud & DevOps", skills: ["AWS", "Amazon EC2", "DevOps", "Z.com"] },
  { title: "IoT & integrations", skills: ["Raspberry Pi", "MQTT", "Homebridge", "OpenAI", "MMQR", "SMS Gateway"] },
];

export const skillGroups = categories.map(category => ({ ...category, skills: category.skills.filter(skill => skills.has(skill)) }));
const categorized = new Set(skillGroups.flatMap(group => group.skills));
const other = [...skills].filter(skill => !categorized.has(skill));
if (other.length) skillGroups.push({ title: "Other tools", skills: other });
