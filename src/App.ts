import * as THREE from "three";
import { Camera } from "./core/Camera";
import { Clock } from "./core/Clock";
import { Renderer } from "./core/Renderer";
import { Scene } from "./core/Scene";
import { Raycaster } from "./interaction/Raycaster";
import { Selection } from "./interaction/Selection";
import { SolarSystem } from "./simulation/SolarSystem";

export class App {
  private readonly scene = new Scene();
  private readonly renderer: Renderer;
  private readonly camera: Camera;
  private readonly clock = new Clock();
  private readonly solarSystem: SolarSystem;
  private readonly selection = new Selection();
  private readonly raycaster: Raycaster;

  constructor(container: HTMLElement) {
    this.renderer = new Renderer(container);
    this.camera = new Camera(this.renderer.instance);
    this.solarSystem = new SolarSystem(this.scene.instance);

    this.raycaster = new Raycaster(
      this.camera,
      this.selection,
      this.renderer.instance.domElement,
    );

    this.raycaster.setTargets(this.solarSystem.getPickableObjects());

    window.addEventListener("resize", this.onResize);
  }

  start(): void {
    requestAnimationFrame(this.animate);
  }

  dispose(): void {
    window.removeEventListener("resize", this.onResize);
    this.raycaster.dispose();
    this.renderer.dispose();
  }

  private animate = (): void => {
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    this.solarSystem.update(elapsed, delta);
    this.camera.update();
    this.renderer.render(this.scene.instance, this.camera.instance);

    requestAnimationFrame(this.animate);
  };

  private onResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.resize(width, height);
    this.camera.resize(width, height);
  };
}