import * as THREE from "three";
import { CelestialBody } from "../celestial/CelestialBody";
import { solarSystemData } from "../data/types";
import { AsteroidField, DeepSpace, MeteorSystem, Starfield } from "../environment/Starfield";

export class SolarSystem {
  readonly bodies: CelestialBody[];
  readonly starfield = new Starfield();
  readonly asteroids = new AsteroidField();
  readonly meteors = new MeteorSystem();
  readonly deepSpace = new DeepSpace();
  private readonly bodyMap = new Map<string, CelestialBody>();
  constructor(scene: THREE.Scene) { this.bodies = solarSystemData.map((data) => { const body = new CelestialBody(data); this.bodyMap.set(data.id, body); return body; }); for (const body of this.bodies) { if (body.data.parent) this.bodyMap.get(body.data.parent)?.addChild(body); else { scene.add(body.object); if (body.orbit) scene.add(body.orbit); } } scene.add(this.starfield.object, this.asteroids.object, this.meteors.object, this.deepSpace.object); const light = new THREE.PointLight(0xffd7aa, 460, 0, 2); scene.add(light); }
  update(elapsed: number, delta: number, timeScale: number): void { this.bodies.forEach((body) => body.update(elapsed, delta, timeScale)); this.starfield.update(elapsed); this.asteroids.update(elapsed, timeScale); this.meteors.update(elapsed); }
  getPickableObjects(): THREE.Object3D[] { return this.bodies.map((body) => body.getMesh()); }
  getById(id: string): CelestialBody | undefined { return this.bodyMap.get(id); }
  dispose(): void { this.bodies.forEach((body) => body.dispose()); this.starfield.dispose(); this.asteroids.dispose(); this.meteors.dispose(); }
}
