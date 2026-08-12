import './styles/main.css';
import { initI18n, t } from './utils/i18n.js';
import { setState, getState, onStateChange } from './state.js';
import { setLoaderProgress } from './utils/perf.js';
import { debounce } from './utils/debounce.js';
import { fetchDataset } from './utils/cache.js';
import { CONFIG } from './config.js';

import { initHeader } from './components/Header.js';
import { initSearchEngine } from './search/SearchEngine.js';
import { initSidebarLeft } from './components/SidebarLeft.js';
import { initSidebarRight, showRegionDetails } from './components/SidebarRight.js';
import { initMobileFAB } from './components/MobileFAB.js';
import { initMobileSheet } from './components/MobileSheet.js';
import { MapController } from './map/MapController.js';
import { exportData } from './export/ExportManager.js';

// Lazy-load AI module reference for region details
let aiModule = null;
async function getAIModule() {
  if (!aiModule) {
    aiModule = await import('./ai/AIAssistant.js');
  }
  return aiModule;
}

async function bootstrap() {
  setLoaderProgress(5);
  initI18n();
  initHeader();
  initMobileFAB();
  initMobileSheet();
  initSidebarRight();

  // Map controller (heaviest init, dynamic import inside)
  const mapContainer = document.getElementById('map');
  const mapCtrl = new MapController(mapContainer);

  mapCtrl.onSelectRegion = (name, props) => {
    setState({ selectedRegion: name });
    showRegionDetails(props);
    // Update KPIs
    const popEl = document.getElementById('kpi-pop');
    const dsiEl = document.getElementById('kpi-dsi');
    if (popEl) popEl.textContent = (props.population / 1e6).toFixed(1) + 'M';
    if (dsiEl) dsiEl.textContent = props.dsi.toFixed(1);
    // Update AI selected region
    getAIModule().then(m => m.setSelectedRegion(name));
  };

  mapCtrl.onSelectCountry = (name, props) => {
    // Could show country details in sidebar
  };

  // IMPORTANT: do NOT await this here. mapCtrl.init() blocks on the
  // basemap's first tile network response (map 'load' event), which can be
  // slow/rate-limited on public tile hosts (tile.openstreetmap.org etc).
  // The rest of the UI (search, sidebars, toolbar) must not be hostage to
  // that external, variable-latency dependency — wire it up in parallel.
  const mapReady = mapCtrl.init().then(() => {
    setState({ mapLoaded: true });
    return mapCtrl;
  });

  // Search — the input/listing works immediately (SearchEngine fetches its
  // own lightweight name lists); only flying to a result needs the map.
  initSearchEngine((type, name) => {
    mapReady.then(() => {
      if (type === 'department') {
        mapCtrl.flyToRegion(name);
        fetchDataset(CONFIG.DATA_URLS.colombia)
          .then(data => {
            const feat = data.features.find(f => f.properties.name === name);
            if (feat) {
              setState({ selectedRegion: name });
              showRegionDetails(feat.properties);
              getAIModule().then(m => m.setSelectedRegion(name));
            }
          });
      } else {
        mapCtrl.flyToCountry(name);
      }
    });
  });

  // Sidebars — render immediately; each control just waits on mapReady
  // internally the first time it's actually used, instead of blocking
  // the whole sidebar from existing at all.
  initSidebarLeft(
    { setLayer: (id) => mapReady.then(() => mapCtrl.setLayer(id)) },
    { setBasemap: (style) => mapReady.then(() => mapCtrl.setBasemap(style)) },
    { export: (type) => exportData(type) }
  );

  // Map controls — buttons are live right away; each handler awaits
  // mapReady before touching the map instance.
  initMapControls(mapCtrl, mapReady);

  // Window resize
  window.addEventListener('resize', debounce(() => {
    mapReady.then(() => mapCtrl.getMap()?.resize());
  }, 200));

  // Visibility change — reduce render load when hidden
  document.addEventListener('visibilitychange', () => {
    mapReady.then(() => {
      const map = mapCtrl.getMap();
      if (!map) return;
      if (document.hidden) {
        map.setPaintProperty('col-fill', 'fill-opacity', 0);
      } else {
        map.setPaintProperty('col-fill', 'fill-opacity', 0.8);
      }
    });
  });
}

function initMapControls(mapCtrl, mapReady) {
  const btn3d = document.getElementById('ctrl-3d');
  const btnMeasure = document.getElementById('ctrl-measure');
  const btnLocate = document.getElementById('ctrl-locate');
  const btnFullscreen = document.getElementById('ctrl-fullscreen');

  let is3D = false;
  if (btn3d) {
    btn3d.addEventListener('click', () => {
      is3D = !is3D;
      mapReady.then(() => mapCtrl.getMap()?.easeTo({ pitch: is3D ? 55 : 0, duration: 700 }));
    });
  }

  if (btnMeasure) {
    btnMeasure.addEventListener('click', () => {
      alert('Herramienta de medición: Haz clic en el mapa para medir distancias. (Demo)');
    });
  }

  if (btnLocate) {
    btnLocate.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((p) => {
          mapReady.then(() => mapCtrl.getMap()?.flyTo({
            center: [p.coords.longitude, p.coords.latitude],
            zoom: 10,
            duration: 1000,
          }));
        });
      }
    });
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
