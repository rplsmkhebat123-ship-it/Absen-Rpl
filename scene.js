/* Latar: parallax mengikuti kursor + debu cahaya. Dipakai di semua halaman. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Parallax halus
  const layer = document.querySelector('.parallax');

  // Blok melayang: tiap blok punya ukuran, arah, dan tempo sendiri
  const R = (a, b) => a + Math.random() * (b - a);
  const bentuk = ['polygon(0 0,100% 4%,100% 100%,0 92%)', 'polygon(8% 0,100% 0,92% 100%,0 100%)',
                  'polygon(0 0,100% 0,100% 85%,60% 100%,0 90%)'];
  const wadah = document.createElement('div'); wadah.className = 'blocks'; layer.append(wadah);
  for (let i = 0; i < (innerWidth < 700 ? 7 : 12); i++) {
    const b = document.createElement('i'), w = R(1.6, 4.6), jauh = w < 2.6;
    Object.assign(b.style, { width: w + 'vmin', height: w * R(1.5, 3.4) + 'vmin',
      left: R(3, 95) + '%', top: R(4, 58) + '%', clipPath: bentuk[i % 3],
      opacity: jauh ? 0.55 : 0.9, filter: jauh ? 'blur(1.5px)' : 'none' });
    const v = (k, x) => b.style.setProperty(k, x);
    v('--r', R(-14, 14) + 'deg'); v('--dr', R(-10, 10) + 'deg');
    v('--dx', R(-30, 30) + 'px'); v('--dy', -R(14, 46) + 'px');
    v('--dur', R(9, 17) + 's'); v('--del', -R(0, 12) + 's');
    wadah.append(b);
  }
  let tx = 0, ty = 0, cx = 0, cy = 0;
  addEventListener('pointermove', e => {
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
  });
  function follow() {
    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.05;
    layer.style.transform = `translate3d(${-cx * 30}px, ${-cy * 18}px, 0)`;
    requestAnimationFrame(follow);
  }
  if (!reduce) follow();

  // Debu cahaya
  const c = document.getElementById('dust');
  const g = c.getContext('2d');
  let w, h, dpr, dots = [];
  const make = () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: (Math.random() * 1.4 + 0.4) * dpr,
    v: (Math.random() * 0.15 + 0.05) * dpr,
    p: Math.random() * 6.28, s: Math.random() * 0.02 + 0.005
  });
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    dots = Array.from({ length: innerWidth < 700 ? 40 : 70 }, make);
  }
  function draw() {
    g.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.y -= d.v;
      d.x += Math.sin(d.p += d.s) * 0.25 * dpr;
      if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
      g.fillStyle = `rgba(220,214,255,${0.3 + 0.25 * Math.sin(d.p * 2)})`;
      g.beginPath(); g.arc(d.x, d.y, d.r, 0, 6.283); g.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  addEventListener('resize', size);
  size(); draw();
})();