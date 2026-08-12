import { t, setLang } from '../utils/i18n.js';
import { setState } from '../state.js';

export function initHeader() {
  const themeBtn = document.getElementById('btn-theme');
  const langBtn = document.getElementById('btn-lang');
  const langMenu = document.getElementById('lang-menu');
  const moonIcon = document.getElementById('icon-moon');
  const sunIcon = document.getElementById('icon-sun');
  const menuBtn = document.getElementById('btn-menu');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      if (moonIcon) moonIcon.classList.toggle('hidden', isDark);
      if (sunIcon) sunIcon.classList.toggle('hidden', !isDark);
      setState({ theme: isDark ? 'dark' : 'light' });
    });
  }

  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu?.classList.toggle('hidden');
    });
  }

  document.addEventListener('click', (e) => {
    if (langMenu && !langMenu.contains(e.target) && e.target !== langBtn) {
      langMenu.classList.add('hidden');
    }
  });

  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLang(lang);
      setState({ lang });
      langMenu?.classList.add('hidden');
    });
  });

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar-left');
      sidebar?.classList.toggle('open');
      setState({ sidebarLeftOpen: sidebar?.classList.contains('open') });
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    }
  });
}
