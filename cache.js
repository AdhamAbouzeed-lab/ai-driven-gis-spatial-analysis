const _cache = new Map();

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
export function fetchDataset(url) {
  if (_cache.has(url)) {
    return _cache.get(url);
  }
  // Store the in-flight promise immediately (not just the resolved value) so
  // concurrent callers within the same tick share one network request
  // instead of each missing the cache and firing their own fetch.
  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      return res.json();
    })
    .catch((err) => {
      _cache.delete(url); // don't cache failures
      throw err;
    });
  _cache.set(url, promise);
  return promise;
}

/**
 * @param {string} url
 * @returns {boolean}
 */
export function isCached(url) {
  return _cache.has(url);
}

/**
 * @param {string} url
 */
export function invalidateCache(url) {
  _cache.delete(url);
}
