import * as THREE from "three";

export class Nebula {
  constructor(scene: THREE.Scene) {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(0x8b5cf6);
    const c2 = new THREE.Color(0xec4899);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] = -300 + (Math.random() - 0.5) * 200;
      positions[idx + 1] = 80 + (Math.random() - 0.5) * 150;
      positions[idx + 2] = -400 + (Math.random() - 0.5) * 200;

      const lerpColor = c1.clone().lerp(c2, Math.random());
      colors[idx] = lerpColor.r;
      colors[idx + 1] = lerpColor.g;
      colors[idx + 2] = lerpColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 15.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    scene.add(new THREE.Points(geometry, material));
  }
}
