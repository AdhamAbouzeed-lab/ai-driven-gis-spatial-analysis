import { describe, expect, it } from "vitest";
import { areaKm2, calculateStatistics } from "../services/gisService";
import { calculateDSI } from "../services/suitabilityService";
import { kMeans } from "../services/mlService";
describe("GIS engine", () => {
  it("calculates statistics without fabricated values", () => {
    const result = calculateStatistics([1,2,3,4]);
    expect(result.count).toBe(4);
    expect(result.mean).toBe(2.5);
  });
  it("supports Polygon geometry", () => {
    const feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74, 4], [-73, 4], [-73, 5], [-74, 5], [-74, 4]
        ]]
      }
    };
    expect(areaKm2(feature)).toBeGreaterThan(0);
  });
  it("supports MultiPolygon through Turf", () => {
    const feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [-74,4],[-73,4],[-73,5],[-74,5],[-74,4]
        ]]]
      }
    };
    expect(areaKm2(feature)).toBeGreaterThan(0);
  });
  it("DSI is deterministic", () => {
    const features = [
      {type:"Feature",properties:{__population:100,__gdpPerCapita:10}},
      {type:"Feature",properties:{__population:200,__gdpPerCapita:20}},
      {type:"Feature",properties:{__population:300,__gdpPerCapita:30}}
    ];
    const a = calculateDSI(features);
    const b = calculateDSI(features);
    expect(a.map(x => x.properties.__dsi))
      .toEqual(b.map(x => x.properties.__dsi));
  });
  it("K-Means returns canonical cluster property", () => {
    const features = [
      {type:"Feature",properties:{a:1,b:1}},
      {type:"Feature",properties:{a:2,b:2}},
      {type:"Feature",properties:{a:10,b:10}},
      {type:"Feature",properties:{a:11,b:11}}
    ];
    const result = kMeans(features, ["a","b"], 2);
    expect(result.features.every(x => "__mlCluster" in x.properties)).toBe(true);
    expect(result.metadata.algorithm).toBe("K-Means");
  });
});
