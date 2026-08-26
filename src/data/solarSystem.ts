import type { CelestialData } from "./types";

export const sun: CelestialData = {
  id: "sun",
  name: "Sun",
  type: "star",
  radius: 4,
  orbitRadius: 0,
  orbitalPeriod: Infinity,
  rotationPeriod: 25,
  rotationDirection: 1,
  axialTilt: 7.25,
  color: 0xffb52e,
  emissive: 0xff8a00,
  emissiveIntensity: 2.4,
};

export const planets: CelestialData[] = [
  { id: "mercury", name: "Mercury", type: "planet", radius: 0.55, orbitRadius: 7, orbitalPeriod: 8, rotationPeriod: 58.6, rotationDirection: 1, axialTilt: 0.034, color: 0xaaa29a },
  { id: "venus", name: "Venus", type: "planet", radius: 0.9, orbitRadius: 10, orbitalPeriod: 12, rotationPeriod: 243, rotationDirection: -1, axialTilt: 177.4, color: 0xd8b27b },
  { id: "earth", name: "Earth", type: "planet", radius: 1, orbitRadius: 14, orbitalPeriod: 16, rotationPeriod: 1, rotationDirection: 1, axialTilt: 23.44, color: 0x4d82c4 },
  { id: "mars", name: "Mars", type: "planet", radius: 0.78, orbitRadius: 18, orbitalPeriod: 20, rotationPeriod: 1.03, rotationDirection: 1, axialTilt: 25.19, color: 0xb64d2d },
  { id: "jupiter", name: "Jupiter", type: "planet", radius: 2.15, orbitRadius: 24, orbitalPeriod: 28, rotationPeriod: 0.41, rotationDirection: 1, axialTilt: 3.13, color: 0xc89b70 },
  { id: "saturn", name: "Saturn", type: "planet", radius: 1.9, orbitRadius: 32, orbitalPeriod: 36, rotationPeriod: 0.45, rotationDirection: 1, axialTilt: 26.73, color: 0xd4b27b },
  { id: "uranus", name: "Uranus", type: "planet", radius: 1.55, orbitRadius: 40, orbitalPeriod: 44, rotationPeriod: 0.72, rotationDirection: -1, axialTilt: 97.77, color: 0x7bc9d4 },
  { id: "neptune", name: "Neptune", type: "planet", radius: 1.5, orbitRadius: 48, orbitalPeriod: 52, rotationPeriod: 0.67, rotationDirection: 1, axialTilt: 28.32, color: 0x496fb2 },
];