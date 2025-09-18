import { randomUUID } from 'node:crypto';

export type TournamentType = 'round-robin' | 'single-elim';

export interface Player { id: string; name: string }
export interface Match { id: string; round: number; a: string; b: string; winner?: string; roomId?: string }
export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  players: Player[];
  matches: Match[];
  createdAt: number;
}

const tournaments = new Map<string, Tournament>();

export function createTournament(name: string, type: TournamentType, players: Player[]): Tournament {
  const t: Tournament = { id: randomUUID(), name, type, players, matches: [], createdAt: Date.now() };
  tournaments.set(t.id, t);
  return t;
}

export function getTournament(id: string): Tournament | undefined { return tournaments.get(id); }
export function listTournaments(): Tournament[] { return Array.from(tournaments.values()).sort((a,b)=>a.createdAt-b.createdAt); }
export function saveTournament(t: Tournament) { tournaments.set(t.id, t); }

