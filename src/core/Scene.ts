import * as THREE from "three";
import { Starfield } from "../environment/Starfield";
import { Lighting } from "../environment/Lighting";
import { Meteors } from "../environment/Meteors";
import { BlackHole } from "../environment/BlackHole";

export class Scene {
  readonly instance: THREE.Scene;
  readonly meteors: Meteors;
  readonly blackHole: BlackHole;

  constructor() {
    this.instance = new THREE.Scene();
    this.instance.background = new THREE.Color("#02030a");

    new Starfield(this.instance);
    new Lighting(this.instance);
    this.meteors = new Meteors(this.instance);
    this.blackHole = new BlackHole(this.instance);
  }
}