import { CONFIG } from '../config.js';
import { setLoaderProgress, hideLoader, rAF } from '../utils/perf.js';
import { fetchDataset } from '../utils/cache.js';
import { initLayerManager } from './LayerManager.js';
import { initBasemapManager } from './BasemapManager.js';
import { initInteractionManager } from './InteractionManager.js';

export class MapController {
  constructor(container) {
    this.container = container;
    this.map = null;
    this.maplibregl = null;
    this.layerManager = null;
    this.basemapManager = null;
    this.interactionManager = null;
    this._onSelectRegion = null;
  }

  async init() {
    setLoaderProgress(20);

    // Dynamic import of MapLibre
    const mod = await import('maplibre-gl');
    this.maplibregl = mod.default;
    await import('maplibre-gl/dist/maplibre-gl.css');

    setLoaderProgress(40);
    await new Promise((r) => rAF(r));

    this.map = new this.maplibregl.Map({
      container: this.container,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [CONFIG.BASEMAPS.streets],
            tileSize: 256,
            attribution: '© OSM',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: CONFIG.MAP.center,
      zoom: CONFIG.MAP.zoom,
      pitch: CONFIG.MAP.pitch,
      bearing: CONFIG.MAP.bearing,
      antialias: false,
      maxTileCacheSize: 200,
      renderWorldCopies: false,
    });

    setLoaderProgress(55);

    await new Promise((resolve) => this.map.on('load', resolve));

    // Load datasets
    const [colData, latamData] = await Promise.all([
      fetchDataset(CONFIG.DATA_URLS.colombia),
      fetchDataset(CONFIG.DATA_URLS.latam),
    ]);

    setLoaderProgress(70);

    this.layerManager = initLayerManager(this.map, this.maplibregl, colData, latamData);
    this.basemapManager = initBasemapManager(this.map);
    this.interactionManager = initInteractionManager(this.map, this.maplibregl, colData, latamData);

    this.interactionManager.onSelectRegion = (name, props) => {
      if (this._onSelectRegion) this._onSelectRegion(name, props);
    };

    this.interactionManager.onSelectCountry = (name, props) => {
      if (this._onSelectCountry) this._onSelectCountry(name, props);
    };

    setLoaderProgress(100);
    setTimeout(() => hideLoader(), 400);

    return this;
  }

  setLayer(layerId) {
    this.layerManager?.setLayer(layerId);
  }

  setBasemap(style) {
    this.basemapManager?.setBasemap(style);
  }

  flyToRegion(name) {
    this.interactionManager?.flyToRegion(name);
  }

  flyToCountry(name) {
    this.interactionManager?.flyToCountry(name);
  }

  getMap() {
    return this.map;
  }

  getCanvas() {
    return this.map?.getCanvas();
  }

  set onSelectRegion(cb) {
    this._onSelectRegion = cb;
  }

  set onSelectCountry(cb) {
    this._onSelectCountry = cb;
  }

  destroy() {
    this.map?.remove();
    this.map = null;
  }
}
