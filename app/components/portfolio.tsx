"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Decoder, Icon } from "./ui";
import { useSiteTheme } from "./site-shell";

const Sphere = dynamic(() => import("./sphere"), { ssr: false });
const disciplines = ["Developer", "Founder", "Content Creator"];

export default function Portfolio() {
  const theme = useSiteTheme();
  const [discipline, setDiscipline] = useState(0);
  const profileRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        portrait.style.removeProperty("--portrait-offset");
        return;
      }
      if (!visible) return;
      const bounds = portrait.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - bounds.top - bounds.height / 2) / ((window.innerHeight + bounds.height) / 2);
      const offset = Math.max(-1, Math.min(1, progress)) * Math.min(32, bounds.height * 0.05);
      portrait.style.setProperty("--portrait-offset", `${offset.toFixed(2)}px`);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(portrait);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  useEffect(() => {
    const portrait = portraitRef.current;
    const image = portrait?.querySelector("img");
    if (!portrait || !image) return;
    let active = true;
    portrait.dataset.reveal = "pending";
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      // Keep the wipe in sync with the actual image, even on slow connections.
      image.decode().catch(() => {}).then(() => {
        if (active) portrait.dataset.reveal = "visible";
      });
    }, { threshold: 0.1 });
    observer.observe(portrait);
    return () => { active = false; observer.disconnect(); };
  }, []);

  useEffect(() => {
    const section = profileRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.dataset.revealed = "true";
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setDiscipline(value => (value + 1) % disciplines.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return <>
      <section className="intro section" aria-labelledby="intro-title">
        <Sphere theme={theme} />
        <header className="intro-text">
          <h1 className="name" id="intro-title"><Decoder text="Thura Nyi" alphabet="burmese" delay={500} duration={2000} /></h1>
          <h2 className="hero-title">
            <span className="sr-only">Engineer, Developer, Founder, and Content Creator</span>
            <span className="title-row" aria-hidden="true"><span className="hero-word developer">Engineer</span><span className="intro-line" /></span>
            <span className="title-row rotating-role" aria-hidden="true"><span key={discipline} className="hero-word discipline" data-long={disciplines[discipline] === "Content Creator"}>{disciplines[discipline]}</span></span>
          </h2>
        </header>
        <a className="scroll-indicator" href="#details" aria-label="Scroll to about me"><span /></a>
        <a className="mobile-scroll" href="#details" aria-label="Scroll to about me"><svg width="43" height="15" viewBox="0 0 43 15" aria-hidden="true"><path d="m1 1 20.5 12L42 1" stroke="currentColor" strokeWidth="2" fill="none" /></svg></a>
      </section>
      <div className="profile-wrapper">
        <section ref={profileRef} id="details" className="profile section" aria-labelledby="details-title">
          <div className="profile-content">
            <div className="profile-column biography">
              <div className="biography-heading">
                <h3 id="details-title">Hi there!</h3>
                <div className="about-flags">
                  <Image src="/assets/flag-myanmar.svg" alt="Myanmar flag" title="Myanmar" width={33} height={22} />
                  <Image src="/assets/flag-vietnam.svg" alt="Vietnam flag" title="Vietnam" width={33} height={22} />
                  <Image src="/assets/flag-japan.svg" alt="Japan flag" title="Japan" width={33} height={22} />
                </div>
              </div>
              <p>I&rsquo;m Thura Nyi, a Software Engineer and Founder of <a href="https://brilliantdevstudio.online/" target="_blank" rel="noopener noreferrer">Brilliant Dev Studio</a>. With expertise across full-stack development, server-side APIs, DevOps, and IoT, I specialize in building performant, accessible, and high-impact digital experiences.</p>
              <p>Since beginning my engineering journey in 2020, I have delivered 30+ digital products&mdash;ranging from regional F&amp;B mobile applications and enterprise EdTech platforms to offshore systems for Japanese clients.</p>
              <p>Currently, I&rsquo;m deepening my knowledge in Data Structures, System Design Patterns, and Project Management to architect scalable, resilient software.</p>
              <p>Outside of engineering: I share practical insights on web development, system architecture, and technical interview preparation through <Link href="/articles">writing</Link>, usually while working from local cafes.</p>
              <a className="message-link" href="/contact"><Icon name="send" />Send me a message</a>
            </div>
            <div className="profile-column">
              <div className="profile-tag" aria-hidden="true"><span className="divider" /><span>About me</span></div>
              <div ref={portraitRef} className="portrait">
                <div className="portrait-frame"><Image src="/assets/thura-portrait.jpg" width={2347} height={3602} sizes="(max-width: 696px) 100vw, (max-width: 1040px) 600px, 480px" alt="Thura Nyi" /></div>
                <svg className="katakana" viewBox="0 0 136 766" aria-hidden="true"><use href="/assets/katakana.svg#katakana-profile" /></svg>
              </div>
            </div>
          </div>
        </section>
      </div>
  </>;
}
