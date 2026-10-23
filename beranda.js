/* Halaman beranda: tampilkan data siswa + transisi buka/tutup */
(() => {
  const wipe = document.getElementById('wipe');
  let siswa = null;
  try { siswa = JSON.parse(sessionStorage.getItem('siswa')); } catch (_) {}
  if (!siswa) { location.replace('index.html'); return; }

  const jam = new Date().getHours();
  const waktu = jam < 11 ? 'pagi' : jam < 15 ? 'siang' : jam < 18 ? 'sore' : 'malam';
  document.getElementById('salam').textContent = `Selamat ${waktu},`;
  document.getElementById('namaSiswa').textContent = siswa.nama;
  document.getElementById('absenSiswa').textContent = `Absen ${siswa.absen}`;
  document.getElementById('tanggal').textContent =
    new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // daftar siswa yang sudah masuk hari ini
  const daftar = DB.hariIni();
  document.getElementById('hitung').textContent = `${daftar.length} siswa tercatat`;
  const ol = document.getElementById('daftar');
  daftar.forEach((r, i) => {
    const li = document.createElement('li');
    li.style.setProperty('--i', Math.min(i, 25));
    if (r.absen === siswa.absen) li.className = 'saya';
    [['no', r.absen], ['nama', r.nama], ['jam', r.jam]].forEach(([k, v]) => {
      const s = document.createElement('span'); s.className = k; s.textContent = v; li.append(s);
    });
    ol.append(li);
  });

  // lingkaran menutup, memperlihatkan halaman
  requestAnimationFrame(() => requestAnimationFrame(() => wipe.classList.add('open')));

  document.getElementById('btnKeluar').addEventListener('click', () => {
    sessionStorage.removeItem('siswa');
    wipe.className = 'wipe';
    document.body.classList.add('leaving');
    Suara.whoosh();
    setTimeout(() => wipe.classList.add('go'), 250);
    setTimeout(() => { location.href = 'index.html'; }, 1250);
  });
})();