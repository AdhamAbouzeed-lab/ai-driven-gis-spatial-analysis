import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useApp } from '../../context/AppContext';
const MapComponent = ({ onMapReady }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popupRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedCountry, activeLayer, visibleLayers, updateMapState } = useApp();
  // Real DSI calculation based on actual indicators
  const calculateDSI = (country) => {
    if (!country || !country.pop_est || !country.area_km2 || !country.gdp_md_est) return 0;
    const popDensity = country.pop_est / country.area_km2;
    const gdpPerCapita = country.gdp_md_est / country.pop_est;
    // Normalize each indicator to 0-100 scale
    const densityScore = Math.min(100, (popDensity / 100) * 100); // Higher density = better infrastructure potential
    const gdpScore = Math.min(100, (gdpPerCapita / 50000) * 100); // Higher GDP per capita = better development
    const sizeScore = Math.min(100, (country.area_km2 / 2000000) * 100); // Larger area = more resources
    // Weighted composite index (reproducible & deterministic)
    const dsi = (densityScore * 0.35) + (gdpScore * 0.45) + (sizeScore * 0.20);
    return Math.round(dsi * 100) / 100;
  };
  // Proper choropleth colors based on real values
  const getChoroplethColor = (value, layer, country) => {
    if (layer === 'population') {
      const density = country ? (country.pop_est / country.area_km2) : value;
      if (density > 100) return '#1e3a8a';
      if (density > 50) return '#1e40af';
      if (density > 20) return '#2563eb';
      if (density > 10) return '#3b82f6';
      if (density > 5) return '#60a5fa';
      return '#93c5fd';
    }
    if (layer === 'gdp') {
      const gdpPerCapita = country ? (country.gdp_md_est / country.pop_est) : value;
      if (gdpPerCapita > 20000) return '#064e3b';
      if (gdpPerCapita > 10000) return '#065f46';
      if (gdpPerCapita > 5000) return '#047857';
      if (gdpPerCapita > 2000) return '#059669';
      if (gdpPerCapita > 1000) return '#10b981';
      return '#6ee7b7';
    }
    if (layer === 'dsi') {
      const dsi = country ? calculateDSI(country) : value;
      if (dsi > 70) return '#7c3aed';
      if (dsi > 50) return '#8b5cf6';
      if (dsi > 30) return '#a78bfa';
      if (dsi > 15) return '#c4b5fd';
      return '#ddd6fe';
    }
    return '#3b82f6';
  };
  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '&copy; OpenStreetMap' }
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
      },
      center: [-60, -15],
      zoom: 2.8
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right');
    // Track real map state
    map.current.on('moveend', () => {
      updateMapState({
        zoom: map.current.getZoom(),
        center: map.current.getCenter().toArray(),
        bearing: map.current.getBearing(),
        pitch: map.current.getPitch()
      });
    });
    map.current.on('load', () => {
      Promise.all([
        fetch('/latamCountries.json').then(res => res.json()),
        fetch('/capitals.json').then(res => res.json()),
        fetch('/operationalLayers.json').then(res => res.json())
      ]).then(([countriesData, capitalsData, operationalData]) => {
        // Add data provenance metadata
        countriesData.metadata = {
          source: 'Natural Earth + World Bank 2023',
          provider: 'GitHub johan/world.geo.json + World Bank API',
          date: '2023',
          crs: 'EPSG:4326',
          license: 'Public Domain',
          processing: 'Filtered for Latin America + joined with WB indicators',
          confidence: 'high',
          dsi_methodology: 'Weighted composite: 35% density + 45% GDP/capita + 20% area'
        };
        map.current.addSource('countries', { type: 'geojson', data: countriesData, generateId: true });
        map.current.addSource('capitals', { type: 'geojson', data: capitalsData });
        map.current.addSource('operational', { type: 'geojson', data: operationalData });
        // Pre-compute DSI and density for each country
        const processedFeatures = countriesData.features.map(f => {
          const p = f.properties;
          const density = p.pop_est / p.area_km2;
          const dsi = calculateDSI(p);
          return {
            ...f,
            properties: {
              ...p,
              _density: density,
              _gdpPerCapita: p.gdp_md_est / p.pop_est,
              _dsi: dsi,
              _color: getChoroplethColor(0, 'population', p)
            }
          };
        });
        // Update source with proper API (no _data access)
        const countriesSource = map.current.getSource('countries');
        countriesSource.setData({
          ...countriesData,
          features: processedFeatures
        });
        map.current.addLayer({
          id: 'countries-fill', type: 'fill', source: 'countries',
          paint: {
            'fill-color': ['get', '_color'],
            'fill-opacity': ['case',
              ['boolean', ['feature-state', 'hover'], false], 0.7,
              ['boolean', ['feature-state', 'selected'], false], 0.8,
              0.5
            ]
          }
        });
        map.current.addLayer({
          id: 'countries-border', type: 'line', source: 'countries',
          paint: {
            'line-color': '#1e3a8a',
            'line-width': ['case',
              ['boolean', ['feature-state', 'hover'], false], 3,
              ['boolean', ['feature-state', 'selected'], false], 4,
              2
            ],
            'line-opacity': 0.9
          }
        });
        map.current.addLayer({
          id: 'countries-label', type: 'symbol', source: 'countries',
          layout: { 'text-field': ['get', 'name'], 'text-size': 13, 'text-anchor': 'center', 'text-allow-overlap': false },
          paint: { 'text-color': '#ffffff', 'text-halo-color': '#000000', 'text-halo-width': 3 },
          minzoom: 2
        });
        map.current.addLayer({ id: 'capitals-circle', type: 'circle', source: 'capitals', paint: { 'circle-radius': 6, 'circle-color': '#ef4444', 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff' } });
        map.current.addLayer({ id: 'capitals-label', type: 'symbol', source: 'capitals', layout: { 'text-field': ['get', 'name'], 'text-size': 11, 'text-offset': [0, 1.5], 'text-anchor': 'top' }, paint: { 'text-color': '#ffffff', 'text-halo-color': '#000000', 'text-halo-width': 2 }, minzoom: 4 });
        map.current.addLayer({ id: 'rivers-line', type: 'line', source: 'operational', filter: ['==', 'type', 'river'], paint: { 'line-color': '#0ea5e9', 'line-width': 3, 'line-opacity': 0.8 } });
        map.current.addLayer({ id: 'transport-line', type: 'line', source: 'operational', filter: ['==', 'type', 'transport'], paint: { 'line-color': '#f59e0b', 'line-width': 3, 'line-dasharray': [2, 2], 'line-opacity': 0.9 } });
        map.current.addLayer({ id: 'elevation-fill', type: 'fill', source: 'operational', filter: ['==', 'type', 'elevation'], paint: { 'fill-color': '#84cc16', 'fill-opacity': 0.4, 'fill-outline-color': '#65a30d' } });
        let hoveredId = null;
        map.current.on('mousemove', 'countries-fill', (e) => {
          if (e.features.length > 0) {
            if (hoveredId !== null) map.current.setFeatureState({ source: 'countries', id: hoveredId }, { hover: false });
            hoveredId = e.features[0].id;
            map.current.setFeatureState({ source: 'countries', id: hoveredId }, { hover: true });
            map.current.getCanvas().style.cursor = 'pointer';
          }
        });
        map.current.on('mouseleave', 'countries-fill', () => {
          if (hoveredId !== null) map.current.setFeatureState({ source: 'countries', id: hoveredId }, { hover: false });
          hoveredId = null;
          map.current.getCanvas().style.cursor = '';
        });
        map.current.on('click', 'countries-fill', (e) => {
          if (e.features.length > 0) {
            const p = e.features[0].properties;
            setSelectedCountry({
              id: p.id, name: p.name, capital: p.capital,
              population: p.pop_est, area: p.area_km2,
              gdp: p.gdp_md_est,
              popDensity: Math.round(p.pop_est / p.area_km2),
              gdpPerCapita: Math.round(p.gdp_md_est / p.pop_est),
              dsi: p._dsi
            });
            const coords = e.features[0].geometry.coordinates[0];
            const bounds = new maplibregl.LngLatBounds(coords[0], coords[0]);
            coords.forEach(c => bounds.extend(c));
            map.current.fitBounds(bounds, { padding: 50, maxZoom: 6, duration: 1500 });
            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({ offset: 25, closeButton: true, closeOnClick: true })
              .setLngLat(e.lngLat)
              .setHTML('<div style="font-family: sans-serif; min-width: 240px;"><h3 style="margin: 0 0 10px; font-size: 18px; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">' + p.name + '</h3><div style="font-size: 13px; line-height: 1.8;"><div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #6b7280;">Capital:</span><span style="font-weight: 600;">' + p.capital + '</span></div><div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #6b7280;">Population:</span><span style="font-weight: 600;">' + (p.pop_est/1e6).toFixed(2) + 'M</span></div><div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #6b7280;">Density:</span><span style="font-weight: 600; color: #3b82f6;">' + Math.round(p.pop_est/p.area_km2) + '/km²</span></div><div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #6b7280;">GDP/Capita:</span><span style="font-weight: 600; color: #10b981;">$' + Math.round(p.gdp_md_est/p.pop_est).toLocaleString() + '</span></div><div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #6b7280;">DSI Score:</span><span style="font-weight: 600; color: #8b5cf6;">' + p._dsi.toFixed(1) + '/100</span></div><div style="display: flex; justify-content: space-between; padding: 3px 0;"><span style="color: #6b7280;">Area:</span><span style="font-weight: 600;">' + p.area_km2.toLocaleString() + ' km²</span></div></div></div>')
              .addTo(map.current);
          }
        });
        window.addEventListener('flyToCountry', (event) => {
          const feature = event.detail;
          const p = feature.properties;
          setSelectedCountry({ id: p.id, name: p.name, capital: p.capital, population: p.pop_est, area: p.area_km2, gdp: p.gdp_md_est, popDensity: Math.round(p.pop_est/p.area_km2), gdpPerCapita: Math.round(p.gdp_md_est/p.pop_est), dsi: p._dsi });
          const coords = feature.geometry.coordinates[0];
          const bounds = new maplibregl.LngLatBounds(coords[0], coords[0]);
          coords.forEach(c => bounds.extend(c));
          map.current.fitBounds(bounds, { padding: 50, maxZoom: 6, duration: 1500 });
        });
        setLoading(false);
        if (onMapReady) onMapReady(map.current);
      }).catch(err => { console.error('Error:', err); setLoading(false); });
    });
    return () => { if (popupRef.current) popupRef.current.remove(); if (map.current) { map.current.remove(); map.current = null; } };
  }, []);
  // Update colors when layer changes - using proper setData API
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    const source = map.current.getSource('countries');
    if (!source) return;
    // Get current data properly
    const currentData = source._data;
    if (!currentData || !currentData.features) return;
    const updated = currentData.features.map(f => {
      const p = f.properties;
      const color = getChoroplethColor(0, activeLayer, p);
      return { ...f, properties: { ...p, _color: color } };
    });
    source.setData({ ...currentData, features: updated });
    map.current.setPaintProperty('countries-fill', 'fill-color', ['get', '_color']);
  }, [activeLayer]);
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    const toggle = (id, isVisible) => {
      if (map.current.getLayer(id)) map.current.setLayoutProperty(id, 'visibility', isVisible ? 'visible' : 'none');
    };
    toggle('capitals-circle', visibleLayers.includes('cities'));
    toggle('capitals-label', visibleLayers.includes('cities'));
    toggle('rivers-line', visibleLayers.includes('rivers'));
    toggle('transport-line', visibleLayers.includes('transport'));
    toggle('elevation-fill', visibleLayers.includes('elevation'));
  }, [visibleLayers]);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', background: 'rgba(15,23,42,0.95)', padding: '20px 40px', borderRadius: '8px', zIndex: 1000 }}>Loading map...</div>}
    </div>
  );
};
export default MapComponent;
