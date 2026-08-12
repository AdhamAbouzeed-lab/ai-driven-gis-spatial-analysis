export function initBasemapGallery(basemapManager) {
  const container = document.getElementById('basemap-gallery');
  if (!container) return;

  const basemaps = [
    { id: 'streets', label: 'streets', gradient: 'linear-gradient(135deg, #4b5563, #374151)' },
    { id: 'satellite', label: 'satellite', gradient: 'linear-gradient(135deg, #064e3b, #1e3a8a)' },
    { id: 'terrain', label: 'terrain', gradient: 'linear-gradient(135deg, #92400e, #78350f)' },
    { id: 'dark', label: 'dark', gradient: 'linear-gradient(135deg, #1f2937, #000000)' },
  ];

  container.innerHTML = basemaps.map(b => `
    <button class="basemap-btn ${b.id === 'streets' ? 'active' : ''}" data-style="${b.id}">
      <div class="basemap-thumb" style="background:${b.gradient}"></div>
      <span class="basemap-label" data-i18n="${b.label}"></span>
    </button>
  `).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.basemap-btn');
    if (!btn) return;
    const style = btn.dataset.style;
    basemapManager.setBasemap(style);
    container.querySelectorAll('.basemap-btn').forEach(b => b.classList.toggle('active', b === btn));
  });
}
