import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Camera {
  readonly instance: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  private targetObject: THREE.Object3D | null = null;
  private isTransitioning = false;
  private idealOffset = new THREE.Vector3(0, 5, 12);
  private initialPosition = new THREE.Vector3(35, 25, 60);

  constructor(renderer: THREE.WebGLRenderer) {
    this.instance = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );

    this.instance.position.copy(this.initialPosition);

    this.controls = new OrbitControls(this.instance, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 1500;
    this.controls.target.set(0, 0, 0);
  }

  focusOn(object: THREE.Object3D | null, radius = 2): void {
    this.targetObject = object;
    if (object) {
      this.isTransitioning = true;
      const offsetDistance = Math.max(radius * 4.2, 5.0);
      this.idealOffset.set(0, offsetDistance * 0.35, offsetDistance);
    }
  }

  returnToSystem(): void {
    this.targetObject = null;
    this.isTransitioning = true;
  }

  resetFocus(): void {
    this.returnToSystem();
  }

  update(): void {
    if (this.targetObject) {
      const worldPos = new THREE.Vector3();
      this.targetObject.getWorldPosition(worldPos);

      if (this.isTransitioning) {
        this.controls.target.lerp(worldPos, 0.06);
        const desiredCamPos = worldPos.clone().add(this.idealOffset);
        this.instance.position.lerp(desiredCamPos, 0.06);

        if (
          this.controls.target.distanceTo(worldPos) < 0.2 &&
          this.instance.position.distanceTo(desiredCamPos) < 0.5
        ) {
          this.isTransitioning = false;
        }
      } else {
        const delta = worldPos.clone().sub(this.controls.target);
        this.controls.target.copy(worldPos);
        this.instance.position.add(delta);
      }
    } else if (this.isTransitioning) {
      const origin = new THREE.Vector3(0, 0, 0);
      this.controls.target.lerp(origin, 0.06);
      this.instance.position.lerp(this.initialPosition, 0.06);

      if (
        this.controls.target.distanceTo(origin) < 0.2 &&
        this.instance.position.distanceTo(this.initialPosition) < 0.5
      ) {
        this.isTransitioning = false;
      }
    }

    this.controls.update();
  }

  resize(width: number, height: number): void {
    this.instance.aspect = width / height;
    this.instance.updateProjectionMatrix();
  }
}