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
  private isPaused = false;
  private timeSpeed = 1.0;
  private customElapsed = 0;

  constructor(container: HTMLElement) {
    this.renderer = new Renderer(container);
    this.camera = new Camera(this.renderer.instance);
    this.solarSystem = new SolarSystem(this.scene.instance);

    this.raycaster = new Raycaster(
      this.camera,
      this.selection,
      this.renderer.instance.domElement,
    );

    const targets = [
      ...this.solarSystem.getPickableObjects(),
      this.scene.blackHole.object,
    ];
    this.raycaster.setTargets(targets);

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
    const delta = this.clock.getDelta() * this.timeSpeed;
    if (!this.isPaused) {
      this.customElapsed += delta;
      this.solarSystem.update(this.customElapsed, delta);
      this.scene.meteors.update(delta);
      this.scene.blackHole.update(delta);
    }
    this.camera.update();
    this.renderer.render(this.scene.instance, this.camera.instance);

    requestAnimationFrame(this.animate);
  };

  private setupUIListeners(): void {
    const selectElem = document.getElementById("celestial-select") as HTMLSelectElement | null;
    const speedSelect = document.getElementById("speed-select") as HTMLSelectElement | null;
    const btnPause = document.getElementById("btn-pause") as HTMLButtonElement | null;
    const btnReset = document.getElementById("btn-reset") as HTMLButtonElement | null;
    const btnClose = document.getElementById("close-panel") as HTMLButtonElement | null;
    const btnExplore = document.getElementById("btn-explore-details") as HTMLButtonElement | null;

    btnExplore?.addEventListener("click", () => {
      const detailedText = document.getElementById("detailed-info-text");
      detailedText?.classList.toggle("hidden");
    });

    speedSelect?.addEventListener("change", (e) => {
      this.timeSpeed = parseFloat((e.target as HTMLSelectElement).value) || 1.0;
    });

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
    const detailedText = document.getElementById("detailed-info-text");
    if (detailedText) detailedText.classList.add("hidden");

    if (selectElem) {
      selectElem.value = id || "";
    }

    if (!id) {
      panel?.classList.add("hidden");
      this.camera.resetFocus();
      return;
    }

    const celestial = this.solarSystem.getById(id);
    const extraData = this.solarSystem.getExtraDataById(id);
    const extraMesh = this.solarSystem.getExtraObjectMesh(id);

    let data: any = celestial?.data || extraData;
    let targetObj: THREE.Object3D | undefined = celestial?.object || extraMesh;

    if (id === "blackhole") {
      targetObj = this.scene.blackHole.object;
      data = {
        id: "blackhole",
        name: "الثقب الأسود (Black Hole)",
        type: "blackhole",
        radius: 3.5,
        orbitRadius: 120,
        orbitalPeriod: Infinity,
        rotationPeriod: 10,
        rotationDirection: 1,
        axialTilt: 0,
        color: 0x000000,
        description: "جرم كوني شديد الجاذبية بعيد في أطراف الفضاء، لا يمكن لأي شيء ولا حتى الضوء الإفلات منه.",
        distanceFromSun: "بعيد جداً",
        mass: "4.3 مليون كتلة شمسية",
        composition: "Singularity",
        didYouKnow: "ينحني الضوء والزمان والفضـاء بشدة حول أفق الحدث للثقب الأسود.",
        detailedInfo: "تحيط بالثقب الأسود قرص تزويد متوهج ممتلئ بالغازات والمادة الساخنة."
      };
    }

    if (!data || !targetObj) return;

    this.camera.focusOn(targetObj, data.radius);

    const title = document.getElementById("info-title");
    const type = document.getElementById("info-type");
    const desc = document.getElementById("info-desc");
    const distance = document.getElementById("info-distance");
    const mass = document.getElementById("info-mass");
    const composition = document.getElementById("info-composition");
    const moons = document.getElementById("info-moons");

    const didYouKnowBox = document.getElementById("did-you-know-box");
    const didYouKnowText = document.getElementById("did-you-know-text");
    const detailedInfoText = document.getElementById("detailed-info-text");

    if (title) title.textContent = data.name;
    if (type) {
      const typeMap: Record<string, string> = {
        star: "نجم",
        planet: "كوكب",
        moon: "قمر طبيعي",
        spacecraft: "محطة فضائية",
        blackhole: "ثقب أسود"
      };
      type.textContent = typeMap[data.type] || "جرم سماوي";
    }
    if (desc) desc.textContent = data.description || "";
    if (distance) distance.textContent = data.distanceFromSun || "-";
    if (mass) mass.textContent = data.mass || "-";
    if (composition) composition.textContent = data.composition || "-";
    if (moons) moons.textContent = data.moonsCount !== undefined ? data.moonsCount.toString() : "-";

    if (didYouKnowBox && didYouKnowText) {
      if (data.didYouKnow) {
        didYouKnowText.textContent = data.didYouKnow;
        didYouKnowBox.classList.remove("hidden");
      } else {
        didYouKnowBox.classList.add("hidden");
      }
    }

    if (detailedInfoText && data.detailedInfo) {
      detailedInfoText.textContent = data.detailedInfo;
    }

    panel?.classList.remove("hidden");
  }

  private onResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.resize(width, height);
    this.camera.resize(width, height);
  };
}