import { bufferFeature, calculateStatistics, centroid } from "../../services/gisService";
import { calculateDSI } from "../../services/suitabilityService";
import { kMeans } from "../../services/mlService";
export const AI_TOOLS = {
  search_dataset: {
    description: "Search indexed datasets.",
    execute: async ({ query, datasets }) =>
      datasets.filter(d => d.id.toLowerCase().includes(String(query).toLowerCase()))
  },
  query_features: {
    description: "Query loaded feature collections.",
    execute: async ({ dataset, predicate }) =>
      dataset.features.filter(predicate)
  },
  calculate_statistics: {
    description: "Calculate descriptive statistics.",
    execute: async ({ values }) => calculateStatistics(values)
  },
  buffer: {
    description: "Create a geodesic buffer around a feature.",
    execute: async ({ feature, distanceKm }) => bufferFeature(feature, distanceKm)
  },
  centroid: {
    description: "Calculate feature centroid.",
    execute: async ({ feature }) => centroid(feature)
  },
  run_dsi: {
    description: "Run deterministic Development Suitability Index.",
    execute: async ({ features, config }) => calculateDSI(features, config)
  },
  run_ml: {
    description: "Run deterministic K-Means clustering.",
    execute: async ({ features, fields, k }) => kMeans(features, fields, k)
  }
};
export async function invokeTool(name, args) {
  const tool = AI_TOOLS[name];
  if (!tool) throw new Error(`Unknown AI tool: ${name}`);
  return tool.execute(args);
}
