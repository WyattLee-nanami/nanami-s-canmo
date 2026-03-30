import db from './connection';

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meals (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      food_name   TEXT    NOT NULL,
      calories    INTEGER NOT NULL,
      quantity    REAL    NOT NULL DEFAULT 1,
      unit        TEXT    NOT NULL DEFAULT '份',
      meal_type   TEXT    NOT NULL DEFAULT 'other',
      date        TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);

    CREATE TABLE IF NOT EXISTS weight_records (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      weight      REAL    NOT NULL,
      date        TEXT    NOT NULL UNIQUE,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_weight_date ON weight_records(date);

    CREATE TABLE IF NOT EXISTS goals (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_calories  INTEGER NOT NULL DEFAULT 1800,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 确保 goals 表有默认记录
  const goalCount = db.prepare('SELECT COUNT(*) as count FROM goals').get() as { count: number };
  if (goalCount.count === 0) {
    db.prepare('INSERT INTO goals (daily_calories) VALUES (?)').run(1800);
  }
}
