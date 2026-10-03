import * as THREE from "three";

export class FreeFlightController {
  readonly ship = new THREE.Object3D();
  private readonly velocity = new THREE.Vector3();
  private readonly keys = new Set<string>();
  private readonly forward = new THREE.Vector3();
  private readonly right = new THREE.Vector3();
  private readonly up = new THREE.Vector3(0, 1, 0);
  private boost = false;
  private enabled = true;

  constructor(private readonly element: HTMLElement) {
    element.addEventListener("click", this.capture);
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
  }

  dispose(): void {
    this.element.removeEventListener("click", this.capture);
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.velocity.multiplyScalar(0.75);
  }

  update(delta: number): void {
    if (!this.enabled) return;
    const acceleration = this.boost ? 28 : 10;
    const maxSpeed = this.boost ? 42 : 14;
    this.forward.set(0, 0, -1).applyQuaternion(this.ship.quaternion);
    this.right.set(1, 0, 0).applyQuaternion(this.ship.quaternion);
    const input = new THREE.Vector3();
    if (this.keys.has("KeyW")) input.add(this.forward);
    if (this.keys.has("KeyS")) input.sub(this.forward);
    if (this.keys.has("KeyD")) input.add(this.right);
    if (this.keys.has("KeyA")) input.sub(this.right);
    if (this.keys.has("Space")) input.add(this.up);
    if (this.keys.has("ControlLeft") || this.keys.has("ControlRight")) input.sub(this.up);
    if (input.lengthSq() > 0) this.velocity.addScaledVector(input.normalize(), acceleration * delta);
    else this.velocity.multiplyScalar(Math.pow(0.035, delta));
    if (this.keys.has("KeyX")) this.velocity.multiplyScalar(Math.pow(0.001, delta));
    if (this.velocity.length() > maxSpeed) this.velocity.setLength(maxSpeed);
    this.ship.position.addScaledVector(this.velocity, delta);
  }

  get speed(): number { return this.velocity.length(); }
  get isBoosting(): boolean { return this.boost && this.speed > 0.1; }

  private capture = (): void => {
    if (window.matchMedia("(pointer: fine)").matches) this.element.requestPointerLock?.();
  };
  private keyDown = (event: KeyboardEvent): void => {
    if (["Space", "ControlLeft", "ControlRight"].includes(event.code)) event.preventDefault();
    this.keys.add(event.code);
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") this.boost = true;
  };
  private keyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") this.boost = false;
  };
}
