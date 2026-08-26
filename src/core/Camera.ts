import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Camera {
  readonly instance: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  private targetObject: THREE.Object3D | null = null;
  private isFocusing = false;

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

  focusOn(object: THREE.Object3D | null): void {
    this.targetObject = object;
    if (object) {
      this.isFocusing = true;
    }
  }

  resetFocus(): void {
    this.targetObject = null;
    this.isFocusing = false;
    this.controls.target.set(0, 0, 0);
  }

  update(): void {
    if (this.targetObject) {
      const worldPos = new THREE.Vector3();
      this.targetObject.getWorldPosition(worldPos);

      if (this.isFocusing) {
        // Smooth transition target and camera position towards target object
        this.controls.target.lerp(worldPos, 0.08);
        const distance = this.controls.target.distanceTo(worldPos);
        if (distance < 0.1) {
          this.isFocusing = false;
        }
      } else {
        // Track target object position
        this.controls.target.copy(worldPos);
      }
    }
    this.controls.update();
  }

  resize(width: number, height: number): void {
    this.instance.aspect = width / height;
    this.instance.updateProjectionMatrix();
  }
}