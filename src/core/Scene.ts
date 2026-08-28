import * as THREE from "three";
import { Starfield } from "../environment/Starfield";
import { Lighting } from "../environment/Lighting";
import { Meteors } from "../environment/Meteors";
import { BlackHole } from "../environment/BlackHole";
import { Comet } from "../environment/Comet";
import { Nebula } from "../environment/Nebula";
import { Galaxy } from "../environment/Galaxy";

export class Scene {
  readonly instance: THREE.Scene;
  readonly meteors: Meteors;
  readonly blackHole: BlackHole;
  readonly comet: Comet;
  readonly galaxy1: Galaxy;
  readonly galaxy2: Galaxy;

  constructor() {
    this.instance = new THREE.Scene();
    this.instance.background = new THREE.Color("#02030d");

    // Atmospheric space fog
    this.instance.fog = new THREE.FogExp2(0x02030d, 0.00025);

    new Starfield(this.instance);
    new Lighting(this.instance);
    new Nebula(this.instance);

    this.meteors = new Meteors(this.instance);
    this.blackHole = new BlackHole(this.instance);
    this.comet = new Comet(this.instance);

    // Deep space galaxies
    this.galaxy1 = new Galaxy(this.instance, {
      position: new THREE.Vector3(750, 300, -900),
      radius: 200,
      colorInside: 0xffa500,
      colorOutside: 0x3b82f6,
    });

    this.galaxy2 = new Galaxy(this.instance, {
      position: new THREE.Vector3(-800, -200, -1000),
      radius: 160,
      colorInside: 0xec4899,
      colorOutside: 0x8b5cf6,
    });
  }
}
