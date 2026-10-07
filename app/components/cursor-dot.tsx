"use client";

import { useEffect, useRef } from "react";

export default function CursorDot() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let visible = false;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let previousTime = 0;

    const draw = (time: number) => {
      const easing = 1 - Math.exp(-Math.min(time - previousTime, 64) / 45);
      previousTime = time;
      x += (targetX - x) * easing;
      y += (targetY - y) * easing;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1 ? requestAnimationFrame(draw) : 0;
    };
    const hide = () => {
      visible = false;
      cursor.dataset.visible = "false";
      cursor.dataset.pressed = "false";
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const hover = (event: PointerEvent) => {
      cursor.dataset.interactive = String(event.target instanceof Element && !!event.target.closest("a[href], button, input, select, textarea, label, summary, [role='button']"));
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") { hide(); return; }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        x = targetX;
        y = targetY;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        cursor.dataset.visible = "true";
        visible = true;
      }
      hover(event);
      if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(draw); }
    };
    const press = (event: PointerEvent) => { if (media.matches && event.pointerType === "mouse") cursor.dataset.pressed = "true"; };
    const release = () => { cursor.dataset.pressed = "false"; };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab") hide(); };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", hover, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", hide);
    window.addEventListener("pointerout", leave);
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", keyboard);
    document.addEventListener("visibilitychange", hide);
    media.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", hover);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", hide);
      media.removeEventListener("change", hide);
    };
  }, []);

  return <div ref={cursorRef} className="cursor-dot" aria-hidden="true"><span /></div>;
}
