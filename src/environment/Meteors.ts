import * as THREE from "three";

export class Meteors {
  private particles: THREE.Points;
  private positions: Float32Array;
  private velocities: Float32Array;
  private delays: Float32Array;
  private count = 10;

  constructor(scene: THREE.Scene) {
    this.positions = new Float32Array(this.count * 3);
    this.velocities = new Float32Array(this.count * 3);
    this.delays = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      this.resetMeteor(i, true);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 1.5,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    scene.add(this.particles);
  }

  private resetMeteor(i: number, initial = false): void {
    const index = i * 3;
    this.delays[i] = initial ? Math.random() * 8 : 4 + Math.random() * 12;

    const radius = 250 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.8;

    this.positions[index] = Math.cos(theta) * radius;
    this.positions[index + 1] = Math.sin(phi) * radius;
    this.positions[index + 2] = Math.sin(theta) * radius;

    const speed = 25 + Math.random() * 25;
    const angle = Math.random() * Math.PI * 2;
    this.velocities[index] = Math.cos(angle) * speed;
    this.velocities[index + 1] = -10 - Math.random() * 15;
    this.velocities[index + 2] = Math.sin(angle) * speed;
  }

  update(delta: number): void {
    for (let i = 0; i < this.count; i++) {
      if (this.delays[i] > 0) {
        this.delays[i] -= delta;
        continue;
      }

      const index = i * 3;
      this.positions[index] += this.velocities[index] * delta;
      this.positions[index + 1] += this.velocities[index + 1] * delta;
      this.positions[index + 2] += this.velocities[index + 2] * delta;

      if (
        Math.abs(this.positions[index]) > 450 ||
        Math.abs(this.positions[index + 1]) > 450 ||
        Math.abs(this.positions[index + 2]) > 450
      ) {
        this.resetMeteor(i);
      }
    }

    (this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}