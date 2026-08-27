import React from "react";
import { ArrowRight, Bot, Database, Globe2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function Home() {
  const { t } = useTranslation();
  return (
    <section className="page home-page">
      <div className="hero">
        <div className="eyebrow"><Sparkles size={14}/> Spatial Intelligence Platform</div>
        <h1>{t("hero")}</h1>
        <p>
          A professional GIS workspace for discovering data, running spatial
          analysis, building workflows and turning geographic evidence into decisions.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/map">{t("exploreMap")} <ArrowRight size={16}/></Link>
          <Link className="button" to="/ai"><Bot size={16}/> {t("askAI")}</Link>
          <Link className="button" to="/projects">Create Project</Link>
        </div>
      </div>
      <div className="metric-grid">
        <div className="metric-card"><Globe2/><strong>GIS Workspace</strong><span>Map-first spatial intelligence</span></div>
        <div className="metric-card"><Database/><strong>Data Explorer</strong><span>Source-aware dataset architecture</span></div>
        <div className="metric-card"><Bot/><strong>Spatial Copilot</strong><span>Tool-based AI architecture</span></div>
      </div>
      <div className="section-heading">
        <div><span className="eyebrow">WORKSPACE</span><h2>Start with a spatial question</h2></div>
        <Link to="/map" className="text-link">Open workspace <ArrowRight size={15}/></Link>
      </div>
      <div className="feature-grid">
        {[
          ["Explore", "Search locations, inspect layers and understand source metadata.", "/map"],
          ["Analyze", "Run deterministic GIS, suitability and machine-learning operations.", "/analysis"],
          ["Build", "Turn repeatable analysis into reusable workflows.", "/workflows"],
          ["Explain", "Use registered GIS tools through the AI architecture.", "/ai"]
        ].map(([title, text, path]) => (
          <Link className="feature-card" to={path} key={title}>
            <h3>{title}</h3><p>{text}</p><ArrowRight size={17}/>
          </Link>
        ))}
      </div>
    </section>
  );
}
