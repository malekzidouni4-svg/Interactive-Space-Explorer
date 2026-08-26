import * as THREE from "three";

export class BlackHole {
  readonly object: THREE.Group;
  private disk: THREE.Mesh;

  constructor(scene: THREE.Scene, position = new THREE.Vector3(-120, 15, -120)) {
    this.object = new THREE.Group();
    this.object.position.copy(position);

    // Event Horizon (Black Sphere)
    const horizonGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    horizon.userData.celestialId = "blackhole";
    this.object.add(horizon);

    // Accretion Disk (Glowing Ring)
    const diskGeo = new THREE.RingGeometry(4.2, 9.0, 64);
    const diskMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff3300,
      emissiveIntensity: 2.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    this.disk = new THREE.Mesh(diskGeo, diskMat);
    this.disk.rotation.x = Math.PI / 2.5;
    this.disk.userData.celestialId = "blackhole";
    this.object.add(this.disk);

    scene.add(this.object);
  }

  update(delta: number): void {
    if (this.disk) {
      this.disk.rotation.z += delta * 0.4;
    }
  }
}
