import { initRegionDetails, renderRegionDetails } from './RegionDetails.js';
import { initChatPanel } from './ChatPanel.js';
import { setState } from '../state.js';

export function initSidebarRight() {
  const sidebar = document.getElementById('sidebar-right');
  const closeBtn = document.getElementById('close-right');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar?.classList.remove('open');
      setState({ sidebarRightOpen: false });
    });
  }

  initRegionDetails();
  initChatPanel();
}

export function showRegionDetails(props) {
  renderRegionDetails(props);
  const sidebar = document.getElementById('sidebar-right');
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add('open');
    setState({ sidebarRightOpen: true });
  }
}
