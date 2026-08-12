import { throttle } from '../utils/throttle.js';

export function initInteractionManager(map, maplibregl, colData, latamData) {
  const tooltip = document.getElementById('tooltip');
  let hoveredId = null;

  const nameToFeature = {};
  colData.features.forEach(f => {
    nameToFeature[f.properties.name] = f;
  });

  const countryCentroids = {};
  latamData.features.forEach(f => {
    countryCentroids[f.properties.name] = f.geometry.coordinates;
  });

  // Hover with feature-state — throttled to ~60fps so tooltip DOM writes
  // (innerHTML + inline style) don't fire on every raw mousemove pixel.
  map.on('mousemove', 'col-fill', throttle((e) => {
    if (e.features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';
      const feat = e.features[0];
      const name = feat.properties.name;

      if (hoveredId !== null) {
        map.setFeatureState({ source: 'colombia', id: hoveredId }, { hover: false });
      }
      hoveredId = feat.id;
      map.setFeatureState({ source: 'colombia', id: hoveredId }, { hover: true });

      const props = nameToFeature[name]?.properties;
      if (props && tooltip) {
        tooltip.innerHTML = `${name} — DSI:${props.dsi} GDP:$${props.gdpCapita.toLocaleString()}`;
        tooltip.style.left = (e.point.x + 12) + 'px';
        tooltip.style.top = (e.point.y + 12) + 'px';
        tooltip.style.opacity = '1';
      }
    }
  }, 16));

  map.on('mouseleave', 'col-fill', () => {
    map.getCanvas().style.cursor = '';
    if (hoveredId !== null) {
      map.setFeatureState({ source: 'colombia', id: hoveredId }, { hover: false });
      hoveredId = null;
    }
    if (tooltip) tooltip.style.opacity = '0';
  });

  // Click handlers
  const manager = {
    onSelectRegion: null,
    onSelectCountry: null,

    flyToRegion(name) {
      const feat = nameToFeature[name];
      if (!feat || !map) return;
      const coords = feat.geometry.coordinates[0];
      const lons = coords.map(c => c[0]);
      const lats = coords.map(c => c[1]);
      map.fitBounds(
        [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
        { padding: 50, duration: 800, maxZoom: 9 }
      );
    },

    flyToCountry(name) {
      const coords = countryCentroids[name];
      if (coords && map) {
        map.flyTo({ center: coords, zoom: 5, duration: 1000 });
      }
    },
  };

  map.on('click', 'col-fill', (e) => {
    if (e.features.length > 0) {
      const name = e.features[0].properties.name;
      const props = nameToFeature[name]?.properties;
      if (manager.onSelectRegion) manager.onSelectRegion(name, props);
    }
  });

  map.on('click', 'latam-point', (e) => {
    if (e.features.length > 0) {
      const name = e.features[0].properties.name;
      const props = e.features[0].properties;
      if (manager.onSelectCountry) manager.onSelectCountry(name, props);
      showCountryPopup(name, props);
    }
  });

  map.on('click', 'latam-cluster', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['latam-cluster'] });
    if (!features.length) return;
    const clusterId = features[0].properties.cluster_id;
    map.getSource('latam').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      map.easeTo({ center: features[0].geometry.coordinates, zoom, duration: 500 });
    });
  });

  // Throttled coordinate display
  map.on('mousemove', throttle((e) => {
    const el = document.getElementById('coords');
    if (!el) return;
    const lat = e.lngLat.lat.toFixed(4);
    const lng = e.lngLat.lng.toFixed(4);
    el.textContent = `${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng)}°${lng >= 0 ? 'E' : 'W'}`;
  }, 100));

  function showCountryPopup(name, props) {
    const coords = countryCentroids[name];
    if (!coords) return;
    new maplibregl.Popup()
      .setLngLat(coords)
      .setHTML(`
        <div style="min-width:180px">
          <h3 style="font-weight:700;font-size:12px;margin-bottom:4px">${name}</h3>
          <div style="font-size:10px;space-y:2px">
            <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Capital:</span><span>${props.capital}</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Population:</span><span>${(props.population / 1e6).toFixed(1)}M</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">GDP/capita:</span><span>$${props.gdpCapita.toLocaleString()}</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">DSI:</span><span style="font-weight:700">${props.dsi}</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Growth:</span><span style="color:${props.growth >= 0 ? '#4ade80' : '#f87171'}">${props.growth > 0 ? '+' : ''}${props.growth}%</span></div>
          </div>
        </div>
      `)
      .addTo(map);
  }

  return manager;
}
