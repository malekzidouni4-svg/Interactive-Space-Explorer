import * as THREE from "three";

export class Lighting {
  constructor(scene: THREE.Scene) {
    scene.add(new THREE.AmbientLight(0x283044, 0.25));

    const fill = new THREE.HemisphereLight(0x80bfff, 0x0a0a14, 0.2);
    scene.add(fill);
  }
}
