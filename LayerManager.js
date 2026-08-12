import { getDSIColor, getGDPColor, getDensityColor, getClusterColor } from '../config.js';
import { memoize } from '../utils/memoize.js';

const getDSIColorMemo = memoize(getDSIColor);
const getGDPColorMemo = memoize(getGDPColor);
const getDensityColorMemo = memoize(getDensityColor);
const getClusterColorMemo = memoize(getClusterColor);

export function initLayerManager(map, maplibregl, colData, latamData) {
  const colFeatures = colData.features;
  const names = colFeatures.map(f => f.properties.name);

  // Build match expressions
  const buildMatch = (prop, fn) => {
    const expr = ['match', ['get', 'name']];
    colFeatures.forEach(f => {
      expr.push(f.properties.name, fn(f.properties[prop]));
    });
    expr.push('#ccc');
    return expr;
  };

  const matchDSI = buildMatch('dsi', getDSIColorMemo);
  const matchGDP = buildMatch('gdpCapita', getGDPColorMemo);
  const matchDensity = buildMatch('density', getDensityColorMemo);
  const matchCluster = buildMatch('cluster', getClusterColorMemo);

  // Add Colombia source
  map.addSource('colombia', {
    type: 'geojson',
    data: colData,
    promoteId: 'name',
  });

  map.addLayer({
    id: 'col-fill',
    type: 'fill',
    source: 'colombia',
    paint: {
      'fill-color': matchDSI,
      'fill-opacity': 0.8,
      'fill-outline-color': '#ffffff',
    },
  });

  map.addLayer({
    id: 'col-line',
    type: 'line',
    source: 'colombia',
    paint: {
      'line-color': '#ffffff',
      'line-width': 1,
    },
  });

  map.addLayer({
    id: 'col-hover',
    type: 'fill',
    source: 'colombia',
    paint: {
      'fill-color': '#ffffff',
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, 0],
    },
    filter: ['==', ['get', 'name'], ''],
  });

  // Add LatAm countries source with clustering
  map.addSource('latam', {
    type: 'geojson',
    data: latamData,
    cluster: true,
    clusterMaxZoom: 6,
    clusterRadius: 40,
  });

  map.addLayer({
    id: 'latam-cluster',
    type: 'circle',
    source: 'latam',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#0ea5e9', 5, '#d946ef', 10, '#22c55e'],
      'circle-radius': ['step', ['get', 'point_count'], 15, 5, 20, 10, 25],
      'circle-opacity': 0.8,
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 2,
    },
  });

  map.addLayer({
    id: 'latam-cluster-count',
    type: 'symbol',
    source: 'latam',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-size': 10,
      'text-font': ['Open Sans Regular'],
    },
    paint: { 'text-color': '#fff' },
  });

  map.addLayer({
    id: 'latam-point',
    type: 'circle',
    source: 'latam',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'dsi'], 20, 6, 40, 12, 60, 18, 80, 24],
      'circle-color': ['interpolate', ['linear'], ['get', 'dsi'], 20, '#d73027', 50, '#fee08b', 80, '#1a9850'],
      'circle-opacity': 0.75,
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1.5,
    },
  });

  map.addLayer({
    id: 'latam-label',
    type: 'symbol',
    source: 'latam',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': ['get', 'name'],
      'text-size': 9,
      'text-offset': [0, 1.2],
      'text-anchor': 'top',
      'text-font': ['Open Sans Regular'],
    },
    paint: {
      'text-color': '#e2e8f0',
      'text-halo-color': '#0f172a',
      'text-halo-width': 2,
    },
  });

  return {
    setLayer(layerId) {
      if (!layerId) return;
      const paint = layerId === 'dsi' ? matchDSI
        : layerId === 'gdp' ? matchGDP
        : layerId === 'population' ? matchDensity
        : layerId === 'clusters' ? matchCluster
        : matchDSI;
      map.setPaintProperty('col-fill', 'fill-color', paint);
    },
  };
}
