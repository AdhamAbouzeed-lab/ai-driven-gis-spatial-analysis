import { setState } from '../state.js';

export function initMobileFAB() {
  const analyticsFab = document.getElementById('fab-analytics');
  const aiFab = document.getElementById('fab-ai');

  if (analyticsFab) {
    analyticsFab.addEventListener('click', () => {
      const sheet = document.getElementById('mobile-sheet');
      if (sheet) {
        sheet.classList.remove('hidden');
        requestAnimationFrame(() => sheet.classList.add('open'));
      }
    });
  }

  if (aiFab) {
    aiFab.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar-right');
      sidebar?.classList.toggle('open');
      setState({ sidebarRightOpen: sidebar?.classList.contains('open') });
    });
  }
}
