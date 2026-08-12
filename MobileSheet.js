export function initMobileSheet() {
  const sheet = document.getElementById('mobile-sheet');
  if (!sheet) return;

  const handle = sheet.querySelector('.sheet-handle');
  if (handle) {
    handle.addEventListener('click', () => {
      sheet.classList.remove('open');
      setTimeout(() => sheet.classList.add('hidden'), 300);
    });
  }
}
