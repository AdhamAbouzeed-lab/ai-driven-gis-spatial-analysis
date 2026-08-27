import { LAYERS, LAYER_TYPES } from "../types/core";
export const layerRegistry = [
  {
    id: LAYERS.COUNTRIES,
    name: "Countries",
    description: "Latin America country reference boundaries.",
    category: "Reference",
    type: LAYER_TYPES.REFERENCE,
    dataset: "latam-countries",
    version: "1",
    source: "Existing project dataset",
    minZoom: 0,
    maxZoom: 8,
    style: "boundary"
  },
  {
    id: LAYERS.ADMIN1,
    name: "Administrative Level 1",
    description: "Country subdivisions where source data is available.",
    category: "Reference",
    type: LAYER_TYPES.REFERENCE,
    dataset: "colombia-admin1",
    version: "1",
    source: "Existing project dataset",
    minZoom: 3,
    maxZoom: 14,
    style: "boundary"
  },
  {
    id: LAYERS.POPULATION_DENSITY,
    name: "Population Density",
    description: "Population divided by area where both source attributes are available.",
    category: "Analytical",
    type: LAYER_TYPES.ANALYTICAL,
    dataset: "latam-countries",
    version: "1",
    source: "Existing project socioeconomic attributes",
    legend: "people/km²"
  },
  {
    id: LAYERS.GDP_PER_CAPITA,
    name: "GDP per Capita",
    description: "GDP divided by population or verified source GDP-per-capita field.",
    category: "Analytical",
    type: LAYER_TYPES.ANALYTICAL,
    dataset: "latam-countries",
    version: "1",
    source: "Existing project socioeconomic attributes",
    legend: "currency/person"
  },
  {
    id: LAYERS.DSI,
    name: "Development Suitability Index",
    description: "Deterministic weighted suitability model based only on available source variables.",
    category: "Analytical",
    type: LAYER_TYPES.ANALYTICAL,
    dataset: "available project attributes",
    version: "dsi-v1-deterministic",
    source: "ADHAM GIS AI methodology",
    legend: "0-100"
  },
  {
    id: LAYERS.ML_CLUSTERS,
    name: "ML Clusters",
    description: "Deterministic K-Means clustering over available numeric socioeconomic features.",
    category: "Analytical",
    type: LAYER_TYPES.ANALYTICAL,
    dataset: "available project attributes",
    version: "kmeans-v1",
    source: "ADHAM GIS AI ML pipeline"
  },
  {
    id: LAYERS.CITIES,
    name: "Cities",
    description: "Reference city layer when source data is available.",
    category: "Reference",
    type: LAYER_TYPES.REFERENCE,
    dataset: "city-source",
    version: "1",
    source: "External/source-backed data required"
  },
  {
    id: LAYERS.RIVERS,
    name: "Rivers",
    description: "Hydrographic reference layer.",
    category: "Reference",
    type: LAYER_TYPES.REFERENCE,
    dataset: "hydrography-source",
    version: "1",
    source: "External/source-backed data required"
  },
  {
    id: LAYERS.ROADS,
    name: "Roads",
    description: "Transportation network reference layer.",
    category: "Operational",
    type: LAYER_TYPES.OPERATIONAL,
    dataset: "transport-source",
    version: "1",
    source: "External/source-backed data required"
  }
];
export function getLayer(id) {
  return layerRegistry.find(x => x.id === id);
}
