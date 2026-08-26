import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Camera {
  readonly instance: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  private transition: { position: THREE.Vector3; target: THREE.Vector3; progress: number } | null = null;
  constructor(renderer: THREE.WebGLRenderer) { this.instance = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000); this.instance.position.set(30, 24, 55); this.controls = new OrbitControls(this.instance, renderer.domElement); this.controls.enableDamping = true; this.controls.dampingFactor = 0.06; this.controls.minDistance = 6; this.controls.maxDistance = 140; this.controls.target.set(0, 0, 0); }
  focus(position: THREE.Vector3, radius: number): void { const direction = this.instance.position.clone().sub(this.controls.target).normalize(); this.transition = { position: position.clone().add(direction.multiplyScalar(Math.max(radius * 4, 7))), target: position.clone(), progress: 0 }; this.controls.enabled = false; }
  reset(): void { this.transition = { position: new THREE.Vector3(30, 24, 55), target: new THREE.Vector3(), progress: 0 }; this.controls.enabled = false; }
  update(): void { if (this.transition) { this.transition.progress = Math.min(1, this.transition.progress + 0.035); const eased = 1 - Math.pow(1 - this.transition.progress, 3); this.instance.position.lerpVectors(this.instance.position, this.transition.position, eased * 0.12); this.controls.target.lerpVectors(this.controls.target, this.transition.target, eased * 0.12); if (this.transition.progress >= 1) { this.transition = null; this.controls.enabled = true; } } this.controls.update(); }
  resize(width: number, height: number): void { this.instance.aspect = width / height; this.instance.updateProjectionMatrix(); }
}
