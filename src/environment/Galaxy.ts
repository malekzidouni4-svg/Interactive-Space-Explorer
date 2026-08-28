import * as THREE from "three";

export class Galaxy {
  readonly object: THREE.Group;

  constructor(
    scene: THREE.Scene,
    options: {
      position?: THREE.Vector3;
      radius?: number;
      branches?: number;
      spin?: number;
      colorInside?: number;
      colorOutside?: number;
    } = {}
  ) {
    const {
      position = new THREE.Vector3(600, 250, -800),
      radius = 180,
      branches = 3,
      spin = 1.2,
      colorInside = 0xffa500, // Gold / Amber core
      colorOutside = 0x3b82f6, // Blue arms
    } = options;

    this.object = new THREE.Group();
    this.object.position.copy(position);

    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const insideColor = new THREE.Color(colorInside);
    const outsideColor = new THREE.Color(colorOutside);

    for (let i = 0; i < count; i++) {
      // Position along spiral arm
      const r = Math.random() * radius;
      const spinAngle = r * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (radius - r)) / 5;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (radius - r)) / 5;
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (radius - r)) / 5;

      const x = Math.cos(branchAngle + spinAngle) * r + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * r + randomZ;

      const idx = i * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      // Color lerp from core to arm tip
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, r / radius);

      colors[idx] = mixedColor.r;
      colors[idx + 1] = mixedColor.g;
      colors[idx + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    this.object.add(points);

    // Glowing Galactic Core
    const coreGeo = new THREE.SphereGeometry(radius * 0.08, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: colorInside,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.object.add(core);

    // Tilt galaxy realistically
    this.object.rotation.x = Math.PI / 3.5;
    this.object.rotation.z = Math.PI / 6;

    scene.add(this.object);
  }

  update(delta: number): void {
    this.object.rotation.y += delta * 0.02;
  }
}
