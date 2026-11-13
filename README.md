# Simulasi Kenaikan Gaji

Aplikasi **React + TypeScript** mengikuti desain referensi dan spesifikasi aturan gaji lampiran. Python dipakai sebagai **web server opsional** yang hanya menyajikan file frontend, bukan menghitung atau menerima gaji. Perhitungan berlangsung sepenuhnya di browser (tanpa login, database, backend API, AI, atau penyimpanan data pegawai).

## Prasyarat
- Node.js 20.19+ atau 22+ dan npm
- Python 3.10+ (opsional untuk penyajian build)

## Pengembangan (React)
```bash
npm install
npm run dev
```
Buka URL yang ditampilkan terminal (umumnya **http://localhost:5173**).

## Production (React + Python)
```bash
npm install
npm run build
python server/app.py
```
Buka **http://localhost:8000**. Agar dapat diakses jaringan internal kantor, ubah `127.0.0.1` pada `server/app.py` menjadi IP interface jaringan; pastikan jaringan internal dipercaya dan gunakan HTTPS pada production.

## Pengujian
```bash
npm test
npm run build
```
`src/calculation.test.ts` mencakup lima kasus wajib, batas comparatio, grade gabungan, dan validasi nominal.

## Struktur kode
- `src/master.ts` — 16 grade, rentang, tunjangan, matriks PR
- `src/calculation.ts` — semua fungsi validasi dan perhitungan deterministik
- `src/App.tsx` — formulir serta hasil perhitungan
- `src/style.css` — responsive UI (desktop dan ponsel)
- `server/app.py` — Python static server opsional

## Privasi
Nominal gaji tidak dikirim ke server dan tidak ditulis ke database, browser storage, query URL, atau analytics. Font Poppins dimuat melalui Google Fonts; agar seluruh aset offline, ganti `link` Google Fonts pada `index.html` dengan font lokal berlisensi sesuai kebijakan organisasi. Aplikasi memiliki fallback font sans-serif.

**Catatan:** Hasil simulasi estimasi, bukan persetujuan kenaikan gaji. Total hanya gaji pokok + tunjangan posisi, sebelum pajak/potongan.
