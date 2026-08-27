import React from "react";
import { useParams } from "react-router-dom";
import { Construction, ShieldCheck } from "lucide-react";
const descriptions = {
  dashboards: "Dashboard Builder architecture for maps, KPIs, charts, tables, filters and statistics.",
  reports: "Report Builder architecture for executive summaries, methodology, maps, charts, results and references.",
  compare: "Synchronized comparison workspace for countries, regions and cities.",
  explore: "Public exploration surface for maps, datasets, workflows and templates.",
  profile: "User profile and activity.",
  team: "Organization, teams, roles and permissions.",
  settings: "Application preferences, language, theme and service configuration.",
  monitoring: "Monitoring architecture for urban growth, deforestation, fire, flood, drought and climate.",
  "remote-sensing": "Remote sensing architecture for Landsat, Sentinel, MODIS, spectral indices and change detection.",
  developer: "API, JavaScript SDK, Python SDK, REST, webhooks and MCP architecture."
};
export default function GenericPage() {
  const { page } = useParams();
  const description = descriptions[page] || "Platform workspace.";
  return (
    <section className="page centered-page">
      <Construction size={32}/>
      <span className="eyebrow">ADHAM GIS AI</span>
      <h1>{page?.replaceAll("-", " ")}</h1>
      <p>{description}</p>
      <div className="architecture-note">
        <ShieldCheck size={17}/>
        <span>This surface is connected to the centralized application architecture and is ready for its backend service contract.</span>
      </div>
    </section>
  );
}
