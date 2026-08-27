import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
const HeatmapLayer = ({ map, visible }) => {
  const layerAdded = useRef(false);
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    const addHeatmap = async () => {
      if (layerAdded.current) return;
      try {
        const response = await fetch('/capitals.json');
        const capitals = await response.json();
        // Create weighted points for heatmap
        const features = capitals.features.map(f => ({
          ...f,
          properties: {
            ...f.properties,
            weight: f.properties.population / 1000000
          }
        }));
        if (!map.getSource('heatmap')) {
          map.addSource('heatmap', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features }
          });
          map.addLayer({
            id: 'heatmap',
            type: 'heatmap',
            source: 'heatmap',
            maxzoom: 14,
            paint: {
              'heatmap-weight': ['get', 'weight'],
              'heatmap-intensity': 0.8,
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(59,130,246,0)',
                0.2, 'rgba(59,130,246,0.6)',
                0.4, 'rgba(59,130,246,0.8)',
                0.6, 'rgba(139,92,246,0.8)',
                0.8, 'rgba(239,68,68,0.8)',
                1, 'rgba(239,68,68,1)'
              ],
              'heatmap-radius': [
                'interpolate', ['linear'], ['zoom'],
                0, 2,
                9, 20,
                14, 40
              ],
              'heatmap-opacity': 0.7
            }
          }, 'countries-label');
          layerAdded.current = true;
        }
        map.setLayoutProperty('heatmap', 'visibility', visible ? 'visible' : 'none');
      } catch (error) {
        console.error('Heatmap error:', error);
      }
    };
    addHeatmap();
    return () => {
      if (map.getLayer('heatmap')) {
        map.removeLayer('heatmap');
        map.removeSource('heatmap');
        layerAdded.current = false;
      }
    };
  }, [map, visible]);
  return null;
};
export default HeatmapLayer;
