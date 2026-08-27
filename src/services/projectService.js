const KEY = "adham-gis-ai.projects";
export function createProject(name = "Untitled Spatial Project") {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    map: {
      center: [-74, 4],
      zoom: 3,
      bearing: 0,
      pitch: 0,
      basemap: "streets"
    },
    layers: [],
    selectedFeature: null,
    filters: {},
    timeline: null,
    measurements: [],
    workflows: [],
    analyses: []
  };
}
export function saveProject(project) {
  const current = JSON.parse(localStorage.getItem(KEY) || "[]");
  const next = current.filter(p => p.id !== project.id);
  const saved = { ...project, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify([saved, ...next]));
  return saved;
}
export function loadProjects() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}
export function loadProject(id) {
  return loadProjects().find(p => p.id === id) || null;
}
