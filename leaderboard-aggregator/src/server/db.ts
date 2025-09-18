import Database from 'better-sqlite3';

export interface PlayerRow { name: string; elo: number; games: number; wins: number; losses: number; draws: number }

let db: Database.Database;

export function connect(url: string | undefined) {
  const path = !url || url.startsWith('sqlite:') ? (url?.split(':')[1] || './data/leaderboard.sqlite') : './data/leaderboard.sqlite';
  db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS players (
    name TEXT PRIMARY KEY,
    elo REAL NOT NULL DEFAULT 1000,
    games INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0
  );`);
  db.exec(`CREATE TABLE IF NOT EXISTS ingested (
    game_id TEXT PRIMARY KEY,
    ts INTEGER NOT NULL
  );`);
  db.exec(`CREATE TABLE IF NOT EXISTS snapshots (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    data TEXT NOT NULL
  );`);
}

export function getDB() { return db; }

export function upsertPlayer(name: string, update: Partial<PlayerRow>) {
  const row = db.prepare('SELECT * FROM players WHERE name=?').get(name) as PlayerRow | undefined;
  if (!row) {
    db.prepare('INSERT INTO players (name, elo, games, wins, losses, draws) VALUES (?,?,?,?,?,?)').run(name, update.elo ?? 1000, update.games ?? 0, update.wins ?? 0, update.losses ?? 0, update.draws ?? 0);
  } else {
    const next: PlayerRow = {
      name,
      elo: update.elo ?? row.elo,
      games: update.games ?? row.games,
      wins: update.wins ?? row.wins,
      losses: update.losses ?? row.losses,
      draws: update.draws ?? row.draws
    };
    db.prepare('UPDATE players SET elo=?, games=?, wins=?, losses=?, draws=? WHERE name=?').run(next.elo, next.games, next.wins, next.losses, next.draws, name);
  }
}

export function listPlayers(): PlayerRow[] {
  return db.prepare('SELECT * FROM players ORDER BY elo DESC, games DESC LIMIT 200').all() as PlayerRow[];
}

export function markIngested(gameId: string) { db.prepare('INSERT OR IGNORE INTO ingested (game_id, ts) VALUES (?, ?)').run(gameId, Date.now()); }
export function isIngested(gameId: string): boolean { return !!db.prepare('SELECT 1 FROM ingested WHERE game_id=?').get(gameId); }

export function createSnapshot(id: string, data: any) {
  db.prepare('INSERT INTO snapshots (id, created_at, data) VALUES (?, ?, ?)').run(id, Date.now(), JSON.stringify(data));
}
export function listSnapshots(): { id: string; created_at: number }[] {
  return db.prepare('SELECT id, created_at FROM snapshots ORDER BY created_at DESC').all() as any;
}
export function getSnapshot(id: string): any | undefined {
  const row = db.prepare('SELECT data FROM snapshots WHERE id=?').get(id) as { data: string } | undefined;
  return row ? JSON.parse(row.data) : undefined;
}

