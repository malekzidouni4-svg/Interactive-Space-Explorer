import * as THREE from "three";
import { Starfield } from "../environment/Starfield";
import { Lighting } from "../environment/Lighting";

export class Scene {
  readonly instance: THREE.Scene;

  constructor() {
    this.instance = new THREE.Scene();
    this.instance.background = new THREE.Color("#02030a");

    new Starfield(this.instance);
    new Lighting(this.instance);
  }
}