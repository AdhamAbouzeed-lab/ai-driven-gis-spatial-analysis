import { t } from '../utils/i18n.js';
import { getDSIColor, getClusterColor } from '../config.js';
import { setState } from '../state.js';

export function initRegionDetails() {
  const container = document.getElementById('region-details');
  if (!container) return;

  // Default empty state
  container.innerHTML = `
    <div class="text-center py-6" style="color:var(--text-muted)">
      <svg class="mx-auto mb-2" style="opacity:0.5" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 3l18 18M3 21l18-18"/>
      </svg>
      <p class="text-xs" data-i18n="select_region"></p>
    </div>
  `;
}

export function renderRegionDetails(props) {
  const container = document.getElementById('region-details');
  if (!container || !props) return;

  const tierClass = props.tier === 'high'
    ? 'bg-green-500/15 text-green-400'
    : props.tier === 'medium'
    ? 'bg-yellow-500/15 text-yellow-400'
    : 'bg-red-500/15 text-red-400';

  const tierText = props.tier === 'high' ? t('high') : props.tier === 'medium' ? t('medium') : t('low');
  const color = getDSIColor(props.dsi);

  container.innerHTML = `
    <div class="animate-fade-in space-y-2">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
          ${props.name.charAt(0)}
        </div>
        <div>
          <h3 class="font-bold text-xs">${props.name}</h3>
          <p class="text-[10px] text-gray-500">${props.region} | ${props.capital}</p>
        </div>
        <span class="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold ${tierClass}">${tierText.toUpperCase()}</span>
      </div>
      <div class="grid grid-cols-2 gap-1.5">
        <div class="bg-gray-800 rounded-lg p-1.5 border border-gray-700">
          <p class="text-[9px] text-gray-500">${t('population')}</p>
          <p class="text-xs font-bold">${props.population.toLocaleString()}</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-1.5 border border-gray-700">
          <p class="text-[9px] text-gray-500">${t('area')}</p>
          <p class="text-xs font-bold">${props.area.toLocaleString()} km²</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-1.5 border border-gray-700">
          <p class="text-[9px] text-gray-500">${t('density')}</p>
          <p class="text-xs font-bold">${props.density.toFixed(1)} hab/km²</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-1.5 border border-gray-700">
          <p class="text-[9px] text-gray-500">${t('gdp_capita')}</p>
          <p class="text-xs font-bold">$${props.gdpCapita.toLocaleString()}</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-lg p-2 border border-gray-700">
        <div class="flex justify-between mb-1">
          <span class="text-[9px] text-gray-500">${t('dsi_score')}</span>
          <span class="text-[10px] font-bold">${props.dsi}/100</span>
        </div>
        <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700" style="width:${props.dsi}%;background:${color}"></div>
        </div>
      </div>
      <div class="bg-gray-800 rounded-lg p-2 border border-gray-700 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full" style="background:${getClusterColor(props.cluster)}"></span>
        <span class="text-[10px] font-medium">${t('cluster')} ${props.cluster}</span>
      </div>
      <div class="flex gap-1.5">
        <button id="btn-report" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-medium py-1.5 rounded-lg transition-colors">
          ${t('report')}
        </button>
        <button id="btn-whatif" class="flex-1 bg-accent-500 hover:bg-accent-600 text-white text-[10px] font-medium py-1.5 rounded-lg transition-colors">
          ${t('what_if')}
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-report')?.addEventListener('click', () => {
    setState({ aiPrompt: `report ${props.name}` });
  });
  document.getElementById('btn-whatif')?.addEventListener('click', () => {
    setState({ aiPrompt: `what if ${props.name}` });
  });
}
