export type CelestialType = "star" | "planet" | "moon" | "spacecraft" | "black-hole";
export type RotationDirection = 1 | -1;

export interface ScientificData {
  typeLabel: string;
  diameter: string;
  mass: string;
  gravity: string;
  temperature: string;
  day: string;
  year: string;
  distance: string;
  moons: number;
  atmosphere: string;
  fact: string;
  source: string;
}

export interface VisualData {
  radius: number;
  color: number;
  emissive?: number;
  emissiveIntensity?: number;
  orbitRadius: number;
  orbitalPeriod: number;
  rotationPeriod: number;
  rotationDirection: RotationDirection;
  axialTilt: number;
}

export interface CelestialData {
  id: string;
  name: string;
  type: CelestialType;
  parent?: string;
  scientific: ScientificData;
  visual: VisualData;
}

export interface SelectionEvent { id: string | null; }
export type CelestialObject = CelestialData;

export const TYPE_LABELS: Record<CelestialType, string> = {
  star: "Star", planet: "Planet", moon: "Moon", spacecraft: "Spacecraft", "black-hole": "Black hole",
};

export const formatType = (type: CelestialType): string => TYPE_LABELS[type];

export const solarSystemData: CelestialData[] = [
  { id: "sun", name: "Sun", type: "star", scientific: { typeLabel: "G-type main-sequence star", diameter: "1,392,700 km", mass: "1.989 × 10³⁰ kg", gravity: "274 m/s²", temperature: "5,500°C surface", day: "25 days", year: "—", distance: "149.6 million km from Earth", moons: 0, atmosphere: "Hydrogen, helium", fact: "Sunlight takes about 8 minutes 20 seconds to reach Earth.", source: "NASA Solar System Exploration" }, visual: { radius: 4.2, color: 0xffb52e, emissive: 0xff8a00, emissiveIntensity: 2.4, orbitRadius: 0, orbitalPeriod: Infinity, rotationPeriod: 25, rotationDirection: 1, axialTilt: 7.25 } },
  { id: "mercury", name: "Mercury", type: "planet", scientific: { typeLabel: "Terrestrial planet", diameter: "4,879 km", mass: "3.301 × 10²³ kg", gravity: "3.7 m/s²", temperature: "167°C average", day: "58.6 days", year: "88 days", distance: "57.9 million km", moons: 0, atmosphere: "Exosphere", fact: "Mercury has the shortest year of any planet.", source: "NASA Planetary Fact Sheet" }, visual: { radius: .55, color: 0xaaa29a, orbitRadius: 7, orbitalPeriod: 22, rotationPeriod: 58.6, rotationDirection: 1, axialTilt: .034 } },
  { id: "venus", name: "Venus", type: "planet", scientific: { typeLabel: "Terrestrial planet", diameter: "12,104 km", mass: "4.867 × 10²⁴ kg", gravity: "8.87 m/s²", temperature: "464°C average", day: "243 days", year: "224.7 days", distance: "108.2 million km", moons: 0, atmosphere: "Carbon dioxide, nitrogen", fact: "Venus rotates in the opposite direction to most planets.", source: "NASA Planetary Fact Sheet" }, visual: { radius: .9, color: 0xd8b27b, orbitRadius: 10, orbitalPeriod: 30, rotationPeriod: 243, rotationDirection: -1, axialTilt: 177.4 } },
  { id: "earth", name: "Earth", type: "planet", scientific: { typeLabel: "Terrestrial planet", diameter: "12,742 km", mass: "5.972 × 10²⁴ kg", gravity: "9.81 m/s²", temperature: "14°C average", day: "23h 56m", year: "365.25 days", distance: "149.6 million km", moons: 1, atmosphere: "Nitrogen, oxygen", fact: "Earth is the only astronomical object known to harbor life.", source: "NASA Planetary Fact Sheet" }, visual: { radius: 1, color: 0x3977c2, orbitRadius: 14, orbitalPeriod: 40, rotationPeriod: 1, rotationDirection: 1, axialTilt: 23.44 } },
  { id: "moon", name: "Moon", type: "moon", parent: "earth", scientific: { typeLabel: "Natural satellite", diameter: "3,475 km", mass: "7.342 × 10²² kg", gravity: "1.62 m/s²", temperature: "-20°C average", day: "27.3 days", year: "27.3 days", distance: "384,400 km from Earth", moons: 0, atmosphere: "Trace exosphere", fact: "The Moon is moving away from Earth by about 3.8 cm each year.", source: "NASA Moon Facts" }, visual: { radius: .28, color: 0xb9bdc7, orbitRadius: 1.8, orbitalPeriod: 5, rotationPeriod: 27.3, rotationDirection: 1, axialTilt: 6.68 } },
  { id: "mars", name: "Mars", type: "planet", scientific: { typeLabel: "Terrestrial planet", diameter: "6,779 km", mass: "6.39 × 10²³ kg", gravity: "3.71 m/s²", temperature: "-63°C average", day: "24h 37m", year: "687 days", distance: "227.9 million km", moons: 2, atmosphere: "Carbon dioxide", fact: "Mars hosts Olympus Mons, the tallest volcano in the solar system.", source: "NASA Planetary Fact Sheet" }, visual: { radius: .78, color: 0xb64d2d, orbitRadius: 18, orbitalPeriod: 50, rotationPeriod: 1.03, rotationDirection: 1, axialTilt: 25.19 } },
  { id: "jupiter", name: "Jupiter", type: "planet", scientific: { typeLabel: "Gas giant", diameter: "139,820 km", mass: "1.898 × 10²⁷ kg", gravity: "24.79 m/s²", temperature: "-110°C average", day: "9h 56m", year: "11.86 years", distance: "778.5 million km", moons: 95, atmosphere: "Hydrogen, helium", fact: "Jupiter's Great Red Spot is a storm larger than Earth.", source: "NASA Planetary Fact Sheet" }, visual: { radius: 2.15, color: 0xc89b70, orbitRadius: 24, orbitalPeriod: 70, rotationPeriod: .41, rotationDirection: 1, axialTilt: 3.13 } },
  { id: "saturn", name: "Saturn", type: "planet", scientific: { typeLabel: "Gas giant", diameter: "116,460 km", mass: "5.683 × 10²⁶ kg", gravity: "10.44 m/s²", temperature: "-140°C average", day: "10h 42m", year: "29.45 years", distance: "1.43 billion km", moons: 146, atmosphere: "Hydrogen, helium", fact: "Saturn's rings are mostly chunks of water ice.", source: "NASA Planetary Fact Sheet" }, visual: { radius: 1.9, color: 0xd4b27b, orbitRadius: 32, orbitalPeriod: 90, rotationPeriod: .45, rotationDirection: 1, axialTilt: 26.73 } },
  { id: "uranus", name: "Uranus", type: "planet", scientific: { typeLabel: "Ice giant", diameter: "50,724 km", mass: "8.681 × 10²⁵ kg", gravity: "8.69 m/s²", temperature: "-195°C average", day: "17h 14m", year: "84 years", distance: "2.87 billion km", moons: 28, atmosphere: "Hydrogen, helium, methane", fact: "Uranus rotates on its side with an axial tilt of 97.8°.", source: "NASA Planetary Fact Sheet" }, visual: { radius: 1.55, color: 0x7bc9d4, orbitRadius: 40, orbitalPeriod: 110, rotationPeriod: .72, rotationDirection: -1, axialTilt: 97.77 } },
  { id: "neptune", name: "Neptune", type: "planet", scientific: { typeLabel: "Ice giant", diameter: "49,244 km", mass: "1.024 × 10²⁶ kg", gravity: "11.15 m/s²", temperature: "-200°C average", day: "16h 6m", year: "164.8 years", distance: "4.50 billion km", moons: 16, atmosphere: "Hydrogen, helium, methane", fact: "Neptune has the fastest winds in the solar system.", source: "NASA Planetary Fact Sheet" }, visual: { radius: 1.5, color: 0x496fb2, orbitRadius: 48, orbitalPeriod: 135, rotationPeriod: .67, rotationDirection: 1, axialTilt: 28.32 } },
  { id: "iss", name: "ISS", type: "spacecraft", parent: "earth", scientific: { typeLabel: "Orbital laboratory", diameter: "109 m span", mass: "420,000 kg", gravity: "Microgravity", temperature: "Controlled habitat", day: "90 min orbit", year: "—", distance: "~400 km above Earth", moons: 0, atmosphere: "Pressurized module", fact: "The International Space Station sees 16 sunrises every day.", source: "NASA International Space Station" }, visual: { radius: .42, color: 0xdde8f0, orbitRadius: 2.4, orbitalPeriod: 3.2, rotationPeriod: 4, rotationDirection: 1, axialTilt: 0 } },
];

