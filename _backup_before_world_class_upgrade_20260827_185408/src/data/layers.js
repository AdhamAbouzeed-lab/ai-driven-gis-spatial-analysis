export const LAYERS = {
  population: { id: 'population', name: 'Population Density', category: 'analytical', icon: 'users', description: 'Population density per km²', unit: 'people/km²', color: '#3b82f6', min: 0, max: 500, dataset: { source: 'World Bank', year: 2023 } },
  gdp: { id: 'gdp', name: 'GDP per Capita', category: 'analytical', icon: 'dollar', description: 'Gross Domestic Product per capita', unit: 'USD', color: '#10b981', min: 0, max: 20000, dataset: { source: 'IMF', year: 2023 } },
  dsi: { id: 'dsi', name: 'DSI Score', category: 'analytical', icon: 'chart', description: 'Development Suitability Index', unit: 'score', color: '#8b5cf6', min: 0, max: 100, dataset: { source: 'Custom Analysis', year: 2024 } },
  clusters: { id: 'clusters', name: 'ML Clusters', category: 'analytical', icon: 'cpu', description: 'Machine Learning regional clusters', unit: 'cluster', color: '#f59e0b', min: 1, max: 5, dataset: { source: 'K-Means', year: 2024 } },
  cities: { id: 'cities', name: 'Cities', category: 'operational', icon: 'building', description: 'Major cities and capitals', unit: 'count', color: '#ef4444', min: 0, max: 100, dataset: { source: 'Natural Earth', year: 2023 } },
  heatmap: { id: 'heatmap', name: 'Heatmap', category: 'operational', icon: 'flame', description: 'Activity density heatmap', unit: 'intensity', color: '#ec4899', min: 0, max: 100, dataset: { source: 'Aggregated Data', year: 2024 } },
  corridors: { id: 'corridors', name: 'Transport Corridors', category: 'operational', icon: 'truck', description: 'Major transport routes', unit: 'km', color: '#06b6d4', min: 0, max: 1000, dataset: { source: 'OpenStreetMap', year: 2023 } },
  rivers: { id: 'rivers', name: 'Rivers', category: 'operational', icon: 'waves', description: 'Major river systems', unit: 'km', color: '#0ea5e9', min: 0, max: 5000, dataset: { source: 'Natural Earth', year: 2023 } },
  elevation: { id: 'elevation', name: 'Elevation Zones', category: 'operational', icon: 'mountain', description: 'Elevation zones classification', unit: 'meters', color: '#84cc16', min: 0, max: 6000, dataset: { source: 'SRTM', year: 2023 } }
};

export const LAYER_CATEGORIES = {
  analytical: { name: 'Analytical', layers: ['population', 'gdp', 'dsi', 'clusters'] },
  operational: { name: 'Operational', layers: ['cities', 'heatmap', 'corridors', 'rivers', 'elevation'] }
};

export default LAYERS;
