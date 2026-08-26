import * as THREE from "three";
import { CelestialBody } from "../celestial/CelestialBody";
import { planets, sun } from "../data/solarSystem";
import type { CelestialData } from "../data/types";

export class SolarSystem {
  readonly bodies: CelestialBody[];

  constructor(scene: THREE.Scene) {
    this.bodies = [sun, ...planets].map((data) => new CelestialBody(data));

    for (const body of this.bodies) {
      scene.add(body.object);
      if (body.orbit) scene.add(body.orbit);
    }

    const light = new THREE.PointLight(0xffd7aa, 500, 0, 2);
    light.position.set(0, 0, 0);
    scene.add(light);
  }

  update(elapsed: number, delta: number): void {
    for (const body of this.bodies) {
      body.update(elapsed, delta);
    }
  }

  getPickableObjects(): THREE.Object3D[] {
    return this.bodies.map((body) => body.object);
  }

  getById(id: string): CelestialBody | undefined {
    return this.bodies.find((body) => body.data.id === id);
  }
}