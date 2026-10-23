/* Suara: klik halus, desir saat pindah halaman, dan dengung latar. Semua dibuat dari kode, tanpa file audio. */
const Suara = (() => {
  let ctx, master, hidup = false, latar = null;
  try { hidup = localStorage.getItem('suara') === '1'; } catch (_) {}

  const siap = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  function klik(f = 620, d = 0.09, v = 0.05) {
    if (!hidup) return;
    const c = siap(), t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.6, t + d);
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(master); o.start(t); o.stop(t + d);
  }

  function whoosh() {
    if (!hidup) return;
    const c = siap(), t = c.currentTime, len = c.sampleRate;
    const buf = c.createBuffer(1, len, c.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
    f.frequency.setValueAtTime(250, t); f.frequency.exponentialRampToValueAtTime(2200, t + 1);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
    s.connect(f).connect(g).connect(master); s.start(t);
  }

  function nyalakanLatar() {
    if (latar) return;
    const c = siap(), t = c.currentTime;
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 3);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    const lfo = c.createOscillator(), lg = c.createGain();
    lfo.frequency.value = 0.07; lg.gain.value = 250; lfo.connect(lg).connect(lp.frequency); lfo.start();
    const oscs = [110, 164.8, 220, 277.2].map((hz, i) => {
      const o = c.createOscillator(), og = c.createGain();
      o.frequency.value = hz; o.detune.value = (i - 1.5) * 4; og.gain.value = 0.03;
      o.connect(og).connect(lp); o.start(); return o;
    });
    lp.connect(g).connect(master);
    latar = { g, oscs, lfo };
  }
  function matikanLatar() {
    if (!latar) return;
    const { g, oscs, lfo } = latar, t = ctx.currentTime;
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    setTimeout(() => { oscs.forEach(o => o.stop()); lfo.stop(); }, 900);
    latar = null;
  }

  function tampil() {
    const b = document.getElementById('btnSuara');
    if (!b) return;
    b.setAttribute('aria-pressed', hidup);
    b.querySelector('span').textContent = hidup ? 'Suara hidup' : 'Suara mati';
  }
  function atur(nilai) {
    hidup = nilai;
    try { localStorage.setItem('suara', nilai ? '1' : '0'); } catch (_) {}
    nilai ? nyalakanLatar() : matikanLatar();
    tampil();
  }

  addEventListener('DOMContentLoaded', () => {
    tampil();
    const b = document.getElementById('btnSuara');
    if (b) b.addEventListener('click', () => { atur(!hidup); if (hidup) klik(760); });
    // browser baru mengizinkan suara setelah ada sentuhan pertama
    if (hidup) addEventListener('pointerdown', () => nyalakanLatar(), { once: true });
    document.addEventListener('pointerdown', e => { if (e.target.closest('button:not(#btnSuara)')) klik(); });
    document.addEventListener('focusin', e => { if (e.target.matches('input')) klik(880, 0.05, 0.025); });
  });

  return { klik, whoosh };
})();