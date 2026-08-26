import * as THREE from "three";

export class Lighting {
  constructor(scene: THREE.Scene) {
    scene.add(new THREE.AmbientLight(0x182033, 0.18));

    const fill = new THREE.HemisphereLight(0x9bbcff, 0x050509, 0.12);
    scene.add(fill);
  }
}