export const findCelestial = (id: string) => solarSystemData.find((item) => item.id === id);
export const planets = solarSystemData.filter((item) => item.type === "planet");
export const moons = solarSystemData.filter((item) => item.type === "moon");
export const sun = solarSystemData[0];
// Sources: NASA Solar System Exploration, NASA Planetary Fact Sheet, NASA Moon Facts, NASA ISS overview.

export const searchable = solarSystemData;

export const createDataIndex = () => new Map(solarSystemData.map((item) => [item.id, item]));

export const scientificScaleNote = "Exploration Scale uses visual radii and orbital distances designed for legibility; scientific values remain in the data layer.";

export const normalizeQuery = (query: string) => query.trim().toLowerCase();

export const searchCelestial = (query: string) => { const normalized = normalizeQuery(query); return searchable.filter((item) => item.name.toLowerCase().includes(normalized) || item.type.includes(normalized)); };

export const isPlanet = (item: CelestialData) => item.type === "planet";

export const isSelectable = (item: CelestialData) => item.type !== "black-hole";

export const celestialCount = solarSystemData.length;

export const defaultTimeScale = 0.1;

export const timeScales = [0.1, 0.5, 1, 5, 10, 100] as const;

export type TimeScale = (typeof timeScales)[number];

export const getChildren = (parentId: string) => solarSystemData.filter((item) => item.parent === parentId);

