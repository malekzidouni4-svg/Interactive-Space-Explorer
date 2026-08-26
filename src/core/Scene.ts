import * as THREE from "three";
import { Starfield } from "../environment/Starfield";
import { Lighting } from "../environment/Lighting";
import { Meteors } from "../environment/Meteors";
import { BlackHole } from "../environment/BlackHole";
import { Comet } from "../environment/Comet";
import { Nebula } from "../environment/Nebula";

export class Scene {
  readonly instance: THREE.Scene;
  readonly meteors: Meteors;
  readonly blackHole: BlackHole;
  readonly comet: Comet;

  constructor() {
    this.instance = new THREE.Scene();
    this.instance.background = new THREE.Color("#02030a");

    new Starfield(this.instance);
    new Lighting(this.instance);
    new Nebula(this.instance);
    this.meteors = new Meteors(this.instance);
    this.blackHole = new BlackHole(this.instance);
    this.comet = new Comet(this.instance);
  }
}