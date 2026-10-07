"use client";

import { useEffect, useRef, useState } from "react";

export default function ArticleBody({ html }: { html: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const copy = async (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".code-copy");
      if (!button) return;
      const code = button.closest(".code-block")?.querySelector("pre")?.textContent;
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
        setMessage("Code copied to clipboard.");
      } catch {
        setMessage("Could not copy automatically. Select the code to copy it manually.");
      }
    };
    element.addEventListener("click", copy);
    return () => element.removeEventListener("click", copy);
  }, [html]);
  return <>
    {/* Imported article HTML is sanitized and stored locally at development time. */}
    <div ref={container} id="postContent" className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
    <span className="sr-only" role="status">{message}</span>
  </>;
}
