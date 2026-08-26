import * as THREE from "three";
import type { CelestialData } from "../data/types";

export class CelestialBody {
  readonly data: CelestialData;
  readonly object: THREE.Group;
  readonly orbit?: THREE.LineLoop;
  private readonly mesh: THREE.Mesh;
  private readonly anchor = new THREE.Group();

  constructor(data: CelestialData) {
    this.data = data;
    this.object = new THREE.Group();
    this.object.name = data.name;
    this.object.userData.celestialId = data.id;
    this.mesh = this.createMesh();
    this.object.add(this.mesh);
    if (data.visual.orbitRadius > 0 && !data.parent) this.orbit = this.createOrbit();
  }

  update(elapsed: number, delta: number, timeScale: number): void {
    const visual = this.data.visual;
    if (visual.orbitRadius > 0 && Number.isFinite(visual.orbitalPeriod)) {
      const angle = (elapsed * timeScale / visual.orbitalPeriod) * Math.PI * 2;
      this.object.position.set(Math.cos(angle) * visual.orbitRadius, 0, Math.sin(angle) * visual.orbitRadius);
    }
    if (Number.isFinite(visual.rotationPeriod) && visual.rotationPeriod > 0) {
      this.mesh.rotation.y += (delta * timeScale / visual.rotationPeriod) * Math.PI * 2 * visual.rotationDirection;
    }
    this.anchor.rotation.y = elapsed * timeScale * 0.4;
  }

  addChild(child: CelestialBody): void {
    this.anchor.add(child.object);
  }

  getMesh(): THREE.Mesh { return this.mesh; }

  dispose(): void {
    this.mesh.geometry.dispose();
    const material = this.mesh.material;
    if (Array.isArray(material)) material.forEach((item) => item.dispose()); else material.dispose();
    this.orbit?.geometry.dispose();
    if (this.orbit?.material instanceof THREE.Material) this.orbit.material.dispose();
  }

  private createMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(this.data.visual.radius, 32, 20);
    const material = new THREE.MeshStandardMaterial({ color: this.data.visual.color, roughness: this.data.type === "star" ? 0.35 : 0.82, metalness: this.data.type === "spacecraft" ? 0.45 : 0, emissive: this.data.visual.emissive ?? 0, emissiveIntensity: this.data.visual.emissiveIntensity ?? 0 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = THREE.MathUtils.degToRad(this.data.visual.axialTilt);
    mesh.userData.celestialId = this.data.id;
    if (this.data.id === "saturn") {
      const ring = new THREE.Mesh(new THREE.RingGeometry(2.4, 3.35, 64), new THREE.MeshBasicMaterial({ color: 0xd6bd93, side: THREE.DoubleSide, transparent: true, opacity: 0.65 }));
      ring.rotation.x = Math.PI / 2.35;
      mesh.add(ring);
    }
    return mesh;
  }

  private createOrbit(): THREE.LineLoop {
    const points = Array.from({ length: 128 }, (_, index) => { const angle = index / 128 * Math.PI * 2; return new THREE.Vector3(Math.cos(angle) * this.data.visual.orbitRadius, 0, Math.sin(angle) * this.data.visual.orbitRadius); });
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x8790a8, transparent: true, opacity: 0.2 }));
  }
}
