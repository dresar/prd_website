require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');

const { initDb } = require('./app/db');
const middleware = require('./app/middleware');

initDb();

const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-ubah-di-env',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

app.use(middleware.locals);

app.use('/', require('./routes/public'));
app.use('/auth', require('./routes/auth'));
app.use('/panel', require('./routes/panel'));
app.use('/admin', require('./routes/admin'));

app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Halaman tidak ditemukan' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('errors/500', { title: 'Terjadi kesalahan' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`UndanganKu berjalan di http://localhost:${PORT}`);
});
