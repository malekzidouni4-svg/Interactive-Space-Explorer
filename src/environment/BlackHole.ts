import * as THREE from "three";

export class BlackHole {
  readonly object: THREE.Group;
  private disk1: THREE.Mesh;
  private disk2: THREE.Mesh;
  private halo: THREE.Mesh;

  constructor(scene: THREE.Scene, position = new THREE.Vector3(-320, 60, -380)) {
    this.object = new THREE.Group();
    this.object.position.copy(position);

    // Event Horizon (Superdense Black Sphere)
    const horizonGeo = new THREE.SphereGeometry(8, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    horizon.userData.celestialId = "blackhole";
    this.object.add(horizon);

    // Gravitational Lensing Halo (Outer distortion glow)
    const haloGeo = new THREE.RingGeometry(8.2, 11.5, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    this.halo = new THREE.Mesh(haloGeo, haloMat);
    this.halo.userData.celestialId = "blackhole";
    this.object.add(this.halo);

    // Inner Hot Accretion Disk (Gold / Amber)
    const diskGeo1 = new THREE.RingGeometry(9.5, 18, 64);
    const diskMat1 = new THREE.MeshStandardMaterial({
      color: 0xff7700,
      emissive: 0xff4400,
      emissiveIntensity: 3.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    this.disk1 = new THREE.Mesh(diskGeo1, diskMat1);
    this.disk1.rotation.x = Math.PI / 2.3;
    this.disk1.userData.celestialId = "blackhole";
    this.object.add(this.disk1);

    // Outer Cooler Accretion Disk (Magenta / Purple swirl)
    const diskGeo2 = new THREE.RingGeometry(18, 28, 64);
    const diskMat2 = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0x8b5cf6,
      emissiveIntensity: 2.0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    this.disk2 = new THREE.Mesh(diskGeo2, diskMat2);
    this.disk2.rotation.x = Math.PI / 2.3;
    this.disk2.userData.celestialId = "blackhole";
    this.object.add(this.disk2);

    // Ambient Point Light from Accretion Disk
    const light = new THREE.PointLight(0xff5500, 3, 250);
    this.object.add(light);

    scene.add(this.object);
  }

  update(delta: number): void {
    if (this.disk1) {
      this.disk1.rotation.z += delta * 0.5;
    }
    if (this.disk2) {
      this.disk2.rotation.z -= delta * 0.25;
    }
    if (this.halo) {
      this.halo.rotation.z += delta * 0.1;
    }
  }
}
