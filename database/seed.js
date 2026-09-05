/**
 * Seed database dengan data awal: admin, akun demo, tema, dan satu undangan contoh.
 * Dijalankan otomatis saat pertama kali (lihat app/db.js) atau manual: npm run seed
 */
const bcrypt = require('bcryptjs');
const { slugify, randomToken } = require('../app/helpers');

module.exports = function seed(db) {
  const hashAdmin = bcrypt.hashSync('admin123', 10);
  const hashUser = bcrypt.hashSync('user1234', 10);

  db.prepare('INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)')
    .run('Administrator', 'admin@undanganku.id', hashAdmin, '081200000001', 'admin');
  db.prepare('INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)')
    .run('Budi Santoso', 'budi@example.com', hashUser, '081200000002', 'user');

  const themes = [
    ['Elegan Gold', 'elegan-gold', 'Nuansa krem-emas klasik yang berkesan mewah.', { primary: '#8a6d3b', secondary: '#c9a961', bg: '#faf7f0', text: '#3d3529', accent: '#f3ead9' }, 0],
    ['Rustic Garden', 'rustic-garden', 'Hijau sage dan kayu, hangat untuk acara outdoor.', { primary: '#5c6b54', secondary: '#a4b494', bg: '#f6f5ef', text: '#33402e', accent: '#e6ebe0' }, 0],
    ['Modern Minimal', 'modern-minimal', 'Bersih, hitam-putih, tipografi besar.', { primary: '#2b2b2b', secondary: '#8f8f8f', bg: '#ffffff', text: '#1d1d1d', accent: '#f0f0f0' }, 0],
    ['Navy Lux', 'navy-lux', 'Biru navy berpadu emas, formal dan elegan.', { primary: '#1f3a5f', secondary: '#c8a95b', bg: '#f4f6fa', text: '#22293a', accent: '#e4e9f2' }, 1],
    ['Blush Rose', 'blush-rose', 'Pink lembut romantis untuk acara siang.', { primary: '#b0697d', secondary: '#e8b4c4', bg: '#fdf6f8', text: '#4a2f37', accent: '#f9e6ec' }, 1],
    ['Adat Jawa', 'adat-jawa', 'Coklat maroon bertema tradisional.', { primary: '#6b3a3a', secondary: '#b98a4e', bg: '#faf3ec', text: '#402a26', accent: '#f0e2d3' }, 1],
  ];
  const insertTheme = db.prepare('INSERT INTO themes (name, slug, description, colors, is_premium) VALUES (?, ?, ?, ?, ?)');
  for (const t of themes) insertTheme.run(t[0], t[1], t[2], JSON.stringify(t[3]), t[4]);

  const settings = [
    ['site_name', 'UndanganKu'],
    ['site_tagline', 'Undangan pernikahan digital yang elegan dan mudah'],
    ['hero_title', 'Wujudkan Momen Bahagiamu dalam Satu Tautan'],
    ['hero_subtitle', 'Buat undangan pernikahan digital yang elegan lengkap dengan RSVP, buku ucapan, galeri foto, dan amplop digital — tanpa perlu coding.'],
    ['contact_wa', '6281234567890'],
    ['footer_note', 'Dibuat dengan sepenuh hati. UndanganKu © 2026'],
  ];
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  for (const s of settings) insertSetting.run(s[0], s[1]);

  // Undangan demo milik user Budi (id=2), tema Elegan Gold (id=1)
  db.prepare(`INSERT INTO invitations
    (user_id, theme_id, slug, title, status, groom_nickname, groom_fullname, groom_parents, groom_order, groom_instagram,
     bride_nickname, bride_fullname, bride_parents, bride_order, bride_instagram, livestream_url, gift_address)
    VALUES (2, 1, ?, ?, 'published', ?, ?, ?, 1, ?, ?, ?, ?, 1, ?, ?, ?)`)
    .run(
      'budi-sinta',
      'Pernikahan Budi & Sinta',
      'Budi', 'Budi Santoso, S.Kom', 'Putra pertama dari Bpk. Hendra Santoso & Ibu Dewi Lestari', 'budi.santoso',
      'Sinta', 'Sinta Maharani, S.E', 'Putri kedua dari Bpk. Rajiman & Ibu Sri Wahyuni', 'sinta.maharani',
      '', 'Jl. Melati No. 12, Kel. Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat 16413'
    );
  const invId = db.prepare('SELECT id FROM invitations WHERE slug = ?').get('budi-sinta').id;

  const insertEvent = db.prepare('INSERT INTO events (invitation_id, name, date, start_time, end_time, venue, address, map_url, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  insertEvent.run(invId, 'Akad Nikah', '2026-09-20', '08:00', '10:00', 'Masjid Al-Ikhlas',
    'Jl. Nusantara No. 45, Bekasi Selatan, Kota Bekasi', 'https://maps.google.com/?q=Masjid+Al-Ikhlas+Bekasi', 1);
  insertEvent.run(invId, 'Resepsi', '2026-09-20', '11:00', '14:00', 'Balai Kartini Hall A',
    'Jl. Gatot Subroto No. 68, Jakarta Selatan', 'https://maps.google.com/?q=Balai+Kartini+Jakarta', 2);

  const insertStory = db.prepare('INSERT INTO stories (invitation_id, title, date, description, sort) VALUES (?, ?, ?, ?, ?)');
  insertStory.run(invId, 'Awal Bertemu', 'Agustus 2021', 'Kami dipertemukan di sebuah acara kampus alumni — obrolan singkat yang ternyata jadi awal segalanya.', 1);
  insertStory.run(invId, 'Momen Lamaran', 'Februari 2025', 'Dengan restu kedua keluarga, Budi melamar Sinta di rumah keluarga putri, dikelilingi orang-orang terdekat.', 2);
  insertStory.run(invId, 'Menuju Hari Bahagia', 'September 2026', 'Dan kini, kami memantapkan hati untuk melangkah ke jenjang berikutnya: menikah dan membangun keluarga kecil kami.', 3);

  const insertGift = db.prepare('INSERT INTO gifts (invitation_id, type, bank_name, account_number, account_name, sort) VALUES (?, ?, ?, ?, ?, ?)');
  insertGift.run(invId, 'bank', 'BCA', '1234567890', 'Budi Santoso', 1);
  insertGift.run(invId, 'bank', 'Mandiri', '9876543210', 'Sinta Maharani', 2);

  const insertGuest = db.prepare('INSERT INTO guests (invitation_id, name, category, phone, token) VALUES (?, ?, ?, ?, ?)');
  const guests = [
    ['Bapak Ahmad & Keluarga', 'keluarga', '081311112222'],
    ['Rina Kartika', 'teman', '081322223333'],
    ['Tim Marketing PT Maju', 'kolega', ''],
    ['Dodi Pratama', 'teman', '081333334444'],
    ['Ibu Ratna & Keluarga', 'keluarga', ''],
  ];
  for (const g of guests) insertGuest.run(invId, g[0], g[1], g[2], randomToken(10));

  const insertRsvp = db.prepare('INSERT INTO rsvps (invitation_id, name, attendance, attendee_count) VALUES (?, ?, ?, ?)');
  insertRsvp.run(invId, 'Rina Kartika', 'hadir', 1);
  insertRsvp.run(invId, 'Dodi Pratama', 'hadir', 2);
  insertRsvp.run(invId, 'Ibu Ratna', 'ragu', 4);

  const insertWish = db.prepare('INSERT INTO wishes (invitation_id, name, message, is_approved) VALUES (?, ?, ?, ?)');
  insertWish.run(invId, 'Rina Kartika', 'Selamat menempuh hidup baru Budi & Sinta! Semoga sakinah mawaddah warahmah.', 1);
  insertWish.run(invId, 'Dodi Pratama', 'Barakallahu lakuma wa baraka alaikuma. Bahia selalu untuk kalian berdua!', 1);
  insertWish.run(invId, 'Tim Marketing PT Maju', 'Congratulations! Lancar sampai hari H ya.', 1);
  insertWish.run(invId, 'Ibu Ratna', 'Turut berbahagia untuk kalian, semoga menjadi keluarga yang harmonis.', 1);

  console.log('[seed] Database diisi dengan data awal.');
  console.log('[seed] Admin : admin@undanganku.id / admin123');
  console.log('[seed] User  : budi@example.com / user1234');
  console.log('[seed] Demo  : http://localhost:3000/u/budi-sinta');
};

// Jalankan langsung lewat `npm run seed -- --force`
if (require.main === module) {
  const { db } = require('../app/db');
  const force = process.argv.includes('--force');
  if (force) {
    db.exec(`
      DELETE FROM wishes; DELETE FROM rsvps; DELETE FROM guests; DELETE FROM gifts;
      DELETE FROM stories; DELETE FROM galleries; DELETE FROM events; DELETE FROM invitations;
      DELETE FROM themes; DELETE FROM settings; DELETE FROM users;
    `);
  }
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM users').get();
  if (c > 0 && !force) {
    console.log('[seed] Database sudah berisi data — lewati. Gunakan `npm run seed` untuk reset.');
  } else {
    module.exports(db);
  }
}
