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

  private idealOffset = new THREE.Vector3(0, 5, 12);

  focusOn(object: THREE.Object3D | null, radius = 2): void {
    this.targetObject = object;
    if (object) {
      this.isFocusing = true;
      const offsetMultiplier = Math.max(radius * 3.5, 6);
      this.idealOffset.set(0, offsetMultiplier * 0.4, offsetMultiplier);
    }
  }

  resetFocus(): void {
    this.targetObject = null;
    this.isFocusing = false;
    this.controls.target.set(0, 0, 0);
    this.instance.position.set(30, 24, 55);
  }

  update(): void {
    if (this.targetObject) {
      const worldPos = new THREE.Vector3();
      this.targetObject.getWorldPosition(worldPos);

      if (this.isFocusing) {
        this.controls.target.lerp(worldPos, 0.08);
        const desiredCamPos = worldPos.clone().add(this.idealOffset);
        this.instance.position.lerp(desiredCamPos, 0.08);

        if (this.controls.target.distanceTo(worldPos) < 0.2) {
          this.isFocusing = false;
        }
      } else {
        const delta = worldPos.clone().sub(this.controls.target);
        this.controls.target.copy(worldPos);
        this.instance.position.add(delta);
      }
    }
    this.controls.update();
  }

  resize(width: number, height: number): void {
    this.instance.aspect = width / height;
    this.instance.updateProjectionMatrix();
  }
}