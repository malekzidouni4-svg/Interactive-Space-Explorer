import * as THREE from "three";
import type { CelestialData } from "../data/types";

export class CelestialBody {
  readonly data: CelestialData;
  readonly object: THREE.Mesh;
  readonly orbit?: THREE.LineLoop;
  readonly rings?: THREE.Mesh;

  constructor(data: CelestialData) {
    this.data = data;
    this.object = this.createObject();

    if (data.orbitRadius > 0) {
      this.orbit = this.createOrbit();
    }

    if (data.hasRings) {
      this.rings = this.createRings();
      this.object.add(this.rings);
    }
  }

  update(elapsed: number, delta: number): void {
    if (this.data.orbitRadius > 0 && Number.isFinite(this.data.orbitalPeriod)) {
      const angle = (elapsed / this.data.orbitalPeriod) * Math.PI * 2;
      this.object.position.set(
        Math.cos(angle) * this.data.orbitRadius,
        0,
        Math.sin(angle) * this.data.orbitRadius,
      );
    }

    if (Number.isFinite(this.data.rotationPeriod) && this.data.rotationPeriod > 0) {
      const rotation = (delta / this.data.rotationPeriod) * Math.PI * 2;
      this.object.rotation.y += rotation * this.data.rotationDirection;
    }
  }

  private createObject(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(this.data.radius, 48, 32);
    const material = new THREE.MeshStandardMaterial({
      color: this.data.color,
      roughness: 0.75,
      metalness: 0,
      emissive: this.data.emissive ?? 0x000000,
      emissiveIntensity: this.data.emissiveIntensity ?? 0,
    });

    const object = new THREE.Mesh(geometry, material);
    object.rotation.z = THREE.MathUtils.degToRad(this.data.axialTilt);
    object.userData.celestialId = this.data.id;

    return object;
  }

  private createRings(): THREE.Mesh {
    const innerRadius = this.data.radius * 1.3;
    const outerRadius = this.data.radius * 2.3;
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

    // Rotate ring geometry to lie flat on the planet's equatorial plane (XZ plane)
    geometry.rotateX(Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({
      color: this.data.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      roughness: 0.6,
    });

    return new THREE.Mesh(geometry, material);
  }

  private createOrbit(): THREE.LineLoop {
    const points: THREE.Vector3[] = [];
    const segments = 128;

    for (let i = 0; i < segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * this.data.orbitRadius,
          0,
          Math.sin(angle) * this.data.orbitRadius,
        ),
      );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x66708a,
      transparent: true,
      opacity: 0.18,
    });

    return new THREE.LineLoop(geometry, material);
  }

  dispose(): void {
    this.object.geometry.dispose();

    const material = this.object.material;
    if (Array.isArray(material)) {
      (material as THREE.Material[]).forEach((item) => item.dispose());
    } else {
      (material as THREE.Material).dispose();
    }

    this.orbit?.geometry.dispose();
    (this.orbit?.material as THREE.Material | undefined)?.dispose();

    if (this.rings) {
      this.rings.geometry.dispose();
      (this.rings.material as THREE.Material).dispose();
    }
  }
}