PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  phone       TEXT DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS themes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  colors      TEXT NOT NULL DEFAULT '{}',
  is_premium  INTEGER NOT NULL DEFAULT 0,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invitations (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_id        INTEGER REFERENCES themes(id) ON DELETE SET NULL,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  music_url       TEXT DEFAULT '',
  cover_photo     TEXT DEFAULT '',
  groom_nickname  TEXT DEFAULT '',
  groom_fullname  TEXT DEFAULT '',
  groom_parents   TEXT DEFAULT '',
  groom_photo     TEXT DEFAULT '',
  groom_instagram TEXT DEFAULT '',
  groom_order     INTEGER DEFAULT 1,
  bride_nickname  TEXT DEFAULT '',
  bride_fullname  TEXT DEFAULT '',
  bride_parents   TEXT DEFAULT '',
  bride_photo     TEXT DEFAULT '',
  bride_instagram TEXT DEFAULT '',
  bride_order     INTEGER DEFAULT 1,
  livestream_url  TEXT DEFAULT '',
  gift_address    TEXT DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invitation_id INTEGER NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  date          TEXT NOT NULL,
  start_time    TEXT DEFAULT '',
  end_time      TEXT DEFAULT '',
  venue         TEXT DEFAULT '',
  address       TEXT DEFAULT '',
  map_url       TEXT DEFAULT '',
  sort          INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS galleries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invitation_id INTEGER NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  photo         TEXT NOT NULL,
  caption       TEXT DEFAULT '',
  sort          INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stories (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invitation_id INTEGER NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  date          TEXT DEFAULT '',
  description   TEXT DEFAULT '',
  sort          INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gifts (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  invitation_id  INTEGER NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  type           TEXT NOT NULL DEFAULT 'bank' CHECK (type IN ('bank', 'ewallet', 'address')),
  bank_name      TEXT DEFAULT '',
  account_number TEXT DEFAULT '',
  account_name   TEXT DEFAULT '',
  sort           INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS guests (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invitation_id INTEGER NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  category      TEXT DEFAULT 'umum',
  phone         TEXT DEFAULT '',
  token         TEXT NOT NULL UNIQUE,
  is_sent       INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rsvps (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  invitation_id  INTEGER NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_id       INTEGER REFERENCES guests(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  attendance     TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak', 'ragu')),
  attendee_count INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS wishes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invitation_id INTEGER NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  message       TEXT NOT NULL,
  is_approved   INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_invitations_user ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_events_inv ON events(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guests_inv ON guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_wishes_inv ON wishes(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_inv ON rsvps(invitation_id);
