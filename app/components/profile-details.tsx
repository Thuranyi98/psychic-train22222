import Image from "next/image";
import Link from "next/link";
import profile from "../data/profile.json";
import { skillGroups } from "../data/skills";
import { Footer } from "./ui";

export default function ProfileDetails() {
  return <>
    <div className="profile-extras about-details section">
      <section className="brands-section" aria-labelledby="clients-title">
        <div className="profile-section-heading credentials-heading">
          <h2 id="clients-title">Brands I have worked with</h2>
          <label className="marquee-control" title="Pause brand animation"><input className="sr-only" type="checkbox" /><span className="sr-only">Pause brand animation</span><span className="marquee-control-icon" aria-hidden="true" /></label>
        </div>
        <div className="brands-marquee">
          <div className="brands-track">
            {[0, 1].map(copy => <ul className="client-list" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {profile.clients.map(client => <li key={client.id}><span className="client-logo"><Image src={client.image.src} alt="" width={88} height={88} /></span><span>{client.name}</span></li>)}
            </ul>)}
          </div>
        </div>
      </section>
      <section className="experience-section" aria-labelledby="experience-title">
        <div className="profile-section-heading credentials-heading"><h2 id="experience-title">Experience</h2><Link className="experience-resume" href="/resume">View resume &rarr;</Link></div>
        {profile.experience.map(job => {
          const [position, company] = job.title.split(" . ");
          const role = position.replace(/\s*\(.*\)/, "");
          const arrangement = position.match(/\((.*)\)/)?.[1].replace("Parttime", "Part-time");
          const [start, end] = job.period.replace("Presence", "Present").split(" - ");
          return <article className="experience-entry" key={`${job.companyLink}-${job.period}`}>
            <div className="experience-period"><span>{start}</span><span className="experience-end">{end}</span>{end === "Present" && <span className="experience-current">Current</span>}</div>
            <div className="experience-body">
              <header className="experience-heading">
                <span className="experience-logo" aria-hidden="true">
                  {job.logo ? <Image src={job.logo.src} alt="" width={job.logo.width} height={job.logo.height} sizes="64px" /> : <span>iD</span>}
                </span>
                <div className="experience-heading-details">{job.companyLink ? <a className="experience-company" href={job.companyLink} target="_blank" rel="noopener noreferrer">{company}<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg></a> : <span className="experience-company">{company}</span>}<h3>{role}</h3>{arrangement && <p className="experience-arrangement">{arrangement}</p>}</div>
              </header>
              <p className="experience-description">{job.description}</p>
              <ul className="experience-technologies" aria-label="Technologies used">{job.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
            </div>
          </article>;
        })}
      </section>
      <section className="skills-section" aria-labelledby="skills-title">
        <div className="credentials-heading"><h2 id="skills-title">Skills &amp; tools</h2></div>
        <div className="skills-grid">{skillGroups.map((group, index) => <div className="skill-group" key={group.title}>
          <div className="skill-group-heading"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3></div>
          <ul className="skills-list">{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </div>)}</div>
      </section>
      <section className="certificates-section" aria-labelledby="certificates-title">
        <div className="credentials-heading"><h2 id="certificates-title">Certificates</h2><span className="credentials-count">{String(profile.certificates.length).padStart(2, "0")} credentials</span></div>
        <div className="certificate-list">{profile.certificates.map((certificate, index) => <a className="certificate-item" key={certificate.id} href={certificate.link} target="_blank" rel="noopener noreferrer">
          <div className="certificate-meta"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{certificate.issuer}</span></div>
          <h3>{certificate.title}</h3>
          <svg className="credential-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          <span className="sr-only">View certificate (opens in a new tab)</span>
        </a>)}</div>
      </section>
    </div><Footer />
  </>;
}
