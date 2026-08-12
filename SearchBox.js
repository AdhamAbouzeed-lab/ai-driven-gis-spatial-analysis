import { debounce } from '../utils/debounce.js';
import { t } from '../utils/i18n.js';

export function initSearchBox(onSelect) {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  let deptNames = [];
  let countryNames = [];

  fetch('/data/colombia-departments.json')
    .then(r => r.json())
    .then(d => { deptNames = d.features.map(f => f.properties.name); });

  fetch('/data/latam-countries.json')
    .then(r => r.json())
    .then(d => { countryNames = d.features.map(f => f.properties.name); });

  const doSearch = debounce((query) => {
    if (query.length < 2) {
      results.classList.add('hidden');
      return;
    }
    const q = query.toLowerCase();
    const matches = [
      ...deptNames.filter(n => n.toLowerCase().includes(q)).map(n => ({ type: 'department', name: n })),
      ...countryNames.filter(n => n.toLowerCase().includes(q)).map(n => ({ type: 'country', name: n }))
    ].slice(0, 8);

    if (matches.length) {
      results.innerHTML = matches.map(m => `
        <button class="search-result-item" data-type="${m.type}" data-name="${m.name.replace(/"/g, '&quot;')}">
          <span>${m.name}</span>
          <span style="margin-left:auto;font-size:9px;color:var(--text-muted)">${m.type === 'department' ? 'Colombia' : 'LatAm'}</span>
        </button>
      `).join('');
      results.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          onSelect(btn.dataset.type, btn.dataset.name);
          results.classList.add('hidden');
          input.value = btn.dataset.name;
        });
      });
      results.classList.remove('hidden');
    } else {
      results.classList.add('hidden');
    }
  }, 250);

  input.addEventListener('input', (e) => doSearch(e.target.value));

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.add('hidden');
    }
  });
}
