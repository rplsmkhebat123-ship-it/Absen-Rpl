/* Mode terang/gelap. Dimuat di <head> supaya tema terpasang sebelum halaman tampil. */
(() => {
  const simpan = () => { try { return localStorage.getItem('tema'); } catch (_) { return null; } };
  const atur = t => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('tema', t); } catch (_) {}
    const b = document.getElementById('btnTema');
    if (b) b.querySelector('span').textContent = t === 'terang' ? 'Mode gelap' : 'Mode terang';
  };
  document.documentElement.dataset.theme = simpan() || 'gelap';
  addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('btnTema');
    if (!b) return;
    atur(document.documentElement.dataset.theme);
    b.addEventListener('click', () => atur(document.documentElement.dataset.theme === 'terang' ? 'gelap' : 'terang'));
  });
})();