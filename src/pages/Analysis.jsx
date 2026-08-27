import React, { useState } from "react";
import { Activity, BarChart3, BrainCircuit, CheckCircle2, Network, Play, ShieldCheck } from "lucide-react";
import { createJob } from "../services/jobService";
import { calculateStatistics } from "../services/gisService";
const tools = [
  ["Vector", "Buffer, intersection, centroid, distance and spatial operations.", Activity],
  ["Raster", "Raster Calculator, reclassify, terrain and remote-sensing architecture.", BarChart3],
  ["Statistics", "Descriptive statistics, spatial statistics and hotspot architecture.", BarChart3],
  ["Network", "Shortest path, accessibility and service-area architecture.", Network],
  ["Suitability", "Deterministic weighted suitability and explainability.", ShieldCheck],
  ["ML", "K-Means and extensible clustering pipeline.", BrainCircuit]
];
export default function Analysis() {
  const [job, setJob] = useState(null);
  async function run() {
    const j = createJob("statistics", async progress => {
      progress(35);
      await new Promise(r => setTimeout(r, 250));
      progress(70);
      await new Promise(r => setTimeout(r, 250));
      return calculateStatistics([10,20,30,40,50]);
    });
    j.subscribe(setJob);
    setJob({...j});
    await j.run();
  }
  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">ANALYZE</span><h1>Analysis Center</h1><p>Unified entry point for spatial analysis jobs.</p></div>
        <button className="button primary" onClick={run}><Play size={15}/> Run Test Job</button>
      </div>
      {job && (
        <div className="job-card">
          <div><strong>{job.type}</strong><span>{job.status}</span></div>
          <div className="progress"><span style={{width:`${job.progress}%`}}/></div>
          <small>{job.progress}%</small>
          {job.result && <pre>{JSON.stringify(job.result, null, 2)}</pre>}
        </div>
      )}
      <div className="analysis-grid">
        {tools.map(([name, description, Icon]) => (
          <article className="analysis-card" key={name}>
            <div className="analysis-icon"><Icon size={21}/></div>
            <h2>{name}</h2>
            <p>{description}</p>
            <div className="status-line"><CheckCircle2 size={14}/> Architecture ready</div>
          </article>
        ))}
      </div>
    </section>
  );
}