export const getPrimaryBodies = () => solarSystemData.filter((item) => !item.parent && item.type !== "spacecraft");

export const getSourceLabel = (item: CelestialData) => item.scientific.source;

export const getObjectLabel = (item: CelestialData) => `${item.name} · ${item.scientific.typeLabel}`;

export const hasAtmosphere = (item: CelestialData) => item.scientific.atmosphere !== "—";

export const allIds = solarSystemData.map((item) => item.id);

export const getDataOrThrow = (id: string) => { const item = findCelestial(id); if (!item) throw new Error(`Unknown celestial object: ${id}`); return item; };

export const objectTypes = ["star", "planet", "moon", "spacecraft", "black-hole"] as const;

export const isKnownType = (type: string): type is CelestialData["type"] => objectTypes.includes(type as CelestialData["type"]);

export const dataVersion = "NASA-curated-2026.08";

export const exploreMode = "exploration" as const;

export const supportedModes = ["exploration", "scientific"] as const;

export type ScaleMode = (typeof supportedModes)[number];

export const defaultScaleMode: ScaleMode = exploreMode;

export const getDisplayName = (id: string) => findCelestial(id)?.name ?? id;

export const getTypeLabel = (id: string) => findCelestial(id)?.scientific.typeLabel ?? "Celestial object";

export const getFact = (id: string) => findCelestial(id)?.scientific.fact ?? "No fact available.";

export const getSource = (id: string) => findCelestial(id)?.scientific.source ?? "Source pending.";

export const getOrbitRadius = (id: string) => findCelestial(id)?.visual.orbitRadius ?? 0;

export const getRadius = (id: string) => findCelestial(id)?.visual.radius ?? 0;

