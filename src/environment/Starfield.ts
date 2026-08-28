import * as THREE from "three";

export class Starfield {
  constructor(scene: THREE.Scene) {
    const count = 9000;
    const radius = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorChoices = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x60a5fa),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xec4899),
      new THREE.Color(0x8b5cf6),
    ];

    for (let i = 0; i < count; i += 1) {
      const index = i * 3;
      positions[index] = (Math.random() - 0.5) * radius;
      positions[index + 1] = (Math.random() - 0.5) * radius;
      positions[index + 2] = (Math.random() - 0.5) * radius;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[index] = c.r;
      colors[index + 1] = c.g;
      colors[index + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    scene.add(new THREE.Points(geometry, material));
  }
}