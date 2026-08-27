import React, { useEffect, useState } from "react";
import { Database, ExternalLink, Layers3, Search } from "lucide-react";
import { loadDataset, datasetMetadata } from "../services/dataService";
export default function DataExplorer() {
  const [query, setQuery] = useState("");
  const [datasets, setDatasets] = useState([]);
  useEffect(() => {
    Promise.all([loadDataset("countries"), loadDataset("admin1")])
      .then(([countries, admin1]) => {
        setDatasets([
          { ...datasetMetadata("countries"), featureCount: countries.features.length },
          { ...datasetMetadata("admin1"), featureCount: admin1.features.length }
        ]);
      })
      .catch(console.error);
  }, []);
  const visible = datasets.filter(d => d.id.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">DISCOVER</span><h1>Data Explorer</h1><p>Source-aware datasets available to the workspace.</p></div>
        <div className="search-control"><Search size={16}/><input placeholder="Search datasets" value={query} onChange={e => setQuery(e.target.value)}/></div>
      </div>
      <div className="dataset-grid">
        {visible.map(dataset => (
          <article className="dataset-card" key={dataset.id}>
            <div className="dataset-icon"><Database size={20}/></div>
            <span className="eyebrow">VECTOR</span>
            <h2>{dataset.id}</h2>
            <p>{dataset.spatialCoverage}</p>
            <div className="metadata-list">
              <span><b>Features</b>{dataset.featureCount}</span>
              <span><b>CRS</b>{dataset.crs}</span>
              <span><b>Version</b>{dataset.version}</span>
              <span><b>Quality</b>{dataset.quality}</span>
            </div>
            <div className="card-actions">
              <a href="/map"><Layers3 size={15}/> Add to Map</a>
              <a href="#"><ExternalLink size={15}/> Details</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
