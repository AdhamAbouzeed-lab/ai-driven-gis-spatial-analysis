import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Search, Layers3, Info, Ruler, Save, RefreshCw, Database, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { loadDataset, normalizeProperties, datasetMetadata } from "../services/dataService";
import { calculateDSI, explainDSI } from "../services/suitabilityService";
import { kMeans } from "../services/mlService";
import { saveProject, createProject } from "../services/projectService";
import { layerRegistry } from "../data/layers";
import { LAYERS } from "../types/core";
const SOURCE_ID = "adham-countries";
const FILL_ID = "adham-countries-fill";
const LINE_ID = "adham-countries-line";
function getName(f) {
  const p = f.properties || {};
  return p.name ?? p.NAME ?? p.country ?? p.Country ?? p.NAME_1 ?? "Unknown";
}
export default function MapWorkspace() {
  const mapRef = useRef(null);
  const mapContainer = useRef(null);
  const [searchParams] = useSearchParams();
  const [countries, setCountries] = useState({type:"FeatureCollection",features:[]});
  const [selected, setSelected] = useState(null);
  const [activeLayer, setActiveLayer] = useState(LAYERS.COUNTRIES);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Loading source-backed data...");
  const [project] = useState(() => createProject("Spatial Intelligence Workspace"));
  useEffect(() => {
    let alive = true;
    Promise.all([
      loadDataset("countries"),
      loadDataset("admin1")
    ])
      .then(([fc]) => {
        if (!alive) return;
        const normalized = normalizeProperties(fc);
        setCountries(normalized);
        setLoading(false);
        setStatus(`${normalized.features.length} source features loaded`);
      })
      .catch(err => {
        setLoading(false);
        setStatus(err.message);
      });
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-72, 3],
      zoom: 3,
      attributionControl: true
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");
    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] }
      });
      map.addLayer({
        id: FILL_ID,
        type: "fill",
        source: SOURCE_ID,
        paint: {
          "fill-color": [
            "case",
            ["has", "__dsi"],
            ["interpolate", ["linear"], ["get", "__dsi"],
              0, "#8b1e3f",
              25, "#c56a39",
              50, "#d5bd52",
              75, "#65a36b",
              100, "#207a65"
            ],
            "#17314a"
          ],
          "fill-opacity": 0.42
        }
      });
      map.addLayer({
        id: LINE_ID,
        type: "line",
        source: SOURCE_ID,
        paint: {
          "line-color": "#8db7d6",
          "line-width": 1.2,
          "line-opacity": 0.9
        }
      });
      map.on("click", FILL_ID, e => {
        const feature = e.features?.[0];
        if (feature) setSelected(feature);
      });
      map.on("mouseenter", FILL_ID, () => map.getCanvas().style.cursor = "pointer");
      map.on("mouseleave", FILL_ID, () => map.getCanvas().style.cursor = "");
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource(SOURCE_ID);
    if (source) source.setData(countries);
  }, [countries]);
  useEffect(() => {
    const q = searchParams.get("q");
    if (!q || !mapRef.current || !countries.features.length) return;
    const match = countries.features.find(f =>
      getName(f).toLowerCase().includes(q.toLowerCase())
    );
    if (match) {
      const bounds = new maplibregl.LngLatBounds();
      const coords = match.geometry?.coordinates;
      const visit = (c) => {
        if (!Array.isArray(c)) return;
        if (typeof c[0] === "number") bounds.extend(c);
        else c.forEach(visit);
      };
      visit(coords);
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, { padding: 80, duration: 900 });
        setSelected(match);
      }
    }
  }, [searchParams, countries]);
  function applyDSI() {
    const result = calculateDSI(countries.features, {});
    setCountries({ ...countries, features: result });
    setActiveLayer(LAYERS.DSI);
    setStatus("DSI calculated from available source variables using deterministic normalization.");
  }
  function applyML() {
    const fields = ["__population", "__gdpPerCapita"];
    try {
      const result = kMeans(countries.features, fields, 4);
      setCountries({ ...countries, features: result.features });
      setActiveLayer(LAYERS.ML_CLUSTERS);
      setStatus(`K-Means completed on ${result.metadata.observations} complete observations.`);
    } catch (e) {
      setStatus(e.message);
    }
  }
  function save() {
    saveProject({
      ...project,
      map: {
        ...project.map,
        center: mapRef.current?.getCenter().toArray() || project.map.center,
        zoom: mapRef.current?.getZoom() || project.map.zoom,
        bearing: mapRef.current?.getBearing() || 0,
        pitch: mapRef.current?.getPitch() || 0
      },
      selectedFeature: selected,
      layers: [activeLayer]
    });
    setStatus("Project state saved locally.");
  }
  return (
    <section className="map-page">
      <div className="map-toolbar">
        <div>
          <strong>Map Workspace</strong>
          <span>{status}</span>
        </div>
        <div className="toolbar-actions">
          <button onClick={applyDSI}><ActivityIcon/> DSI</button>
          <button onClick={applyML}><RefreshCw size={15}/> ML</button>
          <button onClick={save}><Save size={15}/> Save</button>
        </div>
      </div>
      <div className="map-layout">
        <aside className="map-panel left-panel">
          <div className="panel-title"><Layers3 size={17}/> Layers</div>
          {layerRegistry.map(layer => (
            <button
              key={layer.id}
              className={`layer-row ${activeLayer === layer.id ? "selected" : ""}`}
              onClick={() => setActiveLayer(layer.id)}
            >
              <span className="layer-dot"/>
              <span>{layer.name}</span>
            </button>
          ))}
          <div className="panel-divider"/>
          <div className="panel-title"><Database size={17}/> Source</div>
          <p className="muted">
            {datasetMetadata("countries").spatialCoverage}
          </p>
          <p className="muted">
            Density is calculated only from population / area when source attributes exist.
          </p>
        </aside>
        <div className="map-canvas" ref={mapContainer}>
          {loading && <div className="map-loading">Loading geospatial data…</div>}
        </div>
        <aside className="map-panel right-panel">
          {!selected ? (
            <>
              <div className="panel-title"><Info size={17}/> Explore</div>
              <h3>Select a geographic feature</h3>
              <p className="muted">
                Click a polygon to inspect its source attributes, analytical metrics,
                provenance and DSI explainability.
              </p>
            </>
          ) : (
            <>
              <div className="inspector-header">
                <div>
                  <span className="eyebrow">FEATURE</span>
                  <h2>{getName(selected)}</h2>
                </div>
                <button onClick={() => setSelected(null)}><X size={17}/></button>
              </div>
              <div className="inspector-grid">
                <Metric label="Population" value={selected.properties?.__population}/>
                <Metric label="Density" value={selected.properties?.__density} suffix=" people/km²"/>
                <Metric label="GDP / capita" value={selected.properties?.__gdpPerCapita}/>
                <Metric label="DSI" value={selected.properties?.__dsi}/>
              </div>
              {selected.properties?.__dsi !== undefined && (
                <div className="inspector-section">
                  <div className="panel-title">DSI Explainability</div>
                  {Object.entries(explainDSI(selected).contributions || {}).map(([key, value]) => (
                    <div className="contribution" key={key}>
                      <span>{key}</span><strong>{Number(value).toFixed(1)}</strong>
                    </div>
                  ))}
                  <p className="muted">{explainDSI(selected).limitations}</p>
                </div>
              )}
              <div className="inspector-section">
                <div className="panel-title">Provenance</div>
                <div className="metadata-row"><span>Dataset</span><b>latam-countries</b></div>
                <div className="metadata-row"><span>Version</span><b>1</b></div>
                <div className="metadata-row"><span>Geometry</span><b>{selected.geometry?.type || "Unknown"}</b></div>
                <div className="metadata-row"><span>Method</span><b>Source-backed</b></div>
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
function Metric({label, value, suffix=""}) {
  return (
    <div className="inspector-metric">
      <span>{label}</span>
      <strong>{value === null || value === undefined ? "-" : Number(value).toLocaleString(undefined,{maximumFractionDigits:2}) + suffix}</strong>
    </div>
  );
}
function ActivityIcon() {
  return <Ruler size={15}/>;
}
