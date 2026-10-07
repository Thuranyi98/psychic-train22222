"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProjectPreview({ image, alt }: { image: string; alt: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const element = host.current;
    const target = canvas.current;
    if (!element || !target) return;
    let disposed = false;
    let visible = false;
    let started = false;
    let cleanup: (() => void) | undefined;

    const initialize = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ canvas: target, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      const scene = new THREE.Scene();
      const environment = new RoomEnvironment();
      const generator = new THREE.PMREMGenerator(renderer);
      const reflection = generator.fromScene(environment, 0.04);
      scene.environment = reflection.texture;
      environment.dispose();
      generator.dispose();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      const group = new THREE.Group();
      scene.add(group);
      scene.add(new THREE.HemisphereLight(0xe8f1ff, 0x35383f, 2));
      const key = new THREE.DirectionalLight(0xffffff, 3);
      key.position.set(-3, 5, 6);
      const rim = new THREE.DirectionalLight(0xc3d8ff, 2);
      rim.position.set(4, 2, -3);
      scene.add(key, rim);
      const draco = new DRACOLoader();
      draco.setDecoderPath("/draco/");
      const loader = new GLTFLoader().setDRACOLoader(draco);
      const materials = new Set<import("three").Material>();
      const geometries = new Set<import("three").BufferGeometry>();
      const textures = new Set<import("three").Texture>();
      let frame = 0;
      let x = 0;
      let y = 0;
      const modelSize = new THREE.Vector3(6, 4, 3);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const resize = () => {
        const { width, height } = element.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Fit the complete laptop, including its base, at every card size.
        const vertical = THREE.MathUtils.degToRad(camera.fov / 2);
        const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
        const distance = Math.max(modelSize.x / (2 * Math.tan(horizontal)), modelSize.y / (2 * Math.tan(vertical))) + modelSize.z / 2;
        camera.position.set(0, 0.25, distance * 1.16);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      const pointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const bounds = element.getBoundingClientRect();
        x = (event.clientX - bounds.left) / bounds.width - 0.5;
        y = (event.clientY - bounds.top) / bounds.height - 0.5;
      };
      const reset = () => { x = 0; y = 0; };
      element.addEventListener("pointermove", pointer);
      element.addEventListener("pointerleave", reset);
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        element.removeEventListener("pointermove", pointer);
        element.removeEventListener("pointerleave", reset);
        geometries.forEach(value => value.dispose());
        materials.forEach(value => value.dispose());
        textures.forEach(value => value.dispose());
        reflection.dispose();
        draco.dispose();
        renderer.dispose();
      };
      const laptop = await loader.loadAsync("/assets/models/macbook-pro.glb");
      laptop.scene.traverse(node => {
        if (!(node instanceof THREE.Mesh)) return;
        geometries.add(node.geometry);
        (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => materials.add(material));
        const screen = node.name === "Screen";
        const metal = ["Body", "Frame", "Logo"].includes(node.name);
        const material = screen
          ? new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })
          : new THREE.MeshStandardMaterial({ color: metal ? 0x777d87 : 0x191c21, metalness: metal ? 0.8 : 0.15, roughness: metal ? 0.32 : 0.6 });
        materials.add(material);
        node.material = material;
      });
      if (disposed) { cleanup(); return; }
      const source = await new THREE.TextureLoader().loadAsync(image);
      textures.add(source);
      if (disposed) { cleanup(); return; }
      const screen = laptop.scene.getObjectByName("Screen") as import("three").Mesh;
      screen.geometry.computeBoundingBox();
      const size = screen.geometry.boundingBox!.getSize(new THREE.Vector3());
      const surface = document.createElement("canvas");
      surface.width = 1600;
      surface.height = Math.round(surface.width * size.y / size.x);
      const context = surface.getContext("2d")!;
      context.fillStyle = "#111419";
      context.fillRect(0, 0, surface.width, surface.height);
      // Fill the display without distortion, cropping excess image edges.
      const bitmap = source.image as HTMLImageElement;
      const scale = Math.max(surface.width / bitmap.width, surface.height / bitmap.height);
      const width = bitmap.width * scale;
      const height = bitmap.height * scale;
      context.drawImage(bitmap, (surface.width - width) / 2, (surface.height - height) / 2, width, height);
      const texture = new THREE.CanvasTexture(surface);
      textures.add(texture);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      (screen.material as import("three").MeshBasicMaterial).map = texture;
      (screen.material as import("three").MeshBasicMaterial).needsUpdate = true;
      const bounds = new THREE.Box3().setFromObject(laptop.scene);
      laptop.scene.position.sub(bounds.getCenter(new THREE.Vector3()));
      group.add(laptop.scene);
      group.rotation.set(0.12, -0.12, 0);
      new THREE.Box3().setFromObject(group).getSize(modelSize);
      resize();
      const draw = () => {
        frame = requestAnimationFrame(draw);
        if (!visible || document.hidden) return;
        group.rotation.x += (0.12 + (reduceMotion.matches ? 0 : y * 0.08) - group.rotation.x) * 0.08;
        group.rotation.y += (-0.12 + (reduceMotion.matches ? 0 : x * 0.12) - group.rotation.y) * 0.08;
        renderer.render(scene, camera);
      };
      renderer.render(scene, camera);
      setLoaded(true);
      frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !started) {
        started = true;
        initialize().catch(() => { cleanup?.(); });
      }
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => { disposed = true; observer.disconnect(); cleanup?.(); };
  }, [image]);

  return <div ref={host} className="project-model" role="img" aria-label={`${alt}, laptop preview`}>
    {!loaded && <div className="device-fallback"><Image src={image} width={1280} height={800} alt="" sizes="(max-width: 800px) 80vw, 40vw" /></div>}
    <canvas ref={canvas} aria-hidden="true" style={{ opacity: loaded ? 1 : 0 }} />
  </div>;
}
