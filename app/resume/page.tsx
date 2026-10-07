import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "../components/ui";
import "../pages.css";

export const metadata: Metadata = { title: "Thura Nyi | Resume", description: "Resume and experience." };

export default function ResumePage() {
  return <section className="resume-page section" aria-labelledby="resume-title">
    <h1 id="resume-title" className="sr-only">Thura Nyi - Resume</h1>
    <a className="resume-document" href="/assets/thura-nyi-resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open Thura Nyi's resume PDF in a new tab">
      <Image src="/assets/thura-nyi-resume-preview.png" alt="Thura Nyi's resume: experience, skills, selected projects, education, and contact details. Open the PDF to read its text." width={2880} height={3729} unoptimized priority />
    </a>
    <div className="resume-actions"><a className="primary-button" href="/assets/thura-nyi-resume.pdf" download="Thura_Nyi_Resume.pdf"><Icon name="download" />Download Resume</a></div>
  </section>;
}
