import * as THREE from "three";
import { Camera } from "../core/Camera";
import { Selection } from "./Selection";

export class Raycaster {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private targets: THREE.Object3D[] = [];
  private hoveredObject: THREE.Object3D | null = null;

  constructor(
    private readonly camera: Camera,
    private readonly selection: Selection,
    private readonly element: HTMLElement,
  ) {
    element.addEventListener("pointermove", this.onPointerMove);
    element.addEventListener("click", this.onClick);
  }

  setTargets(targets: THREE.Object3D[]): void {
    this.targets = targets;
  }

  dispose(): void {
    this.element.removeEventListener("pointermove", this.onPointerMove);
    this.element.removeEventListener("click", this.onClick);
  }

  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.element.getBoundingClientRect();

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera.instance);

    const hit = this.raycaster.intersectObjects(this.targets, false)[0]?.object;
    const id = typeof hit?.userData.celestialId === "string"
      ? hit.userData.celestialId
      : null;

    this.hoveredObject = hit ?? null;
    this.selection.hover(id);
    this.element.style.cursor = id ? "pointer" : "default";
  };

  private onClick = (): void => {
    const id = typeof this.hoveredObject?.userData.celestialId === "string"
      ? this.hoveredObject.userData.celestialId
      : null;

    if (id) {
      this.selection.select(id);
      console.log("Selected celestial body:", id);
    }
  };
}