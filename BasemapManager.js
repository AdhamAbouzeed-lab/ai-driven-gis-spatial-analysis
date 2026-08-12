import { CONFIG } from '../config.js';

export function initBasemapManager(map) {
  return {
    setBasemap(style) {
      const url = CONFIG.BASEMAPS[style];
      if (!url || !map) return;
      const src = map.getSource('osm');
      if (src && src.tiles) {
        src.tiles = [url];
        // Force refresh
        const cache = map.style.sourceCaches['osm'];
        if (cache) {
          cache.clearTiles();
          cache.update(map.transform);
        }
      }
    },
  };
}
