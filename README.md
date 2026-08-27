# ADHAM GIS AI
## AI-Powered Geospatial Intelligence & Spatial Decision Platform
ADHAM GIS AI is a map-first geospatial workspace designed around:
**ASK → ANALYZE → UNDERSTAND → DECIDE**
## Current architecture
- React + Vite
- MapLibre GL JS
- Turf.js geospatial operations
- deterministic DSI engine
- deterministic K-Means pipeline
- centralized layer registry
- source-aware dataset metadata
- tool-based AI architecture
- reusable workflow model
- project save/load architecture
- API service contracts
- i18n: English / Arabic / Spanish
- RTL support
- responsive desktop/tablet/mobile layout
- Vitest GIS tests
- code splitting
## Existing source data
The upgrade preserves the existing project datasets:
- `public/data/latam-countries.json`
- `public/data/colombia-departments.json`
No analytical value is generated with `Math.random()`.
Population density is derived from population / area only when both source attributes are available, otherwise the value remains unavailable.
GDP per capita is derived from GDP / population only when both source attributes are available, otherwise the value remains unavailable.
DSI uses deterministic min-max normalization and configurable weighted factors. Missing source variables are not silently replaced with fabricated values.
## AI architecture
The frontend exposes a registry of GIS tools:
- search_dataset
- query_features
- calculate_statistics
- buffer
- centroid
- run_dsi
- run_ml
External LLM inference is intentionally isolated behind `/api/ai/agent`.
This prevents the frontend from pretending that a browser-side keyword parser is a production AI agent.
## Backend contracts
The API client is prepared for:
- authentication
- projects
- analysis jobs
- AI agent execution
- GIS service
- data service
- ML service
- exports
Environment variable:
`VITE_API_BASE_URL`
No secret API keys should be placed in the frontend.
## Run
```text
npm install
npm run dev
````
## Production
```text
npm run build
npm run preview
```
## Tests
```text
npm test
```
## Rollback
Before the upgrade, the PowerShell installer creates:
`_backup_before_world_class_upgrade_<timestamp>`
Restore the backed-up files if required.
## Production backend recommendation
For server-scale GIS, analysis jobs, remote sensing, PostGIS, authentication, collaboration, API keys, rate limiting and real LLM tool-calling, connect the existing frontend service contracts to dedicated backend services rather than simulating those capabilities in the browser.
