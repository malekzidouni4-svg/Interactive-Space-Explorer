import * as THREE from "three";
import { Camera } from "../core/Camera";
import { Selection } from "./Selection";
import { HoverLabel } from "./HoverLabel";

export class Raycaster {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private targets: THREE.Object3D[] = [];
  private hoveredObject: THREE.Object3D | null = null;
  private readonly hoverLabel = new HoverLabel();

  constructor(
    private readonly camera: Camera,
    private readonly selection: Selection,
    private readonly element: HTMLElement,
    private readonly getCelestialName: (id: string) => { name: string; type: string } | null
  ) {
    element.addEventListener("pointermove", this.onPointerMove);
    element.addEventListener("click", this.onClick);
    element.addEventListener("touchstart", this.onTouchStart, { passive: true });
  }

  setTargets(targets: THREE.Object3D[]): void {
    this.targets = targets;
  }

  dispose(): void {
    this.element.removeEventListener("pointermove", this.onPointerMove);
    this.element.removeEventListener("click", this.onClick);
    this.element.removeEventListener("touchstart", this.onTouchStart);
  }

  private findTargetCelestialId(obj: THREE.Object3D | null): { id: string; object: THREE.Object3D } | null {
    let curr: THREE.Object3D | null = obj;
    while (curr) {
      if (typeof curr.userData?.celestialId === "string") {
        return { id: curr.userData.celestialId, object: curr };
      }
      curr = curr.parent;
    }
    return null;
  }

  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.element.getBoundingClientRect();

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera.instance);

    const intersects = this.raycaster.intersectObjects(this.targets, true);
    const firstHit = intersects.length > 0 ? intersects[0].object : null;
    const targetInfo = this.findTargetCelestialId(firstHit);

    const id = targetInfo?.id || null;

    this.hoveredObject = targetInfo?.object || null;
    this.selection.hover(id);
    this.element.style.cursor = id ? "pointer" : "default";

    if (id) {
      const info = this.getCelestialName(id);
      if (info) {
        this.hoverLabel.show(info.name, info.type, event.clientX, event.clientY);
      } else {
        this.hoverLabel.hide();
      }
    } else {
      this.hoverLabel.hide();
    }
  };

  private onTouchStart = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const rect = this.element.getBoundingClientRect();
      this.pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera.instance);
      const intersects = this.raycaster.intersectObjects(this.targets, true);
      const firstHit = intersects.length > 0 ? intersects[0].object : null;
      const targetInfo = this.findTargetCelestialId(firstHit);

      if (targetInfo?.id) {
        this.selection.select(targetInfo.id);
      }
    }
  };

  private onClick = (): void => {
    const targetInfo = this.findTargetCelestialId(this.hoveredObject);
    const id = targetInfo?.id || null;

    if (id) {
      this.selection.select(id);
    }
  };
}