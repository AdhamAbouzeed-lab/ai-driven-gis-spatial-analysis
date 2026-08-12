export const CONFIG = {
  DATA_URLS: {
    colombia: '/data/colombia-departments.json',
    latam: '/data/latam-countries.json',
  },
  MAP: {
    center: [-74.2973, 4.5709],
    zoom: 5,
    maxZoom: 12,
    minZoom: 2,
    pitch: 0,
    bearing: 0,
  },
  COLORS: {
    dsi: ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'],
    gdp: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#00441b'],
    density: ['#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    cluster: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
  },
  BASEMAPS: {
    streets: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{a|b|c}.tile.opentopomap.org/{z}/{x}/{y}.png',
    dark: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  },
  CACHE_TTL: 1000 * 60 * 60,
  USE_PMTILES: false,
};

export function getDSIColor(v) {
  const c = CONFIG.COLORS.dsi;
  if (v >= 80) return c[7]; if (v >= 70) return c[6]; if (v >= 60) return c[5];
  if (v >= 50) return c[4]; if (v >= 40) return c[3]; if (v >= 30) return c[2];
  if (v >= 20) return c[1]; return c[0];
}

export function getGDPColor(v) {
  const c = CONFIG.COLORS.gdp;
  if (v >= 15000) return c[7]; if (v >= 12000) return c[6]; if (v >= 10000) return c[5];
  if (v >= 8000) return c[4]; if (v >= 6000) return c[3]; if (v >= 4000) return c[2];
  if (v >= 2000) return c[1]; return c[0];
}

export function getDensityColor(v) {
  const c = CONFIG.COLORS.density;
  if (v >= 500) return c[7]; if (v >= 300) return c[6]; if (v >= 200) return c[5];
  if (v >= 100) return c[4]; if (v >= 50) return c[3]; if (v >= 20) return c[2];
  if (v >= 10) return c[1]; return c[0];
}

export function getClusterColor(c) {
  return CONFIG.COLORS.cluster[c % CONFIG.COLORS.cluster.length];
}
