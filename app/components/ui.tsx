"use client";

// Restart mount animations instead of preserving stale hooks during development edits.
// @refresh reset

import { useEffect, useState } from "react";

export function Icon({ name }: { name: string }) {
  return <svg aria-hidden="true" width="24" height="24"><use href={`/assets/icons.svg#${name}`} /></svg>;
}

const burmeseGlyphs = Array.from({ length: 34 }, (_, index) => String.fromCharCode(0x1000 + index)).join("") + "\u104f\u104d\u1055";

export function Decoder({ text, alphabet = "latin", delay = 0, duration }: { text: string; alphabet?: "latin" | "burmese"; delay?: number; duration?: number }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glyphs = alphabet === "burmese" ? burmeseGlyphs : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const steps = duration ? Math.max(1, Math.ceil(duration / 35)) : Math.min(text.length * 2, 30);
    let frame = 0;
    let timer: number | undefined;
    const timeout = window.setTimeout(() => {
      const update = () => {
        setDisplay(text.split("").map((letter, index) =>
          letter === " " || index < frame / steps * text.length ? letter : glyphs[Math.floor(Math.random() * glyphs.length)]
        ).join(""));
        if (frame >= steps) window.clearInterval(timer);
        frame++;
      };
      update();
      timer = window.setInterval(update, 35);
    }, delay);
    return () => { window.clearTimeout(timeout); window.clearInterval(timer); };
  }, [text, alphabet, delay, duration]);
  return <><span className="sr-only">{text}</span><span aria-hidden="true">{display}</span></>;
}


export function Footer() { return <footer className="site-footer">&copy; 2026 Thura Nyi.</footer>; }
