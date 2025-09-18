import React from 'react';

type Cell = 'X' | 'O' | '';

export interface BoardProps {
  cells: Cell[]; // length 9
  ariaLabel?: string;
}

export default function Board({ cells, ariaLabel = 'Tic-Tac-Toe board' }: BoardProps) {
  return (
    <div
      role="grid"
      aria-label={ariaLabel}
      className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto"
    >
      {cells.map((c, i) => (
        <BoardCell key={i} value={c} index={i} />
      ))}
    </div>
  );
}

function BoardCell({ value, index }: { value: Cell; index: number }) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return (
    <div
      role="gridcell"
      aria-colindex={col}
      aria-rowindex={row}
      aria-label={`Row ${row}, Column ${col}${value ? `, ${value}` : ''}`}
      tabIndex={0}
      className="h-24 flex items-center justify-center text-4xl font-bold border border-slate-600 rounded bg-slate-800 text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-600"
    >
      {value}
    </div>
  );
}

