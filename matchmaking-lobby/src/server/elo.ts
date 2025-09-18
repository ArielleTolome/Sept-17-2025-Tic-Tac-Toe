export interface ELOConfig { k: number; }

export function expectedScore(rA: number, rB: number) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

export function updateElo(rA: number, rB: number, outcome: 1 | 0 | 0.5, cfg: ELOConfig = { k: 32 }) {
  const eA = expectedScore(rA, rB);
  const eB = expectedScore(rB, rA);
  const newA = rA + cfg.k * (outcome - eA);
  const newB = rB + cfg.k * ((1 - outcome) - eB);
  return { newA, newB };
}

