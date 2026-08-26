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
  private isPaused = false;

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

    this.setupUIListeners();
    this.selection.onSelectionChange((id) => this.onCelestialSelected(id));

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

    if (!this.isPaused) {
      this.solarSystem.update(elapsed, delta);
    }
    this.camera.update();
    this.renderer.render(this.scene.instance, this.camera.instance);

    requestAnimationFrame(this.animate);
  };

  private setupUIListeners(): void {
    const selectElem = document.getElementById("celestial-select") as HTMLSelectElement | null;
    const btnPause = document.getElementById("btn-pause") as HTMLButtonElement | null;
    const btnReset = document.getElementById("btn-reset") as HTMLButtonElement | null;
    const btnClose = document.getElementById("close-panel") as HTMLButtonElement | null;

    selectElem?.addEventListener("change", (e) => {
      const val = (e.target as HTMLSelectElement).value;
      if (val) {
        this.selection.select(val);
      } else {
        this.selection.select(null);
      }
    });

    btnPause?.addEventListener("click", () => {
      this.isPaused = !this.isPaused;
      btnPause.textContent = this.isPaused ? "▶️ تشغيل" : "⏸️ إيقاف مؤقت";
    });

    btnReset?.addEventListener("click", () => {
      this.selection.select(null);
      this.camera.resetFocus();
    });

    btnClose?.addEventListener("click", () => {
      this.selection.select(null);
    });
  }

  private onCelestialSelected(id: string | null): void {
    const panel = document.getElementById("info-panel");
    const selectElem = document.getElementById("celestial-select") as HTMLSelectElement | null;

    if (selectElem) {
      selectElem.value = id || "";
    }

    if (!id) {
      panel?.classList.add("hidden");
      this.camera.resetFocus();
      return;
    }

    const celestial = this.solarSystem.getById(id);
    if (!celestial) return;

    this.camera.focusOn(celestial.object);

    const title = document.getElementById("info-title");
    const type = document.getElementById("info-type");
    const desc = document.getElementById("info-desc");
    const distance = document.getElementById("info-distance");
    const mass = document.getElementById("info-mass");
    const composition = document.getElementById("info-composition");
    const moons = document.getElementById("info-moons");

    if (title) title.textContent = celestial.data.name;
    if (type) type.textContent = celestial.data.type === "star" ? "نجم" : "كوكب";
    if (desc) desc.textContent = celestial.data.description || "";
    if (distance) distance.textContent = celestial.data.distanceFromSun || "-";
    if (mass) mass.textContent = celestial.data.mass || "-";
    if (composition) composition.textContent = celestial.data.composition || "-";
    if (moons) moons.textContent = celestial.data.moonsCount !== undefined ? celestial.data.moonsCount.toString() : "-";

    panel?.classList.remove("hidden");
  }

  private onResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.resize(width, height);
    this.camera.resize(width, height);
  };
}