export type RotationDirection = 1 | -1;

export type CelestialObjectType = "star" | "planet" | "moon" | "spacecraft" | "blackhole";

export interface CelestialData {
  id: string;
  name: string;
  type: CelestialObjectType;
  radius: number;
  orbitRadius: number;
  orbitalPeriod: number;
  rotationPeriod: number;
  rotationDirection: RotationDirection;
  axialTilt: number;
  color: number;
  emissive?: number;
  emissiveIntensity?: number;
  description?: string;
  distanceFromSun?: string;
  mass?: string;
  gravity?: string;
  diameter?: string;
  temperature?: string;
  composition?: string;
  moonsCount?: number;
  hasRings?: boolean;
  parentBodyId?: string;
  didYouKnow?: string;
  detailedInfo?: string;
}