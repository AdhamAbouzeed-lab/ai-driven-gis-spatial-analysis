/**
 * GIS Web Worker — heavy spatial calculations off the main thread
 */

function computeBoundingBox(coords) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const ring of coords) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return [[minX, minY], [maxX, maxY]];
}

function computeCentroid(coords) {
  let x = 0, y = 0, n = 0;
  for (const ring of coords) {
    for (const [px, py] of ring) {
      x += px;
      y += py;
      n++;
    }
  }
  return n ? [x / n, y / n] : [0, 0];
}

function kMeans(points, k, maxIter = 100) {
  const n = points.length;
  if (k > n) k = n;
  let centroids = points.slice(0, k).map(p => [...p]);
  const assignments = new Uint8Array(n);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    for (let i = 0; i < n; i++) {
      let best = 0;
      let bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const dx = points[i][0] - centroids[c][0];
        const dy = points[i][1] - centroids[c][1];
        const d = dx * dx + dy * dy;
        if (d < bestDist) {
          bestDist = d;
          best = c;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
    }
    if (!changed) break;

    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      sums[c][0] += points[i][0];
      sums[c][1] += points[i][1];
      sums[c][2]++;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c][2]) {
        centroids[c][0] = sums[c][0] / sums[c][2];
        centroids[c][1] = sums[c][1] / sums[c][2];
      }
    }
  }
  return { assignments: Array.from(assignments), centroids };
}

self.onmessage = (e) => {
  const { id, type, payload } = e.data;
  try {
    let result;
    switch (type) {
      case 'bbox': {
        result = computeBoundingBox(payload.coords);
        break;
      }
      case 'centroid': {
        result = computeCentroid(payload.coords);
        break;
      }
      case 'cluster': {
        result = kMeans(payload.points, payload.k || 5);
        break;
      }
      case 'stats': {
        const arr = payload.values;
        const sum = arr.reduce((a, b) => a + b, 0);
        const mean = sum / arr.length;
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
        result = { sum, mean, min, max, std: Math.sqrt(variance) };
        break;
      }
      default:
        throw new Error('Unknown worker task: ' + type);
    }
    self.postMessage({ id, success: true, result });
  } catch (err) {
    self.postMessage({ id, success: false, error: err.message });
  }
};
