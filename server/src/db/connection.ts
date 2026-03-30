import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 确定 server 目录位置：tsx 下 __dirname 指向 src/db，向上两级就是 server/
const serverDir = path.resolve(__dirname, '../..');
const dbDir = serverDir;
// 确保目录存在
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'canmo.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;
