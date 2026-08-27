const DATA_URLS = {
  countries: "/data/latam-countries.json",
  admin1: "/data/colombia-departments.json"
};
function numeric(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replaceAll(",", ""));
  return Number.isFinite(n) ? n : null;
}
function featureCollection(input) {
  if (!input) return { type: "FeatureCollection", features: [] };
  if (input.type === "FeatureCollection") return input;
  if (Array.isArray(input)) {
    return {
      type: "FeatureCollection",
      features: input.map(x => x.type === "Feature" ? x : ({
        type: "Feature",
        properties: x.properties || x,
        geometry: x.geometry || null
      }))
    };
  }
  if (input.type === "Feature") {
    return { type: "FeatureCollection", features: [input] };
  }
  return { type: "FeatureCollection", features: [] };
}
export async function loadDataset(name) {
  const response = await fetch(DATA_URLS[name]);
  if (!response.ok) throw new Error(`Dataset request failed: ${response.status}`);
  return featureCollection(await response.json());
}
export function normalizeProperties(fc) {
  return {
    ...fc,
    features: fc.features.map((f) => {
      const p = { ...(f.properties || {}) };
      const population =
        numeric(p.population) ??
        numeric(p.Population) ??
        numeric(p.poblacion) ??
        numeric(p.POP);
      const area =
        numeric(p.area_km2) ??
        numeric(p.area) ??
        numeric(p.Area);
      const gdp =
        numeric(p.gdp) ??
        numeric(p.GDP) ??
        numeric(p.pib) ??
        numeric(p.PIB);
      const densitySource =
        numeric(p.population_density) ??
        numeric(p.populationDensity) ??
        numeric(p.density);
      const gdpPcSource =
        numeric(p.gdp_per_capita) ??
        numeric(p.gdpPerCapita) ??
        numeric(p.pib_per_capita);
      const density =
        densitySource ??
        (population !== null && area !== null && area > 0 ? population / area : null);
      const gdpPc =
        gdpPcSource ??
        (gdp !== null && population !== null && population > 0 ? gdp / population : null);
      return {
        ...f,
        properties: {
          ...p,
          __population: population,
          __areaKm2: area,
          __gdp: gdp,
          __density: density,
          __gdpPerCapita: gdpPc
        }
      };
    })
  };
}
export function datasetMetadata(name) {
  return {
    id: name,
    provider: "Existing project source",
    version: "1",
    temporalCoverage: "Source-defined",
    spatialCoverage: name === "countries" ? "Latin America" : "Colombia",
    resolution: "Vector boundary dataset",
    crs: "Source-defined; MapLibre displays in Web Mercator",
    license: "Verify against original provider",
    methodology: "Source dataset; no fabricated values",
    quality: "Not scored until validation metadata is available"
  };
}
