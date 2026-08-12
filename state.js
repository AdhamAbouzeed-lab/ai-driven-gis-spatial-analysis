import { getLang } from './utils/i18n.js';

export const state = {
  lang: getLang(),
  theme: 'dark',
  currentLayer: 'dsi',
  selectedRegion: null,
  is3D: false,
  mapLoaded: false,
  datasets: {},
  sidebarLeftOpen: false,
  sidebarRightOpen: false,
  aiPanelOpen: false,
  chartsVisible: false,
};

const bus = new EventTarget();

export function setState(updates) {
  Object.assign(state, updates);
  bus.dispatchEvent(new CustomEvent('change', { detail: updates }));
}

export function onStateChange(cb) {
  bus.addEventListener('change', (e) => cb(e.detail));
}

export function getState() {
  return state;
}
