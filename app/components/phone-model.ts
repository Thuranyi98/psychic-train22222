import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export function createPhoneModel() {
  const phone = new THREE.Group();
  phone.name = "iPhone 17 Pro";
  const metal = new THREE.MeshStandardMaterial({ color: 0xd4d6d8, metalness: 0.9, roughness: 0.3 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x08090b, metalness: 0.2, roughness: 0.16 });
  const lens = new THREE.MeshStandardMaterial({ color: 0x142333, metalness: 0.65, roughness: 0.09 });
  const back = new THREE.MeshStandardMaterial({ color: 0xe1e2e4, metalness: 0.25, roughness: 0.3 });
  const add = (width: number, height: number, depth: number, radius: number, material: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 5, radius), material);
    mesh.position.set(x, y, z);
    phone.add(mesh);
    return mesh;
  };
  const roundedOutline = (w: number, h: number, r: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return shape;
  };
  // Extrude the outline so the corner radius is independent of the thin chassis.
  const shell = (w: number, h: number, depth: number, radius: number, material: THREE.Material, y = 0, z = 0) => {
    const geometry = new THREE.ExtrudeGeometry(roundedOutline(w, h, radius), {
      depth, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 3, steps: 1, curveSegments: 24,
    });
    geometry.translate(0, 0, -depth / 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, y, z);
    phone.add(mesh);
  };
  // Pro proportions: 150 mm tall, 71.9 mm wide, 8.75 mm deep.
  shell(2.58, 5.38, 0.314, 0.39, metal);
  shell(2.49, 5.29, 0.025, 0.36, glass, 0, 0.169);
  shell(2.36, 3.42, 0.025, 0.27, back, -0.73, -0.17);
  shell(2.44, 1.48, 0.15, 0.28, metal, 1.79, -0.22);
  const disc = (radius: number, depth: number, material: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 48), material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    phone.add(mesh);
  };
  for (const [x, y] of [[-0.72, 2.14], [-0.72, 1.45], [0, 1.8]]) {
    disc(0.31, 0.065, metal, x, y, -0.33);
    disc(0.265, 0.025, glass, x, y, -0.37);
    disc(0.18, 0.012, lens, x, y, -0.39);
  }
  disc(0.115, 0.02, new THREE.MeshStandardMaterial({ color: 0xf4eee0, roughness: 0.4 }), 0.79, 2.15, -0.31);
  disc(0.1, 0.02, glass, 0.79, 1.47, -0.31);
  const w = 2.39, h = 5.19;
  const shape = roundedOutline(w, h, 0.33);
  const geometry = new THREE.ShapeGeometry(shape, 24);
  const positions = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  for (let i = 0; i < positions.count; i++) uv.setXY(i, positions.getX(i) / w + 0.5, positions.getY(i) / h + 0.5);
  const screen = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ toneMapped: false }));
  screen.name = "Screen";
  screen.position.z = 0.202;
  phone.add(screen);
  shell(0.7, 0.18, 0.012, 0.09, glass, 2.38, 0.22);
  disc(0.045, 0.008, lens, 0.23, 2.38, 0.239);
  add(0.045, 0.57, 0.12, 0.02, metal, 1.3, 0.6);
  add(0.045, 0.48, 0.13, 0.02, glass, 1.3, -1.35);
  add(0.045, 0.2, 0.12, 0.02, metal, -1.3, 1.42);
  add(0.045, 0.36, 0.12, 0.02, metal, -1.3, 0.72);
  add(0.045, 0.36, 0.12, 0.02, metal, -1.3, 0.18);
  add(0.35, 0.018, 0.1, 0.008, glass, 0, -2.7);
  for (const x of [-0.72, -0.61, -0.5, 0.5, 0.61, 0.72]) add(0.045, 0.018, 0.065, 0.008, glass, x, -2.7);
  return phone;
}

// Recompose the supplied promotional artwork as a flat app screen for the 3D device.
export function paintPhoneScreen(context: CanvasRenderingContext2D, bitmap: HTMLImageElement) {
  const { width, height } = context.canvas;
  context.save();
  context.scale(width / 600, height / 1300);
  context.fillStyle = "#08090b";
  context.fillRect(0, 0, 600, 1300);
  const text = (value: string, x: number, y: number, size: number, color = "#fff") => {
    context.fillStyle = color;
    context.font = `500 ${size}px sans-serif`;
    context.fillText(value, x, y);
  };
  const box = (x: number, y: number, w: number, h: number, r: number, color: string) => {
    context.fillStyle = color;
    context.beginPath();
    context.roundRect(x, y, w, h, r);
    context.fill();
  };
  text("9:25", 38, 51, 22);
  text("100%", 500, 51, 18);
  text("P", 34, 155, 62);
  text("B", 108, 155, 62);
  box(78, 107, 23, 48, 3, "#f47743");
  text("PLAY BOOK OF BURMA", 36, 180, 11, "#a5a7ad");
  text("Login", 500, 143, 21, "#b8bac1");
  box(25, 220, 550, 280, 24, "#1d2228");
  text("Learn from Top Generational CEO", 47, 267, 27);
  text("Life-changing playbooks from Myanmar's", 47, 315, 22, "#a8abb3");
  text("visionary founders and CEOs. Discover", 47, 348, 22, "#a8abb3");
  text("the decisions that shaped their journey.", 47, 381, 22, "#a8abb3");
  box(47, 416, 506, 58, 14, "#ef7544");
  text("Start Your Journey Now", 147, 453, 25);
  box(25, 536, 205, 57, 28, "#222327");
  text("Newly Added", 49, 573, 24);
  text("CEO", 267, 573, 24, "#a8abb3");
  text("Retail", 366, 573, 24, "#a8abb3");
  text("Tech", 487, 573, 24, "#a8abb3");
  context.save();
  context.beginPath();
  context.roundRect(25, 630, 550, 515, 22);
  context.clip();
  context.drawImage(bitmap, 570, 1660, 610, 650, 25, 630, 550, 586);
  const fade = context.createLinearGradient(0, 850, 0, 1150);
  fade.addColorStop(0, "#0000");
  fade.addColorStop(1, "#000");
  context.fillStyle = fade;
  context.fillRect(25, 630, 550, 515);
  context.restore();
  box(259, 902, 82, 82, 41, "#ef7544");
  context.fillStyle = "#fff";
  context.beginPath();
  context.moveTo(293, 926); context.lineTo(293, 961); context.lineTo(318, 943); context.fill();
  text("How to Extend Your Financial", 65, 1064, 28);
  text("Runway for 6 Months", 120, 1103, 28);
  box(0, 1170, 600, 130, 0, "#1d2228");
  text("Home", 265, 1227, 25);
  box(210, 1271, 180, 6, 3, "#e6e6e6");
  context.restore();
}
