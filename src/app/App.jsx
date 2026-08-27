import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bot,
  Database,
  FileText,
  FolderKanban,
  Globe2,
  Layers3,
  Menu,
  Moon,
  Network,
  Search,
  Settings,
  Sparkles,
  Sun,
  Workflow,
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";
import MapWorkspace from "../pages/MapWorkspace";
import Home from "../pages/Home";
import DataExplorer from "../pages/DataExplorer";
import Analysis from "../pages/Analysis";
import Workflows from "../pages/Workflows";
import AILab from "../pages/AILab";
import Projects from "../pages/Projects";
import GenericPage from "../pages/GenericPage";
const pages = {
  data: DataExplorer,
  analysis: Analysis,
  workflows: Workflows,
  ai: AILab,
  projects: Projects
};
function Shell() {
  const { t } = useTranslation();
  const [mobile, setMobile] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem("adham.theme") !== "light");
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("adham.theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const nav = [
    { label: t("map"), path: "/map", icon: Globe2 },
    { label: t("data"), path: "/data", icon: Database },
    { label: t("analysis"), path: "/analysis", icon: BarChart3 },
    { label: t("workflows"), path: "/workflows", icon: Workflow },
    { label: t("aiLab"), path: "/ai", icon: Bot },
    { label: t("projects"), path: "/projects", icon: FolderKanban }
  ];
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobile(!mobile)}>
          {mobile ? <X size={20}/> : <Menu size={20}/>}
        </button>
        <Link to="/" className="brand">
          <span className="brand-mark"><Layers3 size={20}/></span>
          <span>{t("brand")}</span>
        </Link>
        <div className="global-search">
          <Search size={17}/>
          <input
            id="global-search"
            placeholder="Search countries, regions, datasets, projects..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                navigate(`/map?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
              }
            }}
          />
          <kbd>Ctrl K</kbd>
        </div>
        <div className="top-actions">
          <button title="Toggle theme" onClick={() => setDark(v => !v)}>
            {dark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          <Link to="/settings"><Settings size={18}/></Link>
        </div>
      </header>
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="side-section">
          <div className="side-title">{t("workspace")}</div>
          {nav.slice(0, 5).map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobile(false)}
                className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
              >
                <Icon size={17}/>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
        <div className="side-section">
          <div className="side-title">{t("content")}</div>
          {[
            ["Projects", "/projects", FolderKanban],
            ["Dashboards", "/dashboards", BarChart3],
            ["Reports", "/reports", FileText],
            ["Compare", "/compare", Activity]
          ].map(([label, path, Icon]) => (
            <NavLink key={path} to={path} onClick={() => setMobile(false)} className="nav-item">
              <Icon size={17}/><span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="side-section">
          <div className="side-title">{t("explore")}</div>
          {[
            ["Explore", "/explore", Search],
            ["Remote Sensing", "/remote-sensing", Globe2],
            ["Monitoring", "/monitoring", Activity]
          ].map(([label, path, Icon]) => (
            <NavLink key={path} to={path} onClick={() => setMobile(false)} className="nav-item">
              <Icon size={17}/><span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="side-section">
          <div className="side-title">{t("develop")}</div>
          <NavLink to="/developer" className="nav-item">
            <Network size={17}/><span>Developer</span>
          </NavLink>
        </div>
        <div className="side-bottom">
          <NavLink to="/settings" className="nav-item">
            <Settings size={17}/><span>{t("settings")}</span>
          </NavLink>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapWorkspace />} />
          <Route path="/data" element={<DataExplorer />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/ai" element={<AILab />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/:page" element={<GenericPage />} />
        </Routes>
      </main>
    </div>
  );
}
export default function App() {
  return <Shell />;
}
