const rAF = requestAnimationFrame;
const rIC = typeof requestIdleCallback !== 'undefined'
  ? requestIdleCallback
  : (cb) => setTimeout(cb, 1);

export { rAF, rIC };

/**
 * @param {number} pct
 */
export function setLoaderProgress(pct) {
  const bar = document.getElementById('loader-bar-fill');
  if (bar) bar.style.width = pct + '%';
}

/**
 * Hide loader with fade-out
 */
export function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.classList.add('hidden');
  setTimeout(() => {
    loader.style.display = 'none';
  }, 500);
}
