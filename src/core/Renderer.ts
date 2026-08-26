import * as THREE from "three";

export class Renderer {
  readonly instance: THREE.WebGLRenderer;

  constructor(container: HTMLElement) {
    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.15;

    container.appendChild(this.instance.domElement);
  }

  resize(width: number, height: number): void {
    this.instance.setSize(width, height, false);
  }

  render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.instance.render(scene, camera);
  }

  dispose(): void {
    this.instance.dispose();
  }
}