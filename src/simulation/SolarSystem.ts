import * as THREE from "three";
import { CelestialBody } from "../celestial/CelestialBody";
import { planets, sun } from "../data/solarSystem";

export class SolarSystem {
  readonly bodies: CelestialBody[];
  private asteroidBelt: THREE.InstancedMesh | null = null;
  private moons: { mesh: THREE.Mesh; parentBody: CelestialBody; orbitRadius: number; speed: number }[] = [];

  constructor(scene: THREE.Scene) {
    this.bodies = [sun, ...planets].map((data) => new CelestialBody(data));

    for (const body of this.bodies) {
      scene.add(body.object);
      if (body.orbit) scene.add(body.orbit);
    }

    this.createAsteroidBelt(scene);
    this.createMoons(scene);

    const light = new THREE.PointLight(0xffd7aa, 500, 0, 2);
    light.position.set(0, 0, 0);
    scene.add(light);
  }

  private createAsteroidBelt(scene: THREE.Scene): void {
    const count = 800;
    const geometry = new THREE.DodecahedronGeometry(0.08, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x887766, roughness: 0.9 });
    this.asteroidBelt = new THREE.InstancedMesh(geometry, material, count);

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    const minRadius = 20;
    const maxRadius = 22.5;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const y = (Math.random() - 0.5) * 1.5;

      position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      quaternion.setFromEuler(rotation);
      const s = 0.5 + Math.random() * 1.2;
      scale.set(s, s, s);

      matrix.compose(position, quaternion, scale);
      this.asteroidBelt.setMatrixAt(i, matrix);
    }

    this.asteroidBelt.instanceMatrix.needsUpdate = true;
    scene.add(this.asteroidBelt);
  }

  private createMoons(scene: THREE.Scene): void {
    const earth = this.getById("earth");
    if (earth) {
      const moonGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const moonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 });
      const moonMesh = new THREE.Mesh(moonGeo, moonMat);
      scene.add(moonMesh);

      this.moons.push({
        mesh: moonMesh,
        parentBody: earth,
        orbitRadius: 2.2,
        speed: 2.5,
      });
    }
  }

  update(elapsed: number, delta: number): void {
    for (const body of this.bodies) {
      body.update(elapsed, delta);
    }

    for (const moon of this.moons) {
      const angle = elapsed * moon.speed;
      const parentPos = moon.parentBody.object.position;
      moon.mesh.position.set(
        parentPos.x + Math.cos(angle) * moon.orbitRadius,
        parentPos.y,
        parentPos.z + Math.sin(angle) * moon.orbitRadius
      );
    }

    if (this.asteroidBelt) {
      this.asteroidBelt.rotation.y += delta * 0.05;
    }
  }

  getPickableObjects(): THREE.Object3D[] {
    return this.bodies.map((body) => body.object);
  }

  getById(id: string): CelestialBody | undefined {
    return this.bodies.find((body) => body.data.id === id);
  }
}