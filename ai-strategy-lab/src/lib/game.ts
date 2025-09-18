export type Player = 'X' | 'O';
export type Cell = Player | '';
export type Board = Cell[]; // length 9

export const emptyBoard = (): Board => Array<Cell>(9).fill('');

export function availableMoves(b: Board): number[] {
  const ms: number[] = [];
  for (let i = 0; i < 9; i++) if (b[i] === '') ms.push(i);
  return ms;
}

export function nextPlayer(b: Board): Player {
  const x = b.filter((c) => c === 'X').length;
  const o = b.filter((c) => c === 'O').length;
  return x === o ? 'X' : 'O';
}

export function applyMove(b: Board, i: number, p: Player): Board {
  if (i < 0 || i > 8) throw new Error('invalid move');
  if (b[i] !== '') throw new Error('occupied');
  const nb = b.slice();
  nb[i] = p;
  return nb;
}

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export function winner(b: Board): Player | 'Draw' | null {
  for (const [a,c,d] of wins) {
    if (b[a] && b[a] === b[c] && b[c] === b[d]) return b[a] as Player;
  }
  if (b.every((c) => c !== '')) return 'Draw';
  return null;
}

export function isTerminal(b: Board): boolean { return winner(b) !== null; }

export function evaluate(b: Board, me: Player): number {
  const w = winner(b);
  if (w === me) return 1;
  if (w === 'Draw') return 0;
  if (w && w !== me) return -1;
  return 0;
}

