export function expectedScore(rA: number, rB: number) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

export function updateElo(rA: number, rB: number, outcome: 1 | 0 | 0.5, k = 32) {
  const eA = expectedScore(rA, rB);
  const eB = expectedScore(rB, rA);
  const newA = rA + k * (outcome - eA);
  const newB = rB + k * ((1 - outcome) - eB);
  return { newA, newB };
}

