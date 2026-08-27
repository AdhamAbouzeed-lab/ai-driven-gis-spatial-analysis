function distance(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2;
  return Math.sqrt(s);
}
function standardize(rows) {
  const dims = rows[0].length;
  const means = Array(dims).fill(0);
  const stds = Array(dims).fill(0);
  for (const row of rows) {
    row.forEach((v, i) => means[i] += v);
  }
  means.forEach((_, i) => means[i] /= rows.length);
  for (const row of rows) {
    row.forEach((v, i) => stds[i] += (v - means[i]) ** 2);
  }
  stds.forEach((_, i) => {
    stds[i] = Math.sqrt(stds[i] / rows.length) || 1;
  });
  return rows.map(row => row.map((v, i) => (v - means[i]) / stds[i]));
}
function initialCentroids(rows, k) {
  const result = [];
  const step = Math.max(1, Math.floor(rows.length / k));
  for (let i = 0; i < k; i++) {
    result.push([...rows[Math.min(i * step, rows.length - 1)]]);
  }
  return result;
}
export function kMeans(features, fields, k = 4, maxIterations = 50) {
  const usable = features
    .map((f, index) => ({
      index,
      values: fields.map(field => Number(f.properties?.[field]))
    }))
    .filter(x => x.values.every(Number.isFinite));
  if (usable.length < k) {
    throw new Error(`K-Means requires at least ${k} complete observations.`);
  }
  const matrix = standardize(usable.map(x => x.values));
  let centroids = initialCentroids(matrix, k);
  let labels = Array(matrix.length).fill(-1);
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const next = matrix.map(row => {
      let best = 0;
      let bestDistance = Infinity;
      centroids.forEach((c, i) => {
        const d = distance(row, c);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return best;
    });
    if (next.every((x, i) => x === labels[i])) {
      labels = next;
      break;
    }
    labels = next;
    for (let c = 0; c < k; c++) {
      const members = matrix.filter((_, i) => labels[i] === c);
      if (members.length) {
        centroids[c] = members[0].map((_, d) =>
          members.reduce((sum, row) => sum + row[d], 0) / members.length
        );
      }
    }
  }
  const output = features.map(f => ({ ...f, properties: { ...f.properties } }));
  usable.forEach((u, i) => {
    output[u.index].properties.__mlCluster = labels[i];
  });
  return {
    features: output,
    metadata: {
      algorithm: "K-Means",
      parameters: { k, maxIterations },
      features: fields,
      modelVersion: "kmeans-v1",
      trainingDate: new Date().toISOString(),
      observations: usable.length
    }
  };
}
