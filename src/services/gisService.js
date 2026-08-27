import * as turf from "@turf/turf";
export function safeGeometry(feature) {
  return feature?.geometry?.type &&
    ["Polygon", "MultiPolygon", "LineString", "MultiLineString", "Point", "MultiPoint"].includes(feature.geometry.type);
}
export function bufferFeature(feature, distanceKm) {
  if (!safeGeometry(feature)) throw new Error("Selected feature has no supported geometry.");
  return turf.buffer(feature, Number(distanceKm), { units: "kilometers" });
}
export function centroid(feature) {
  return turf.centroid(feature);
}
export function areaKm2(feature) {
  return turf.area(feature) / 1_000_000;
}
export function distanceKm(a, b) {
  return turf.distance(a, b, { units: "kilometers" });
}
export function bbox(feature) {
  return turf.bbox(feature);
}
export function unionFeatures(features) {
  if (!features.length) return null;
  return turf.featureCollection(features);
}
export function intersection(a, b) {
  return turf.intersect(turf.featureCollection([a, b]));
}
export function nearestPoint(target, points) {
  return turf.nearestPoint(target, turf.featureCollection(points));
}
export function calculateStatistics(values) {
  const clean = values.filter(Number.isFinite);
  if (!clean.length) return { count: 0, min: null, max: null, mean: null, sum: null };
  const sum = clean.reduce((a, b) => a + b, 0);
  return {
    count: clean.length,
    min: Math.min(...clean),
    max: Math.max(...clean),
    mean: sum / clean.length,
    sum
  };
}
