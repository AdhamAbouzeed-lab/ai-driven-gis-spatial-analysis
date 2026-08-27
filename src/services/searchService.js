export function searchAll(query, datasets = []) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];
  for (const dataset of datasets) {
    for (const feature of dataset.features || []) {
      const p = feature.properties || {};
      const name = String(
        p.name ??
        p.NAME ??
        p.NAME_1 ??
        p.admin1 ??
        p.country ??
        p.Country ??
        ""
      );
      if (name.toLowerCase().includes(q)) {
        results.push({
          type: "location",
          title: name,
          feature,
          dataset: dataset.id || "dataset"
        });
      }
    }
  }
  return results.slice(0, 25);
}
