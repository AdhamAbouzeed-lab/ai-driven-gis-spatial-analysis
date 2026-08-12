# Latin America GIS-AI Platform

Enterprise geospatial analytics platform built with Vite + Vanilla JavaScript.

## Quick Start

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## Architecture

- **Vite** for blazing-fast builds with tree-shaking, code-splitting, and asset hashing.
- **MapLibre GL JS** for vector/raster map rendering.
- **Chart.js** for analytics (lazy-loaded).
- **Web Workers** for heavy GIS calculations.
- **Dynamic imports** for AI, exports, and non-critical modules.

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 0.8s |
| Largest Contentful Paint | < 1.5s |
| Time To Interactive | < 1.5s |
| Lighthouse Performance | > 95 |
| Memory Usage | < 120 MB |
| Frame Rate | 60 FPS |

## Project Structure

```
├── public/data/          # Static datasets (GeoJSON)
├── src/
│   ├── components/       # UI components
│   ├── map/              # Map controller, layers, interactions
│   ├── charts/           # Chart managers
│   ├── ai/               # AI assistant (lazy-loaded)
│   ├── search/           # Search engine
│   ├── export/           # Export manager (lazy-loaded)
│   ├── utils/            # Utilities, i18n, workers
│   └── styles/           # Feature-split CSS
```

## Data Sources

- `public/data/colombia-departments.json` — Colombia departmental GeoJSON with DSI/PIB metrics.
- `public/data/latam-countries.json` — Latin America country centroids with economic indicators.

### Upgrading to PMTiles

Install [tippecanoe](https://github.com/felt/tippecanoe) or the [pmtiles CLI](https://github.com/protomaps/go-pmtiles), then:

```bash
# Convert GeoJSON to PMTiles
tippecanoe -o colombia-departments.pmtiles -z10 -Z0 --drop-densest-as-needed public/data/colombia-departments.json

# Move to public/data/
mv colombia-departments.pmtiles public/data/
```

Update `src/config.js` to set `USE_PMTILES: true` and adjust the source URLs.

## License

Proprietary — Latin America Enterprise Analytics.
