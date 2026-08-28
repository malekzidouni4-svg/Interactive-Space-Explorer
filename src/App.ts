import * as THREE from "three";
import { Camera } from "./core/Camera";
import { Clock } from "./core/Clock";
import { Renderer } from "./core/Renderer";
import { Scene } from "./core/Scene";
import { Raycaster } from "./interaction/Raycaster";
import { Selection } from "./interaction/Selection";
import { SolarSystem } from "./simulation/SolarSystem";
import { SoundSystem } from "./core/Sound";
import { QuizSystem } from "./ui/Quiz";
import { Discoveries } from "./ui/Discoveries";
import { LoadingScreen } from "./ui/LoadingScreen";

export class App {
  private readonly scene = new Scene();
  private readonly renderer: Renderer;
  private readonly camera: Camera;
  private readonly clock = new Clock();
  private readonly solarSystem: SolarSystem;
  private readonly selection = new Selection();
  private readonly raycaster: Raycaster;
  private readonly sound = new SoundSystem();
  private readonly quiz = new QuizSystem();
  private readonly discoveries = new Discoveries();
  private readonly loadingScreen = new LoadingScreen();
  private isPaused = false;
  private isMapMode = false;
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
      this.scene.comet.object,
    ];
    this.raycaster.setTargets(targets);

    this.setupUIListeners();
    this.selection.onSelectionChange((id) => this.onCelestialSelected(id));

    this.discoveries.onUpdate((count) => {
      const countElem = document.getElementById("discovery-count");
      if (countElem) countElem.textContent = count.toString();
    });

    window.addEventListener("resize", this.onResize);
  }

  start(): void {
    setTimeout(() => {
      this.loadingScreen.hide();
    }, 1200);

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
      this.scene.comet.update(this.customElapsed);
      this.scene.galaxy1.update(delta);
      this.scene.galaxy2.update(delta);
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
    const btnSound = document.getElementById("btn-sound") as HTMLButtonElement | null;
    const btnQuiz = document.getElementById("btn-quiz") as HTMLButtonElement | null;
    const btnMap = document.getElementById("btn-map") as HTMLButtonElement | null;

    btnMap?.addEventListener("click", () => {
      this.sound.playClickSound();
      this.isMapMode = !this.isMapMode;
      if (this.isMapMode) {
        this.camera.instance.position.set(0, 80, 0.1);
        this.camera.controls.target.set(0, 0, 0);
        btnMap.textContent = "🪐 وضع الاستكشاف";
      } else {
        this.camera.resetFocus();
        btnMap.textContent = "🗺️ وضع الخريطة";
      }
    });

    btnSound?.addEventListener("click", () => {
      this.sound.init();
      const muted = this.sound.toggleMute();
      btnSound.textContent = muted ? "🔇 مكتوم" : "🔊 الصوت";
    });

    btnQuiz?.addEventListener("click", () => {
      this.sound.init();
      this.sound.playClickSound();
      this.openQuizModal();
    });

    btnExplore?.addEventListener("click", () => {
      this.sound.playClickSound();
      const detailedText = document.getElementById("detailed-info-text");
      detailedText?.classList.toggle("hidden");
    });

    speedSelect?.addEventListener("change", (e) => {
      this.sound.playClickSound();
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

  private openQuizModal(): void {
    const modal = document.getElementById("quiz-modal");
    const closeBtn = document.getElementById("close-quiz");
    const qBox = document.getElementById("quiz-question-box");
    const rBox = document.getElementById("quiz-result-box");
    const restartBtn = document.getElementById("btn-restart-quiz");

    modal?.classList.remove("hidden");
    qBox?.classList.remove("hidden");
    rBox?.classList.add("hidden");

    this.quiz.reset();
    this.renderQuestion();

    if (closeBtn) {
      closeBtn.onclick = () => modal?.classList.add("hidden");
    }
    if (restartBtn) {
      restartBtn.onclick = () => {
        this.quiz.reset();
        qBox?.classList.remove("hidden");
        rBox?.classList.add("hidden");
        this.renderQuestion();
      };
    }
  }

  private renderQuestion(): void {
    const qText = document.getElementById("quiz-question-text");
    const optionsBox = document.getElementById("quiz-options");
    const feedbackText = document.getElementById("quiz-feedback");
    const nextBtn = document.getElementById("btn-next-question");

    if (!qText || !optionsBox) return;

    const q = this.quiz.currentQuestion;
    qText.textContent = `سؤال (${this.quiz.currentScore} نقطة): ${q.question}`;
    optionsBox.innerHTML = "";
    feedbackText?.classList.add("hidden");
    nextBtn?.classList.add("hidden");

    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.textContent = opt;
      btn.onclick = () => {
        const isCorrect = this.quiz.submitAnswer(idx);
        this.sound.playClickSound();

        Array.from(optionsBox.children).forEach((child) => {
          (child as HTMLButtonElement).disabled = true;
        });

        if (isCorrect) {
          btn.classList.add("correct");
          if (feedbackText) {
            feedbackText.textContent = `✅ إجابة صحيحة! ${q.explanation}`;
            feedbackText.style.color = "#4ade80";
            feedbackText.classList.remove("hidden");
          }
        } else {
          btn.classList.add("wrong");
          if (feedbackText) {
            feedbackText.textContent = `❌ إجابة خاطئة. ${q.explanation}`;
            feedbackText.style.color = "#f87171";
            feedbackText.classList.remove("hidden");
          }
        }

        nextBtn?.classList.remove("hidden");
      };
      optionsBox.appendChild(btn);
    });

    if (nextBtn) {
      nextBtn.onclick = () => {
        this.sound.playClickSound();
        const hasNext = this.quiz.nextQuestion();
        if (hasNext) {
          this.renderQuestion();
        } else {
          document.getElementById("quiz-question-box")?.classList.add("hidden");
          const rBox = document.getElementById("quiz-result-box");
          const finalScore = document.getElementById("quiz-final-score");
          if (finalScore) finalScore.textContent = `مجموع نقاطك النهائي: ${this.quiz.currentScore} من ${this.quiz.totalQuestions * 10}`;
          rBox?.classList.remove("hidden");
        }
      };
    }
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

    this.discoveries.discover(id);
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