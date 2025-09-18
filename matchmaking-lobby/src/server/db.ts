import Database from 'better-sqlite3';

export interface PlayerRow { name: string; rating: number }

let db: Database.Database | null = null;

export function initDB(path: string | undefined) {
  db = new Database(path || ':memory:');
  db.exec(`CREATE TABLE IF NOT EXISTS players (name TEXT PRIMARY KEY, rating REAL NOT NULL);`);
}

export function getRating(name: string): number {
  const row = db!.prepare(`SELECT rating FROM players WHERE name=?`).get(name) as { rating?: number } | undefined;
  if (!row) return 1000;
  return row.rating ?? 1000;
}

export function setRating(name: string, rating: number) {
  db!.prepare(`INSERT INTO players(name, rating) VALUES(?, ?) ON CONFLICT(name) DO UPDATE SET rating=excluded.rating`).run(name, rating);
}

