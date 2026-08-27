const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API request failed: ${response.status}`);
  }
  const type = response.headers.get("content-type") || "";
  return type.includes("application/json") ? response.json() : response.text();
}
export const api = {
  auth: {
    me: () => apiRequest("/api/auth/me")
  },
  projects: {
    list: () => apiRequest("/api/projects"),
    create: body => apiRequest("/api/projects", {
      method: "POST",
      body: JSON.stringify(body)
    })
  },
  analysis: {
    submit: body => apiRequest("/api/analysis/jobs", {
      method: "POST",
      body: JSON.stringify(body)
    }),
    status: id => apiRequest(`/api/analysis/jobs/${encodeURIComponent(id)}`)
  },
  ai: {
    invoke: body => apiRequest("/api/ai/agent", {
      method: "POST",
      body: JSON.stringify(body)
    })
  }
};
