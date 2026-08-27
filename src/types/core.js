export const LAYER_TYPES = {
  ANALYTICAL: "analytical",
  OPERATIONAL: "operational",
  REFERENCE: "reference",
  USER: "user",
  AI_RESULT: "ai-result",
  TEMPORARY: "temporary"
};
export const ANALYSIS_TYPES = {
  VECTOR: "vector",
  RASTER: "raster",
  STATISTICS: "statistics",
  NETWORK: "network",
  SUITABILITY: "suitability",
  ML: "ml",
  TEMPORAL: "temporal",
  AI: "ai"
};
export const ROUTES = {
  HOME: "/",
  MAP: "/map",
  DATA: "/data",
  DATASET: "/data/:id",
  ANALYSIS: "/analysis",
  WORKFLOWS: "/workflows",
  AI: "/ai",
  PROJECTS: "/projects",
  DASHBOARDS: "/dashboards",
  REPORTS: "/reports",
  COMPARE: "/compare",
  EXPLORE: "/explore",
  PROFILE: "/profile",
  TEAM: "/team",
  SETTINGS: "/settings",
  MONITORING: "/monitoring",
  REMOTE_SENSING: "/remote-sensing",
  DEVELOPER: "/developer"
};
export const LAYERS = {
  COUNTRIES: "reference.countries",
  ADMIN1: "reference.admin1",
  CITIES: "reference.cities",
  POPULATION_DENSITY: "analysis.population-density",
  GDP_PER_CAPITA: "analysis.gdp-per-capita",
  DSI: "analysis.dsi",
  ML_CLUSTERS: "analysis.ml-clusters",
  RIVERS: "reference.rivers",
  ROADS: "reference.roads"
};
export const DATASETS = {
  LATAM_COUNTRIES: "latam-countries",
  COLOMBIA_ADMIN1: "colombia-admin1"
};
export const DSI_VERSION = "dsi-v1-deterministic";
