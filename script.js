/* Halaman masuk: validasi + transisi ke beranda */
(() => {
  const MAX_ABSEN = DB.MAX_ABSEN; // ubah di js/db.js
  const form = document.getElementById('formMasuk');
  const btn = document.getElementById('btnMasuk');
  const wipe = document.getElementById('wipe');
  const fields = {
    nama:  { box: document.getElementById('fNama'),  input: document.getElementById('nama'),  err: document.getElementById('errNama') },
    absen: { box: document.getElementById('fAbsen'), input: document.getElementById('absen'), err: document.getElementById('errAbsen') }
  };
  let busy = false;

  function fail(f, msg) {
    f.err.textContent = msg;
    f.box.classList.add('invalid');
    f.box.classList.remove('shake');
    void f.box.offsetWidth;            // ulang animasi getar
    f.box.classList.add('shake');
    return false;
  }
  function clear(f) { f.box.classList.remove('invalid', 'shake'); }

  Object.values(fields).forEach(f => f.input.addEventListener('input', () => clear(f)));

  function validate() {
    const nama = fields.nama.input.value.trim().replace(/\s+/g, ' ');
    const absen = Number(fields.absen.input.value);
    let ok = true;
    if (nama.length < 3) ok = fail(fields.nama, 'Tulis nama lengkap, minimal 3 huruf.');
    else if (!/^[\p{L}][\p{L} .'-]*$/u.test(nama)) ok = fail(fields.nama, 'Nama hanya boleh berisi huruf.');
    if (!Number.isInteger(absen) || absen < 1 || absen > MAX_ABSEN)
      ok = fail(fields.absen, `Nomor absen harus antara 1 dan ${MAX_ABSEN}.`);
    else {
      const p = DB.pemilik(absen);
      if (p && p.nama.toLowerCase() !== nama.toLowerCase())
        ok = fail(fields.absen, `Absen ${absen} sudah dipakai ${p.nama} hari ini.`);
    }
    return ok ? { nama, absen } : null;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (busy) return;
    const data = validate();
    if (!data) return;
    busy = true;

    // lingkaran terbuka dari titik tombol
    const r = btn.getBoundingClientRect();
    wipe.style.setProperty('--wx', (r.left + r.width / 2) + 'px');
    wipe.style.setProperty('--wy', (r.top + r.height / 2) + 'px');

    document.body.classList.add('leaving');        // panel naik & pudar, latar mendekat
    Suara.whoosh();
    setTimeout(() => wipe.classList.add('go'), 350);
    DB.catat(data.nama, data.absen);
    sessionStorage.setItem('siswa', JSON.stringify(data));
    setTimeout(() => { location.href = 'beranda.html'; }, 1400);
  });
})();