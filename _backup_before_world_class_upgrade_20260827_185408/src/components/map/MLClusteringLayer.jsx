import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import kmeans from 'ml-kmeans';
const MLClusteringLayer = ({ map, visible, countries }) => {
  const layerAdded = useRef(false);
  useEffect(() => {
    if (!map || !map.isStyleLoaded() || !visible) return;
    const addClustering = () => {
      if (layerAdded.current) return;
      try {
        // Prepare data for clustering (GDP per capita vs Population Density)
        const data = countries.map(c => [
          c.properties.gdp_md_est / c.properties.pop_est, // GDP per capita
          c.properties.pop_est / c.properties.area_km2    // Population density
        ]);
        // Normalize data
        const maxGDP = Math.max(...data.map(d => d[0]));
        const maxDensity = Math.max(...data.map(d => d[1]));
        const normalizedData = data.map(d => [d[0] / maxGDP, d[1] / maxDensity]);
        // Apply K-Means clustering (k=4 clusters)
        const k = 4;
        const result = kmeans(normalizedData, k);
        // Add cluster assignments to countries
        const clusteredCountries = {
          type: 'FeatureCollection',
          features: countries.map((c, i) => ({
            ...c,
            properties: {
              ...c.properties,
              cluster: result.clusters[i],
              gdpPerCapita: c.properties.gdp_md_est / c.properties.pop_est,
              density: c.properties.pop_est / c.properties.area_km2
            }
          }))
        };
        if (!map.getSource('ml-clusters')) {
          map.addSource('ml-clusters', {
            type: 'geojson',
            data: clusteredCountries
          });
          // Add clustered layer
          map.addLayer({
            id: 'ml-clusters-fill',
            type: 'fill',
            source: 'ml-clusters',
            paint: {
              'fill-color': [
                'match', ['get', 'cluster'],
                0, '#ef4444', // Cluster 0: Low GDP, Low Density
                1, '#f59e0b', // Cluster 1: Low GDP, High Density
                2, '#3b82f6', // Cluster 2: High GDP, Low Density
                3, '#10b981', // Cluster 3: High GDP, High Density
                '#8b5cf6'     // Default
              ],
              'fill-opacity': 0.6
            }
          }, 'countries-label');
          map.addLayer({
            id: 'ml-clusters-border',
            type: 'line',
            source: 'ml-clusters',
            paint: {
              'line-color': '#1e293b',
              'line-width': 2,
              'line-opacity': 0.8
            }
          }, 'countries-label');
          layerAdded.current = true;
        }
        map.setLayoutProperty('ml-clusters-fill', 'visibility', visible ? 'visible' : 'none');
        map.setLayoutProperty('ml-clusters-border', 'visibility', visible ? 'visible' : 'none');
      } catch (error) {
        console.error('ML Clustering error:', error);
      }
    };
    addClustering();
    return () => {
      if (map.getLayer('ml-clusters-fill')) {
        map.removeLayer('ml-clusters-fill');
        map.removeLayer('ml-clusters-border');
        map.removeSource('ml-clusters');
        layerAdded.current = false;
      }
    };
  }, [map, visible, countries]);
  return null;
};
export default MLClusteringLayer;
