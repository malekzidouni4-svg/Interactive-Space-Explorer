import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Camera {
  readonly instance: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;

  constructor(renderer: THREE.WebGLRenderer) {
    this.instance = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );

    this.instance.position.set(30, 24, 55);

    this.controls = new OrbitControls(this.instance, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 7;
    this.controls.maxDistance = 1200;
    this.controls.target.set(0, 0, 0);
  }

  update(): void {
    this.controls.update();
  }

  resize(width: number, height: number): void {
    this.instance.aspect = width / height;
    this.instance.updateProjectionMatrix();
  }
}