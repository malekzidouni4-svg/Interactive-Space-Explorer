import * as THREE from "three";
import { CelestialBody } from "../celestial/CelestialBody";
import { extraObjects, planets, sun } from "../data/solarSystem";

export class SolarSystem {
  readonly bodies: CelestialBody[];
  private asteroidBelt: THREE.InstancedMesh | null = null;
  private extraBodies: { data: typeof extraObjects[number]; mesh: THREE.Mesh; parentBody?: CelestialBody }[] = [];

  constructor(scene: THREE.Scene) {
    this.bodies = [sun, ...planets].map((data) => new CelestialBody(data));
    this.createExtraObjects(scene);

    for (const body of this.bodies) {
      scene.add(body.object);
      if (body.orbit) scene.add(body.orbit);
    }

    this.createAsteroidBelt(scene);

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

  private createExtraObjects(scene: THREE.Scene): void {
    for (const data of extraObjects) {
      if (data.type === "blackhole") continue;

      const geo = new THREE.SphereGeometry(data.radius, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.emissive ?? 0x000000,
        emissiveIntensity: data.emissiveIntensity ?? 0,
        roughness: 0.8,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.celestialId = data.id;
      scene.add(mesh);

      const parentBody = data.parentBodyId ? this.getById(data.parentBodyId) : undefined;
      this.extraBodies.push({ data, mesh, parentBody });
    }
  }

  update(elapsed: number, delta: number): void {
    for (const body of this.bodies) {
      body.update(elapsed, delta);
    }

    for (const item of this.extraBodies) {
      if (item.parentBody) {
        const angle = elapsed * (1 / item.data.orbitalPeriod);
        const parentPos = item.parentBody.object.position;
        item.mesh.position.set(
          parentPos.x + Math.cos(angle) * item.data.orbitRadius,
          parentPos.y,
          parentPos.z + Math.sin(angle) * item.data.orbitRadius
        );
      }
    }

    if (this.asteroidBelt) {
      this.asteroidBelt.rotation.y += delta * 0.05;
    }
  }

  getPickableObjects(): THREE.Object3D[] {
    const list = this.bodies.map((body) => body.object);
    for (const item of this.extraBodies) {
      list.push(item.mesh);
    }
    return list;
  }

  getById(id: string): CelestialBody | undefined {
    return this.bodies.find((body) => body.data.id === id);
  }

  getExtraDataById(id: string) {
    return extraObjects.find((item) => item.id === id);
  }

  getExtraObjectMesh(id: string): THREE.Mesh | undefined {
    return this.extraBodies.find((item) => item.data.id === id)?.mesh;
  }
}