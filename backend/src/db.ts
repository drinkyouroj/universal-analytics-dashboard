import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export const initDb = async () => {
  if (db) return db;
  
  db = await open({
    filename: './analytics.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      score REAL,
      comparative REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
};

export const saveAnalysis = async (text: string, score: number, comparative: number) => {
  try {
    const database = await initDb();
    await database.run(
      'INSERT INTO history (text, score, comparative) VALUES (?, ?, ?)',
      text, score, comparative
    );
  } catch (error) {
    console.error('Failed to save analysis to DB:', error);
  }
};

