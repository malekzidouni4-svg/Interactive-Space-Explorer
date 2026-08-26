import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Camera {
  readonly instance: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  private transition: { position: THREE.Vector3; target: THREE.Vector3; progress: number } | null = null;
  private readonly keys = new Set<string>();
  private readonly forward = new THREE.Vector3();
  private readonly right = new THREE.Vector3();
  private readonly movement = new THREE.Vector3();
  private lastTime = performance.now();
  constructor(renderer: THREE.WebGLRenderer) {
    this.instance = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.instance.position.set(30, 24, 55);
    this.controls = new OrbitControls(this.instance, renderer.domElement);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 3; this.controls.maxDistance = 220; this.controls.target.set(0, 0, 0);
    window.addEventListener("keydown", this.onKeyDown); window.addEventListener("keyup", this.onKeyUp);
  }
  focus(position: THREE.Vector3, radius: number): void { const direction = this.instance.position.clone().sub(this.controls.target).normalize(); this.transition = { position: position.clone().add(direction.multiplyScalar(Math.max(radius * 4, 7))), target: position.clone(), progress: 0 }; this.controls.enabled = false; }
  reset(): void { this.transition = { position: new THREE.Vector3(30, 24, 55), target: new THREE.Vector3(), progress: 0 }; this.controls.enabled = false; }
  update(): void {
    const now = performance.now(); const delta = Math.min((now - this.lastTime) / 1000, 0.05); this.lastTime = now;
    if (this.transition) { this.transition.progress = Math.min(1, this.transition.progress + 0.035); const eased = 1 - Math.pow(1 - this.transition.progress, 3); this.instance.position.lerpVectors(this.instance.position, this.transition.position, eased * 0.12); this.controls.target.lerpVectors(this.controls.target, this.transition.target, eased * 0.12); if (this.transition.progress >= 1) { this.transition = null; this.controls.enabled = true; } }
    if (!this.transition && this.keys.size) {
      this.instance.getWorldDirection(this.forward); this.forward.y = 0; this.forward.normalize(); this.right.crossVectors(this.forward, this.instance.up).normalize(); this.movement.set(0, 0, 0);
      if (this.keys.has("w")) this.movement.add(this.forward); if (this.keys.has("s")) this.movement.sub(this.forward); if (this.keys.has("d")) this.movement.add(this.right); if (this.keys.has("a")) this.movement.sub(this.right); if (this.keys.has("e")) this.movement.y += 1; if (this.keys.has("q")) this.movement.y -= 1;
      if (this.movement.lengthSq()) { const speed = this.keys.has("shift") ? 34 : 14; this.movement.normalize().multiplyScalar(speed * delta); this.instance.position.add(this.movement); this.controls.target.add(this.movement); }
    }
    this.controls.update();
  }
  dispose(): void { window.removeEventListener("keydown", this.onKeyDown); window.removeEventListener("keyup", this.onKeyUp); }
  resize(width: number, height: number): void { this.instance.aspect = width / height; this.instance.updateProjectionMatrix(); }
  private onKeyDown = (event: KeyboardEvent): void => { if (["w", "a", "s", "d", "q", "e", "shift"].includes(event.key.toLowerCase())) this.keys.add(event.key.toLowerCase()); };
  private onKeyUp = (event: KeyboardEvent): void => { this.keys.delete(event.key.toLowerCase()); };
}
