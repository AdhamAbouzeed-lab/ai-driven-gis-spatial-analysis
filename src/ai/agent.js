import { invokeTool } from "./tools";
export function createAgent({ datasets, onAction }) {
  async function runTool(name, args) {
    const result = await invokeTool(name, args);
    onAction?.({ type: "tool-result", tool: name, result });
    return result;
  }
  return {
    async ask(question) {
      const text = String(question || "").trim();
      if (!text) {
        return { type: "message", text: "Ask a spatial question to begin." };
      }
      if (/population density/i.test(text)) {
        const dataset = datasets.find(d => d.id === "countries");
        return {
          type: "analysis",
          intent: "population_density",
          tool: "query_features",
          result: await runTool("query_features", {
            dataset,
            predicate: f => Number.isFinite(f.properties?.__density)
          })
        };
      }
      if (/buffer/i.test(text)) {
        return {
          type: "message",
          text: "A buffer operation requires a selected feature and distance. Select a feature on the map, then specify the distance in kilometers."
        };
      }
      if (/dsi|suitability/i.test(text)) {
        const dataset = datasets.find(d => d.id === "countries");
        const result = await runTool("run_dsi", {
          features: dataset?.features || [],
          config: {}
        });
        return {
          type: "analysis",
          intent: "development_suitability",
          tool: "run_dsi",
          result
        };
      }
      return {
        type: "message",
        text: "I can execute registered spatial tools such as dataset queries, statistics, buffers, centroids, DSI and K-Means. For external LLM reasoning, connect the AI service through the backend API adapter."
      };
    }
  };
}
