import { DSI_VERSION } from "../types/core";
function finite(v) {
  return Number.isFinite(Number(v)) ? Number(v) : null;
}
function normalize(values, value) {
  const clean = values.filter(Number.isFinite);
  const v = finite(value);
  if (v === null || clean.length < 2) return null;
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  if (max === min) return 50;
  return ((v - min) / (max - min)) * 100;
}
export function calculateDSI(features, config = {}) {
  const weights = {
    population: config.population ?? 0.15,
    gdpPerCapita: config.gdpPerCapita ?? 0.25,
    accessibility: config.accessibility ?? 0.20,
    infrastructure: config.infrastructure ?? 0.15,
    environment: config.environment ?? 0.10,
    risk: config.risk ?? 0.15
  };
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) {
    throw new Error("DSI weights must sum to a positive value.");
  }
  const rows = features.map(f => {
    const p = f.properties || {};
    return {
      population: finite(p.__population),
      gdpPerCapita: finite(p.__gdpPerCapita),
      accessibility: finite(p.accessibility),
      infrastructure: finite(p.infrastructure),
      environment: finite(p.environment),
      risk: finite(p.risk)
    };
  });
  const fields = Object.keys(weights);
  const ranges = Object.fromEntries(
    fields.map(field => [
      field,
      rows.map(r => r[field]).filter(Number.isFinite)
    ])
  );
  return features.map((f, i) => {
    const row = rows[i];
    let weighted = 0;
    let availableWeight = 0;
    const contributions = {};
    for (const field of fields) {
      const n = normalize(ranges[field], row[field]);
      if (n === null) continue;
      const direction = field === "risk" ? -1 : 1;
      const contribution = n * weights[field] * direction;
      weighted += contribution;
      availableWeight += weights[field];
      contributions[field] = contribution;
    }
    const score = availableWeight > 0
      ? Math.max(0, Math.min(100, (weighted / availableWeight)))
      : null;
    return {
      ...f,
      properties: {
        ...f.properties,
        __dsi: score,
        __dsiVersion: DSI_VERSION,
        __dsiContributions: contributions,
        __dsiMethod: "Min-max normalization + configurable weighted overlay",
        __dsiInputs: fields.filter(k => Number.isFinite(row[k])),
        __dsiLimitations: availableWeight < totalWeight
          ? "Some configured factors were unavailable in the source dataset."
          : "Score is a suitability index, not a causal prediction."
      }
    };
  });
}
export function explainDSI(feature) {
  const p = feature.properties || {};
  return {
    score: p.__dsi ?? null,
    version: p.__dsiVersion ?? null,
    method: p.__dsiMethod ?? null,
    inputs: p.__dsiInputs ?? [],
    contributions: p.__dsiContributions ?? {},
    limitations: p.__dsiLimitations ?? null
  };
}
