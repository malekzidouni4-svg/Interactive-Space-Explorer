export type RotationDirection = 1 | -1;

export interface CelestialData {
  id: string;
  name: string;
  type: "star" | "planet";
  radius: number;
  orbitRadius: number;
  orbitalPeriod: number;
  rotationPeriod: number;
  rotationDirection: RotationDirection;
  axialTilt: number;
  color: number;
  emissive?: number;
  emissiveIntensity?: number;
}