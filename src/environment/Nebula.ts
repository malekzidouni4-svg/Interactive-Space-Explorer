import * as THREE from "three";

export class Nebula {
  private group: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();

    // Create procedural nebula texture
    const texture = this.createNebulaTexture();

    // Color palettes for different nebula clouds in deep space
    const palettes = [
      { color: new THREE.Color(0x8b5cf6), pos: new THREE.Vector3(-450, 120, -550), scale: 350 }, // Purple/Violet
      { color: new THREE.Color(0xec4899), pos: new THREE.Vector3(500, -80, -600), scale: 400 },  // Pink/Magenta
      { color: new THREE.Color(0x06b6d4), pos: new THREE.Vector3(-300, -180, -500), scale: 300 }, // Cyan/Teal
      { color: new THREE.Color(0x3b82f6), pos: new THREE.Vector3(400, 200, -700), scale: 450 },  // Deep Blue
      { color: new THREE.Color(0xf59e0b), pos: new THREE.Vector3(0, -250, -650), scale: 320 },   // Amber/Gold
    ];

    palettes.forEach((cloud) => {
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        color: cloud.color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      // Create a main cloud cluster with sub-sprites
      for (let i = 0; i < 8; i++) {
        const sprite = new THREE.Sprite(spriteMat);
        const offsetX = (Math.random() - 0.5) * cloud.scale * 0.6;
        const offsetY = (Math.random() - 0.5) * cloud.scale * 0.6;
        const offsetZ = (Math.random() - 0.5) * cloud.scale * 0.6;

        sprite.position.set(
          cloud.pos.x + offsetX,
          cloud.pos.y + offsetY,
          cloud.pos.z + offsetZ
        );

        const s = cloud.scale * (0.6 + Math.random() * 0.8);
        sprite.scale.set(s, s, 1);
        this.group.add(sprite);
      }
    });

    scene.add(this.group);
  }

  private createNebulaTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.15)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
}
