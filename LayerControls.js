import { getDSIColor, getGDPColor, getDensityColor, getClusterColor } from '../config.js';

export function initLayerControls(layerManager) {
  const container = document.getElementById('layer-controls');
  if (!container) return;

  const colors = {
    dsi: 'linear-gradient(135deg, #ef4444, #f59e0b, #22c55e)',
    gdp: 'linear-gradient(135deg, #4ade80, #059669)',
    population: 'linear-gradient(135deg, #fb923c, #ef4444)',
    clusters: 'linear-gradient(135deg, #a855f7, #ec4899)',
  };

  const layers = [
    { id: 'dsi', label: 'dsi_layer', sub: 'Development Suitability', icon: 'M18 20V10M12 20V4M6 20v-6', checked: true },
    { id: 'gdp', label: 'gdp_layer', sub: 'USD 2025', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'population', label: 'pop_layer', sub: 'hab/km²', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
    { id: 'clusters', label: 'cluster_layer', sub: 'ML Segmentation', icon: 'M18 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 19a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  ];

  container.innerHTML = layers.map(l => `
    <div class="layer-item" data-layer="${l.id}">
      <div class="layer-info">
        <div class="layer-icon" style="background:${colors[l.id]}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${l.icon}"/></svg>
        </div>
        <div>
          <p class="layer-name" data-i18n="${l.label}"></p>
          <p class="layer-meta">${l.sub}</p>
        </div>
      </div>
      <label class="toggle">
        <input type="checkbox" data-layer-toggle="${l.id}" ${l.checked ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    </div>
  `).join('');

  container.addEventListener('change', (e) => {
    if (e.target.matches('[data-layer-toggle]')) {
      const layerId = e.target.dataset.layerToggle;
      if (e.target.checked) {
        layerManager.setLayer(layerId);
      } else {
        layerManager.setLayer(null);
      }
    }
  });
}
