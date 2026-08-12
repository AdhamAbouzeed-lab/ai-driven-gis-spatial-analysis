export function initExportPanel(exportManager) {
  const container = document.getElementById('export-panel');
  if (!container) return;

  const exports = [
    { id: 'png', label: 'PNG', class: 'png', icon: 'M3 3h18v18H3zM8.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM21 15l-5-5L5 21' },
    { id: 'csv', label: 'CSV', class: 'csv', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM16 13H8M16 17H8M10 9H8' },
    { id: 'pdf', label: 'PDF', class: 'pdf', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM16 13H8M16 17H8M10 9H8' },
    { id: 'excel', label: 'Excel', class: 'excel', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM16 13H8M16 17H8M10 9H8' },
  ];

  container.innerHTML = exports.map(e => `
    <button class="export-btn ${e.class}" data-export="${e.id}">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${e.icon}"/></svg>
      ${e.label}
    </button>
  `).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.export-btn');
    if (!btn) return;
    const type = btn.dataset.export;
    exportManager.export(type);
  });
}
