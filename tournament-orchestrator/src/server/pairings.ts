import type { Player, Match } from './store';

export function roundRobin(players: Player[]): Match[] {
  const names = players.map((p) => p.name);
  const n = names.length;
  if (n < 2) return [];
  const even = n % 2 === 0;
  const rotation = even ? names.slice() : [...names, '__BYE__'];
  const rounds = rotation.length - 1;
  const matches: Match[] = [];
  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < rotation.length / 2; i++) {
      const a = rotation[i];
      const b = rotation[rotation.length - 1 - i];
      if (a !== '__BYE__' && b !== '__BYE__') {
        matches.push({ id: `${round}-${i}`, round, a, b });
      }
    }
    // rotate
    const [first, ...rest] = rotation;
    rotation.splice(1, rotation.length - 1, ...rest.slice(0, -1), rotation[rotation.length - 1]);
  }
  return matches;
}

export function singleElim(players: Player[]): Match[] {
  const names = players.map((p) => p.name);
  if (names.length < 2) return [];
  // next power of two
  let size = 1;
  while (size < names.length) size <<= 1;
  const padded = names.concat(Array(size - names.length).fill('__BYE__'));
  const matches: Match[] = [];
  let round = 0;
  let current = padded;
  while (current.length > 1) {
    for (let i = 0; i < current.length; i += 2) {
      const a = current[i];
      const b = current[i + 1];
      if (a !== '__BYE__' && b !== '__BYE__') {
        matches.push({ id: `${round}-${i / 2}`, round, a, b });
      } else if (a !== '__BYE__' || b !== '__BYE__') {
        // Walkover automatically advances non-bye
        const adv = a !== '__BYE__' ? a : b;
        matches.push({ id: `${round}-${i / 2}`, round, a, b, winner: adv });
      }
    }
    // Advance winners or byes
    const winners: string[] = [];
    let idx = 0;
    while (idx < current.length) {
      const a = current[idx++];
      const b = current[idx++];
      if (a === '__BYE__' && b === '__BYE__') winners.push('__BYE__');
      else if (a === '__BYE__') winners.push(b);
      else if (b === '__BYE__') winners.push(a);
      else winners.push('TBD');
    }
    current = winners;
    round++;
  }
  return matches;
}

