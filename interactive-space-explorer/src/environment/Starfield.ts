import * as THREE from "three";

export class Starfield {
  constructor(scene: THREE.Scene) {
    const count = 7000;
    const radius = 1800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const index = i * 3;
      positions[index] = (Math.random() - 0.5) * radius;
      positions[index + 1] = (Math.random() - 0.5) * radius;
      positions[index + 2] = (Math.random() - 0.5) * radius;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    scene.add(new THREE.Points(geometry, material));
  }
}