import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useApp } from '../../context/AppContext';
// Import Draw globally for this component
const MapComponent = ({ onMapReady }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popupRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedCountry, activeLayer, visibleLayers, theme } = useApp();
  const getChoroplethColor = (value, layer) => {
    if (layer === 'population') {
      if (value > 100e6) return '#1e3a8a';
      if (value > 50e6) return '#1e40af';
      if (value > 20e6) return '#2563eb';
      if (value > 10e6) return '#3b82f6';
      if (value > 5e6) return '#60a5fa';
      return '#93c5fd';
    }
    if (layer === 'gdp') {
      if (value > 1e6) return '#064e3b';
      if (value > 500e3) return '#065f46';
      if (value > 200e3) return '#047857';
      if (value > 100e3) return '#059669';
      if (value > 50e3) return '#10b981';
      return '#6ee7b7';
    }
    if (layer === 'dsi') {
      if (value > 80) return '#7c3aed';
      if (value > 60) return '#8b5cf6';
      if (value > 40) return '#a78bfa';
      if (value > 20) return '#c4b5fd';
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
    map.current.on('load', () => {
      Promise.all([
        fetch('/latamCountries.json').then(res => res.json()),
        fetch('/capitals.json').then(res => res.json()),
        fetch('/operationalLayers.json').then(res => res.json())
      ]).then(([countriesData, capitalsData, operationalData]) => {
        map.current.addSource('countries', { type: 'geojson', data: countriesData, generateId: true });
        map.current.addSource('capitals', { type: 'geojson', data: capitalsData });
        map.current.addSource('operational', { type: 'geojson', data: operationalData });
        map.current.addLayer({ id: 'countries-fill', type: 'fill', source: 'countries', paint: { 'fill-color': '#3b82f6', 'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, ['boolean', ['feature-state', 'selected'], false], 0.8, 0.5] } });
        map.current.addLayer({ id: 'countries-border', type: 'line', source: 'countries', paint: { 'line-color': '#1e3a8a', 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, ['boolean', ['feature-state', 'selected'], false], 4, 2], 'line-opacity': 0.9 } });
        map.current.addLayer({ id: 'countries-label', type: 'symbol', source: 'countries', layout: { 'text-field': ['get', 'name'], 'text-size': 13, 'text-anchor': 'center', 'text-allow-overlap': false }, paint: { 'text-color': '#ffffff', 'text-halo-color': '#000000', 'text-halo-width': 3 }, minzoom: 2 });
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
            setSelectedCountry({ id: p.id, name: p.name, capital: p.capital, population: p.pop_est, area: p.area_km2, gdp: p.gdp_md_est, popDensity: p.pop_density });
            const coords = e.features[0].geometry.coordinates[0];
            const bounds = new maplibregl.LngLatBounds(coords[0], coords[0]);
            coords.forEach(c => bounds.extend(c));
            map.current.fitBounds(bounds, { padding: 50, maxZoom: 6, duration: 1500 });
            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({ offset: 25, closeButton: true, closeOnClick: true })
              .setLngLat(e.lngLat)
              .setHTML('<div style="font-family: sans-serif; min-width: 220px;"><h3 style="margin: 0 0 10px; font-size: 18px; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">' + p.name + '</h3><div style="font-size: 14px; line-height: 1.8;"><div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #6b7280;">Capital:</span><span style="font-weight: 600;">' + p.capital + '</span></div><div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #6b7280;">Population:</span><span style="font-weight: 600;">' + (p.pop_est/1e6).toFixed(2) + 'M</span></div><div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #6b7280;">GDP:</span><span style="font-weight: 600; color: #10b981;">$' + p.gdp_md_est.toLocaleString() + 'M</span></div><div style="display: flex; justify-content: space-between; padding: 4px 0;"><span style="color: #6b7280;">Area:</span><span style="font-weight: 600;">' + p.area_km2.toLocaleString() + ' km²</span></div></div></div>')
              .addTo(map.current);
          }
        });
        // ÏÚã ÇáÈÍË ÇáãÊÞÏã (Fly-to)
        window.addEventListener('flyToCountry', (event) => {
          const feature = event.detail;
          const p = feature.properties;
          setSelectedCountry({ id: p.id, name: p.name, capital: p.capital, population: p.pop_est, area: p.area_km2, gdp: p.gdp_md_est, popDensity: p.pop_density });
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
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    const source = map.current.getSource('countries');
    if (!source || !source._data) return;
    const updated = source._data.features.map(f => {
      let val = 0;
      if (activeLayer === 'population') val = f.properties.pop_est;
      else if (activeLayer === 'gdp') val = f.properties.gdp_md_est;
      else if (activeLayer === 'dsi') val = Math.random() * 100;
      return { ...f, properties: { ...f.properties, _color: getChoroplethColor(val, activeLayer) } };
    });
    source.setData({ ...source._data, features: updated });
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

