# UndanganKu — Platform Undangan Pernikahan Digital

Aplikasi web lengkap untuk membuat dan mengelola undangan pernikahan digital: landing page publik, halaman undangan profesional, panel pengguna, dan panel admin. Dibangun dengan **Node.js + Express + EJS + SQLite (better-sqlite3)** — tanpa perlu install database server terpisah.

## Menjalankan

```bash
npm install
npm start        # produksi
npm run dev      # development (auto-restart saat file berubah)
```

Buka **http://localhost:3000**

### Akun bawaan (seed otomatis saat pertama kali jalan)

| Peran  | Email                 | Kata sandi | Panel      |
| ------ | --------------------- | ---------- | ---------- |
| Admin  | `admin@undanganku.id` | `admin123` | `/admin`   |
| User   | `budi@example.com`    | `user1234` | `/panel`   |

Undangan demo: **http://localhost:3000/u/budi-sinta**

> Reset data ke kondisi awal: `npm run seed`

## Fitur

### Publik
- Landing page: hero, fitur, cara kerja, galeri tema, harga, testimoni, FAQ (konten hero & footer bisa diubah admin)
- Halaman daftar tema
- Registrasi & login
- **Halaman undangan `/u/:slug`**: sampul "Buka Undangan" dengan nama tamu personal, countdown menuju hari-H, profil kedua mempelai + foto, rangkaian acara + tautan Google Maps, live streaming, cerita cinta (timeline), galeri + lightbox, form RSVP, buku ucapan dengan pagination, amplop digital (bank/e-wallet + salin nomor, alamat kado), musik latar, animasi scroll

### Panel Pengguna (`/panel`)
- Dashboard statistik (undangan, tamu, RSVP, ucapan)
- CRUD undangan: data mempelai + foto (sampul, pria, wanita)
- CRUD acara, galeri (upload multi-foto), cerita cinta, amplop digital
- Manajemen tamu: tambah manual / impor massal, tautan personal per tamu + tombol salin + tombol kirim WhatsApp, status terkirim
- Daftar RSVP + rekap kehadiran; moderasi ucapan (tampilkan/sembunyikan/hapus)
- Pengaturan: ganti tema, slug, musik, terbitkan/jadikan draf
- Profil: ubah nama/no. HP, ganti kata sandi

### Panel Admin (`/admin`)
- Dashboard statistik seluruh situs
- CRUD pengguna (peran, aktif/nonaktif, hapus + cascade undangan)
- Kelola semua undangan (terbitkan/jadikan draf, hapus)
- CRUD tema (5 warna kustom, premium/gratis, aktif/nonaktif)
- Pengaturan situs (nama situs, hero, WhatsApp, footer)

## Struktur Proyek

```
├── server.js              # Entry point Express
├── app/
│   ├── db.js              # Koneksi SQLite + inisialisasi schema/seed
│   ├── helpers.js         # Slug, format tanggal Indonesia, dll.
│   ├── middleware.js      # Flash, auth guard, locals
│   └── upload.js          # Multer (upload gambar, maks 5MB)
├── database/
│   ├── schema.sql         # Struktur tabel
│   └── seed.js            # Data awal (admin, demo, 6 tema)
├── routes/
│   ├── public.js          # Landing, tema, halaman undangan, RSVP, ucapan
│   ├── auth.js            # Registrasi, login, logout
│   ├── panel.js           # Panel pengguna (semua CRUD)
│   └── admin.js           # Panel admin
├── views/                 # Template EJS (public/ panel/ admin/ auth/ errors/)
└── public/                # CSS, JS, uploads
```

## Catatan Teknis

- Database tersimpan di `data/undangan.db` (otomatis dibuat; masuk `.gitignore`)
- Foto upload tersimpan di `public/uploads/` (jpg/jpeg/png/webp/gif, maks 5MB)
- Kata sandi di-hash bcrypt; sesi login memakai `express-session` — ubah `SESSION_SECRET` di `.env` untuk produksi
- Panel memakai Bootstrap 5 & ikon via CDN, halaman undangan & landing memakai CSS kustom + Google Fonts (butuh internet untuk aset CDN)
- Tema undangan berbasis CSS variables yang diambil dari warna tema di database — admin bisa membuat tema baru tanpa menyentuh kode
- Untuk produksi sungguhan: gunakan HTTPS, ganti session store (mis. Redis), dan tambahkan rate limiting
