import * as THREE from "three";

export class Comet {
  readonly object: THREE.Group;
  private tailParticles: THREE.Points;
  private tailPositions: Float32Array;

  constructor(scene: THREE.Scene) {
    this.object = new THREE.Group();

    // Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x88e0ff,
      emissive: 0x00b0ff,
      emissiveIntensity: 2.0,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleus.userData.celestialId = "halley";
    this.object.add(nucleus);

    // Tail Particles
    const tailCount = 150;
    this.tailPositions = new Float32Array(tailCount * 3);
    for (let i = 0; i < tailCount; i++) {
      const idx = i * 3;
      this.tailPositions[idx] = (Math.random() - 0.5) * 0.5;
      this.tailPositions[idx + 1] = (Math.random() - 0.5) * 0.5;
      this.tailPositions[idx + 2] = -i * 0.15;
    }

    const tailGeo = new THREE.BufferGeometry();
    tailGeo.setAttribute("position", new THREE.BufferAttribute(this.tailPositions, 3));

    const tailMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.6,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    this.tailParticles = new THREE.Points(tailGeo, tailMat);
    this.object.add(this.tailParticles);

    this.object.position.set(-60, 10, -50);
    scene.add(this.object);
  }

  update(elapsed: number): void {
    const angle = elapsed * 0.15;
    const a = 65;
    const b = 35;
    this.object.position.x = Math.cos(angle) * a;
    this.object.position.z = Math.sin(angle) * b;
    this.object.rotation.y = -angle + Math.PI / 2;
  }
}
