"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./sphere-shaders";

export default function Sphere({ theme }: { theme: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 100);
    camera.position.z = 52;
    const material = new THREE.MeshPhongMaterial();
    const time = { value: 0 };
    material.onBeforeCompile = shader => {
      shader.uniforms.time = time;
      shader.vertexShader = vertexShader;
      shader.fragmentShader = fragmentShader;
    };
    const geometry = new THREE.SphereGeometry(32, 128, 128);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    const sunlight = new THREE.DirectionalLight(0xffffff, theme === "light" ? 1.8 : 2);
    sunlight.position.set(100, 100, 200);
    scene.add(sunlight, new THREE.AmbientLight(0xffffff, theme === "light" ? 2.7 : 0.4));
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 1.3;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      mesh.position.set(width <= 696 ? 14 : width <= 1040 ? 18 : 22, width <= 696 ? 10 : width <= 1040 ? 14 : 16, 0);
      renderer.render(scene, camera);
    };
    resize();
    let mouseX = 0;
    let mouseY = 0;
    const pointer = (event: MouseEvent) => {
      mouseX = event.clientX / window.innerWidth / 2;
      mouseY = event.clientY / window.innerHeight / 2;
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    const start = performance.now();
    let previous = start;
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((now - previous) / 16.667, 3);
      previous = now;
      if (!visible || document.hidden || reducedMotion.matches) return;
      time.value = (now - start) * 0.00005;
      mesh.rotation.z += 0.001 * delta;
      mesh.rotation.x += (mouseY - mesh.rotation.x) * 0.025;
      mesh.rotation.y += (mouseX - mesh.rotation.y) * 0.025;
      renderer.render(scene, camera);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);
    frame = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", pointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", pointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme]);
  return <canvas ref={canvasRef} className="sphere" aria-hidden="true" />;
}
