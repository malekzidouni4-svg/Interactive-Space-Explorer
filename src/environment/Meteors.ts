import * as THREE from "three";

export class Meteors {
  private particles: THREE.Points;
  private positions: Float32Array;
  private velocities: Float32Array;

  constructor(scene: THREE.Scene) {
    const count = 30;
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      this.resetMeteor(i);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    scene.add(this.particles);
  }

  private resetMeteor(i: number): void {
    const index = i * 3;
    const radius = 200 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;

    this.positions[index] = Math.cos(theta) * radius;
    this.positions[index + 1] = Math.sin(phi) * radius;
    this.positions[index + 2] = Math.sin(theta) * radius;

    this.velocities[index] = -15 - Math.random() * 20;
    this.velocities[index + 1] = -5 - Math.random() * 10;
    this.velocities[index + 2] = -15 - Math.random() * 20;
  }

  update(delta: number): void {
    const count = this.positions.length / 3;

    for (let i = 0; i < count; i++) {
      const index = i * 3;
      this.positions[index] += this.velocities[index] * delta;
      this.positions[index + 1] += this.velocities[index + 1] * delta;
      this.positions[index + 2] += this.velocities[index + 2] * delta;

      if (
        Math.abs(this.positions[index]) > 400 ||
        Math.abs(this.positions[index + 1]) > 400 ||
        Math.abs(this.positions[index + 2]) > 400
      ) {
        this.resetMeteor(i);
      }
    }

    (this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}
