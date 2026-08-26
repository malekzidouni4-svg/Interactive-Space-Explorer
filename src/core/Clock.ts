import * as THREE from "three";

export class Clock {
  private readonly clock = new THREE.Clock();

  getDelta(): number {
    return Math.min(this.clock.getDelta(), 0.05);
  }

  getElapsedTime(): number {
    return this.clock.getElapsedTime();
  }
}