import React, { useState } from "react";
import { FolderKanban, Plus, Save } from "lucide-react";
import { createProject, loadProjects, saveProject } from "../services/projectService";
import { Link } from "react-router-dom";
export default function Projects() {
  const [projects, setProjects] = useState(loadProjects());
  function add() {
    const p = saveProject(createProject(`Spatial Project ${projects.length + 1}`));
    setProjects(loadProjects());
  }
  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">CONTENT</span><h1>Projects</h1><p>Persist map state, layers, analysis history and workflows.</p></div>
        <button className="button primary" onClick={add}><Plus size={15}/> New Project</button>
      </div>
      <div className="project-grid">
        {projects.length === 0 && (
          <div className="empty-card">
            <FolderKanban size={28}/>
            <h2>No projects yet</h2>
            <p>Create a project to persist workspace state locally.</p>
          </div>
        )}
        {projects.map(project => (
          <article className="project-card" key={project.id}>
            <FolderKanban size={21}/>
            <h2>{project.name}</h2>
            <p>Updated {new Date(project.updatedAt).toLocaleString()}</p>
            <div className="project-meta">
              <span>{project.layers.length} layers</span>
              <span>{project.analyses.length} analyses</span>
              <span>{project.workflows.length} workflows</span>
            </div>
            <Link to="/map" className="button"><Save size={14}/> Open workspace</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
