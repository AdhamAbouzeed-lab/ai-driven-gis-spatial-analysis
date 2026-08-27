import { useEffect, useRef } from 'react';
const HeatmapLayer = ({ map, visible }) => {
  const layerAdded = useRef(false);
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    const addHeatmap = async () => {
      if (layerAdded.current) return;
      try {
        const response = await fetch('/capitals.json');
        const capitals = await response.json();
        // Weight by actual population (in millions) for scientific accuracy
        const features = capitals.features.map(f => ({
          ...f,
          properties: {
            ...f.properties,
            weight: Math.log10(f.properties.population + 1) * 2 // Logarithmic scale for better visualization
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
              'heatmap-intensity': 1.2,
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
              ],
              'heatmap-radius': [
                'interpolate', ['linear'], ['zoom'],
                0, 5,
                9, 25,
                14, 50
              ],
              'heatmap-opacity': 0.85
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
      if (map && map.getLayer('heatmap')) {
        map.removeLayer('heatmap');
        map.removeSource('heatmap');
        layerAdded.current = false;
      }
    };
  }, [map, visible]);
  return null;
};
export default HeatmapLayer;
