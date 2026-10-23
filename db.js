/* Penyimpanan data absen.
   Sekarang memakai localStorage (tersimpan di browser perangkat ini).
   Untuk database sungguhan yang dipakai bersama, ganti isi hariIni, pemilik, dan catat
   dengan fetch() ke server (PHP + MySQL atau Node). Bagian lain web tidak perlu diubah. */
const DB = (() => {
  const KEY = 'absen-kelas';
  const MAX_ABSEN = 50; // jumlah siswa di kelas
  const hari = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
  const baca = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (_) { return []; } };
  const tulis = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} };

  return {
    MAX_ABSEN,
    hariIni: () => baca().filter(r => r.tanggal === hari()).sort((a, b) => a.absen - b.absen),
    pemilik: absen => baca().find(r => r.tanggal === hari() && r.absen === absen) || null,
    catat(nama, absen) {
      const ada = this.pemilik(absen);
      if (ada && ada.nama.toLowerCase() === nama.toLowerCase()) return; // sudah tercatat hari ini
      const d = baca().filter(r => !(r.tanggal === hari() && r.absen === absen));
      d.push({ nama, absen, tanggal: hari(),
               jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
      tulis(d);
    }
  };
})();