export const getAllData = () => solarSystemData;

export const getDataByType = (type: CelestialData["type"]) => solarSystemData.filter((item) => item.type === type);

export const systemName = "Interactive Space Explorer";

export const systemSubtitle = "A quiet, living map of our solar neighborhood.";

export const dataAttribution = "Data values are sourced from NASA public fact sheets.";

export const version = 1;

export const schemaName = "CelestialObject";

export const categoryOrder = ["star", "planet", "moon", "spacecraft"] as const;

export const getCategoryOrder = () => categoryOrder;

export const isRoot = (item: CelestialData) => !item.parent;

export const rootBodies = solarSystemData.filter(isRoot);

export const dataReady = true;

export const earth = findCelestial("earth")!;

export const moon = findCelestial("moon")!;

export const iss = findCelestial("iss")!;

export const sunData = sun;

export const planetCount = planets.length;

export const moonCount = moons.length;

export const isValidId = (id: string) => allIds.includes(id);

export const sourceLinks = { nasa: "https://science.nasa.gov/solar-system/", factSheet: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/" };

export const exploreCopy = { eyebrow: "INTERACTIVE SPACE EXPLORER", title: "Explore the solar system", hint: "Drag to orbit · Scroll to travel · Select a world to focus" };

export const uiAccent = "amber" as const;

export const maxSearchResults = 6;

export const defaultSelectedId = "earth";

export const keyboardShortcuts = { escape: "Back to system", slash: "Search" };

export const objectTypeOrder = categoryOrder;

export const emptySearchMessage = "No celestial objects found.";

export const dataPolicy = "Scientific data is kept separate from visual rendering values.";

export const schemaFields = ["id", "name", "type", "scientific", "visual", "parent"] as const;

export const scaleModes = { exploration: "Readable distances", scientific: "Relative distances" } as const;

export const motionDescription = "Orbital motion is intentionally slowed for calm observation.";

export const defaultCameraDistance = 62;

export const maxCameraDistance = 140;

export const minCameraDistance = 6;

export const maxPixelRatio = 1.6;

export const asteroidCount = 900;

export const meteorCount = 1;

export const galaxyCount = 12;

export const blackHoleDistance = 180;

export const getByName = (name: string) => solarSystemData.find((item) => item.name.toLowerCase() === name.toLowerCase());

export const dataIntegrity = solarSystemData.every((item) => Boolean(item.id && item.name && item.scientific.source));

export const primaryPlanetIds = planets.map((item) => item.id);

export const educationalLayers = ["basic", "details"] as const;

export const panelWidth = 360;

export const hasParent = (item: CelestialData) => Boolean(item.parent);

export const getParent = (item: CelestialData) => item.parent ? findCelestial(item.parent) : undefined;

export const dataSourceDate = "2026";

export const getMoonForEarth = () => moon;

export const getIss = () => iss;

export const getSun = () => sun;

export const getPlanets = () => planets;

export const getMoons = () => moons;

export const getSearchable = () => searchable;

export const getDefaultTimeScale = () => defaultTimeScale;

export const getTimeScales = () => timeScales;

export const getDefaultSelectedId = () => defaultSelectedId;

export const getSystemSubtitle = () => systemSubtitle;

export const getSystemName = () => systemName;

export const getExploreCopy = () => exploreCopy;

export const getScaleModes = () => scaleModes;

export const getMotionDescription = () => motionDescription;

export const getDataPolicy = () => dataPolicy;

export const getDataVersion = () => dataVersion;

export const getSourceLinks = () => sourceLinks;

export const getSchemaFields = () => schemaFields;

export const getEducationalLayers = () => educationalLayers;

export const getPanelWidth = () => panelWidth;

export const getDefaults = () => ({ defaultTimeScale, defaultSelectedId, defaultScaleMode });

export const getConstants = () => ({ asteroidCount, meteorCount, galaxyCount, blackHoleDistance, maxPixelRatio });

export const getCounts = () => ({ celestialCount, planetCount, moonCount });

export const getRootBodies = () => rootBodies;

export const getCategoryLabels = () => TYPE_LABELS;

export const getObjectTypes = () => objectTypes;

export const getAttribution = () => dataAttribution;

export const getVersion = () => version;

export const getSchemaName = () => schemaName;

export const getUiAccent = () => uiAccent;

export const getKeyboardShortcuts = () => keyboardShortcuts;

export const getScaleModeLabels = () => scaleModes;

export const getSystem = () => solarSystemData;

export const getSources = () => sourceLinks;

export const getIntegrity = () => dataIntegrity;

export const getDate = () => dataSourceDate;

export const getRoot = () => rootBodies;

export const getChildrenOf = getChildren;

export const getParentOf = getParent;

export const getPrimary = getPrimaryBodies;

export const getPlanetIds = () => primaryPlanetIds;

export const getFactFor = getFact;

export const getSourceFor = getSource;

export const getLabelFor = getObjectLabel;

export const getNameFor = getDisplayName;

export const getTypeFor = getTypeLabel;

export const isDataReady = () => dataReady;

export const getMode = () => exploreMode;

export const getModes = () => supportedModes;

export const isRootBody = isRoot;

export const isChildBody = hasParent;

export const isSelectableObject = isSelectable;

export const isPlanetObject = isPlanet;

export const getData = getDataOrThrow;

export const lookup = findCelestial;

export const search = searchCelestial;

export const types = objectTypes;

export const categories = categoryOrder;

export const constants = { defaultTimeScale, defaultSelectedId, maxSearchResults, panelWidth };

export const metadata = { systemName, systemSubtitle, dataVersion, dataSourceDate };

export const attribution = dataAttribution;

export const solarSystem = solarSystemData;

export const allObjects = solarSystemData;

export const data = solarSystemData;

export const objects = solarSystemData;

export const celestialObjects = solarSystemData;

export const planetsData = planets;

export const moonsData = moons;

export const starData = sun;

export const spacecraftData = iss;

export const source = sourceLinks.nasa;

export const facts = solarSystemData.reduce<Record<string, string>>((acc, item) => { acc[item.id] = item.scientific.fact; return acc; }, {});

export const typeLabels = TYPE_LABELS;

export const solarSystemCount = solarSystemData.length;

export const isScientific = (mode: ScaleMode) => mode === "scientific";

export const isExploration = (mode: ScaleMode) => mode === "exploration";

export const validTimeScale = (value: number): value is TimeScale => timeScales.includes(value as TimeScale);

export const clampTimeScale = (value: number): TimeScale => timeScales.reduce((closest, current) => Math.abs(current - value) < Math.abs(closest - value) ? current : closest, defaultTimeScale);

export const dataNamespace = "interactive-space-explorer";

export const dataDescription = "Typed solar system data for the rendering and education layers.";

export const getDescription = () => dataDescription;

export const getNamespace = () => dataNamespace;

export const getSystemData = () => data;

export const getAllObjects = () => allObjects;

export const getCelestialObjects = () => celestialObjects;

export const getPlanetsData = () => planetsData;

export const getMoonsData = () => moonsData;

export const getStarData = () => starData;

export const getSpacecraftData = () => spacecraftData;

export const getFacts = () => facts;

export const getTypeLabels = () => typeLabels;

export const getSolarSystemCount = () => solarSystemCount;

export const getSourceText = getSourceFor;

export const getFactText = getFactFor;

export const getScientificData = (id: string) => lookup(id)?.scientific;

export const getVisualData = (id: string) => lookup(id)?.visual;

export const getHierarchy = () => solarSystemData.map((item) => ({ id: item.id, parent: item.parent ?? null }));

export const getPlanetarySystem = () => planets.map((planet) => ({ planet, moons: getChildren(planet.id) }));

export const getObjectCount = () => solarSystemData.length;

export const usesRealValues = () => true;

export const isCurated = () => true;

export const finalExport = true;

export default solarSystemData;
