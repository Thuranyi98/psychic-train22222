"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Icon } from "./ui";

const ThemeContext = createContext("dark");
export const useSiteTheme = () => useContext(ThemeContext);

const navigation = [
  ["About Me", "/about"],
  ["Projects", "/project"],
  ["Gallery", "/gallery"],
  ["Contact", "/contact"],
  ["Resume", "/resume"],
];
const socials = [
  ["LinkedIn", "linkedin", "https://www.linkedin.com/in/thura-nyi-453858241/"],
  ["GitHub", "github", "https://github.com/Thuranyi98"],
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = menuRef.current?.querySelectorAll<HTMLElement>("a, button");
    links?.[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && links?.length) {
        const first = links[0];
        const last = menuButtonRef.current!;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const onResize = () => {
      if (window.innerWidth > 696 && window.innerHeight > 696) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const toggleTheme = () => setTheme(value => value === "dark" ? "light" : "dark");
  const socialLinks = <div className="social-links">{socials.map(([label, icon, href]) => (
    <a key={icon} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><Icon name={icon} /></a>
  ))}</div>;
  const themeButton = (mobile = false) => <button className={`icon-button theme-toggle ${mobile ? "mobile-theme" : ""}`} onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={theme === "light"}>
    <svg aria-hidden="true" width="38" height="38" viewBox="0 0 38 38">
      {theme === "dark" ? <path fill="currentColor" d="M29.8 23.2A12 12 0 0 1 14.8 8.1 12 12 0 1 0 29.8 23.2Z" /> : <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="19" cy="19" r="7" fill="currentColor"/><path d="M19 3v5m0 22v5M3 19h5m22 0h5M7.7 7.7l3.5 3.5m15.6 15.6 3.5 3.5M7.7 30.3l3.5-3.5m15.6-15.6 3.5-3.5"/></g>}
    </svg>
  </button>;

  return <ThemeContext.Provider value={theme}><>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="navbar">
      <Link className="logo" href="/" aria-label="Thura Nyi, Developer"><span className="monogram" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <div className="nav-list">{navigation.map(([label, href]) => <Link className="nav-link" href={href} key={label} aria-current={(pathname === href || (href === "/gallery" && pathname.startsWith("/gallery/")) || (href === "/about" && pathname === "/")) ? "page" : undefined}>{label}</Link>)}</div>
        {socialLinks}
      </nav>
    </header>
    {themeButton()}
    <div ref={menuRef} id="mobile-navigation" className="mobile-nav" role={menuOpen ? "dialog" : undefined} aria-modal={menuOpen || undefined} aria-label="Navigation menu" hidden={!menuOpen}>
      <nav aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link href={href} key={label} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>
      {socialLinks}{themeButton(true)}
    </div>
    <button ref={menuButtonRef} className="icon-button menu-toggle" aria-label={menuOpen ? "Close menu" : "Menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(value => !value)}><Icon name={menuOpen ? "close" : "menu"} /></button>
    <main id="main-content" tabIndex={-1} inert={menuOpen}>
      {children}
    </main>
  </></ThemeContext.Provider>;
}
