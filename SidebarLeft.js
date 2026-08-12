import { initLayerControls } from './LayerControls.js';
import { initBasemapGallery } from './BasemapGallery.js';
import { initExportPanel } from './ExportPanel.js';
import { initChartManager } from '../charts/ChartManager.js';
import { t } from '../utils/i18n.js';

export function initSidebarLeft(layerManager, basemapManager, exportManager) {
  const sidebar = document.getElementById('sidebar-left');
  const closeBtn = document.getElementById('close-left');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar?.classList.remove('open');
    });
  }

  initLayerControls(layerManager);
  initBasemapGallery(basemapManager);
  initExportPanel(exportManager);

  // Init charts lazily when sidebar is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initChartManager();
        observer.disconnect();
      }
    });
  });
  const chartsSection = document.getElementById('charts-section');
  if (chartsSection) observer.observe(chartsSection);
}
