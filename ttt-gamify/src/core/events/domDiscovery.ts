export type BoardSelectors = {
  board: HTMLElement | null;
  cells: HTMLElement[];
};

function byRole(role: string) {
  return Array.from(document.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
}

function byClass(cls: string) {
  return Array.from(document.getElementsByClassName(cls)) as unknown as HTMLElement[];
}

export function discoverBoard(): BoardSelectors {
  // Prefer ARIA roles
  const grids = byRole('grid');
  for (const g of grids) {
    const cells = Array.from(g.querySelectorAll('[role="gridcell"], [role="button"], button, .cell')) as HTMLElement[];
    if (cells.length === 9) return { board: g, cells };
  }
  // Fallback to common classes
  for (const cls of ['board', 'game-board', 'ttt-board']) {
    const boards = byClass(cls);
    for (const b of boards) {
      const cells = Array.from(b.querySelectorAll('.cell, button, [role="gridcell"]')) as HTMLElement[];
      if (cells.length === 9) return { board: b, cells };
    }
  }
  // Global fallback
  const cells = Array.from(document.querySelectorAll('.cell, button, [role="gridcell"]')) as HTMLElement[];
  if (cells.length === 9) return { board: cells[0].parentElement as HTMLElement, cells };
  return { board: null, cells: [] };
}

