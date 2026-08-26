import * as THREE from "three";

export class Starfield {
  readonly object: THREE.Points;
  constructor(count = 1800) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) { const r = 260 + Math.random() * 600; const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); positions[i * 3] = r * Math.sin(phi) * Math.cos(theta); positions[i * 3 + 1] = r * Math.cos(phi); positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta); }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.object = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xe8ecff, size: 0.75, transparent: true, opacity: 0.78, sizeAttenuation: true }));
  }
  update(elapsed: number): void { this.object.rotation.y = elapsed * 0.002; }
  dispose(): void { this.object.geometry.dispose(); (this.object.material as THREE.Material).dispose(); }
}

export class AsteroidField {
  readonly object: THREE.InstancedMesh;
  constructor(count = 900) { const geometry = new THREE.IcosahedronGeometry(0.08, 0); const material = new THREE.MeshStandardMaterial({ color: 0x6f6868, roughness: 1 }); this.object = new THREE.InstancedMesh(geometry, material, count); const dummy = new THREE.Object3D(); for (let i = 0; i < count; i += 1) { const angle = Math.random() * Math.PI * 2; const radius = 20 + Math.random() * 3.8; dummy.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 1.1, Math.sin(angle) * radius); dummy.scale.setScalar(0.35 + Math.random() * 1.8); dummy.rotation.set(Math.random(), Math.random(), Math.random()); dummy.updateMatrix(); this.object.setMatrixAt(i, dummy.matrix); } this.object.instanceMatrix.needsUpdate = true; }
  update(elapsed: number, timeScale: number): void { this.object.rotation.y = elapsed * timeScale * 0.015; }
  dispose(): void { this.object.geometry.dispose(); (this.object.material as THREE.Material).dispose(); }
}

export class MeteorSystem {
  readonly object = new THREE.Group(); private readonly meteor = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffc36a }));
  constructor() { this.object.add(this.meteor); this.meteor.visible = false; }
  update(elapsed: number): void { const cycle = elapsed % 24; this.meteor.visible = cycle > 10 && cycle < 14; if (this.meteor.visible) { const progress = (cycle - 10) / 4; this.meteor.position.set(-70 + progress * 140, 15 - progress * 30, -30 + progress * 60); } }
  dispose(): void { this.meteor.geometry.dispose(); (this.meteor.material as THREE.Material).dispose(); }
}

export class DeepSpace { readonly object = new THREE.Group(); constructor() { const galaxy = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x314575, transparent: true, opacity: 0.28 })); galaxy.scale.set(22, 12, 1); galaxy.position.set(-150, 70, -180); this.object.add(galaxy); const hole = new THREE.Mesh(new THREE.SphereGeometry(8, 24, 16), new THREE.MeshBasicMaterial({ color: 0x020208 })); hole.position.set(170, 80, -250); this.object.add(hole); const disk = new THREE.Mesh(new THREE.TorusGeometry(10, 1.3, 8, 48), new THREE.MeshBasicMaterial({ color: 0xcf7c32, transparent: true, opacity: 0.55 })); disk.rotation.x = Math.PI / 2; disk.position.copy(hole.position); this.object.add(disk); } }
