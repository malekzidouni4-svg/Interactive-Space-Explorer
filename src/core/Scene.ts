import * as THREE from "three";
import { Lighting } from "../environment/Lighting";

export class Scene {
  readonly instance: THREE.Scene;
  constructor() { this.instance = new THREE.Scene(); this.instance.background = new THREE.Color("#05070d"); new Lighting(this.instance); }
}
