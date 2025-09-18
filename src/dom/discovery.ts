export type Discovery = {
  board?: HTMLElement | null
  cells?: HTMLElement[]
  outcome?: HTMLElement | null
  debug: { candidates: string[]; chosen: string | null }
}

const BOARD_SELECTORS = [
  '[role="grid"]',
  '[data-board]',
  '.board',
  'main .grid-3x3',
]

const CELL_SELECTORS = [
  '[role="gridcell"]',
  '[data-cell]',
  '.cell',
  'button',
  'div'
]

const OUTCOME_SELECTORS = [
  '[data-outcome]',
  '[aria-live]',
  '.result',
]

export function discover(): Discovery {
  const debug = { candidates: [] as string[], chosen: null as string | null }

  let board: HTMLElement | null = null
  let cells: HTMLElement[] = []

  for (const sel of BOARD_SELECTORS) {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(sel))
    for (const c of candidates) {
      const children = Array.from(c.querySelectorAll<HTMLElement>(CELL_SELECTORS.join(',')))
      if (children.length === 9 || looks3x3(c)) {
        board = c
        cells = pickCells(children)
        debug.chosen = sel
        break
      }
    }
    debug.candidates.push(`${sel}:${candidates.length}`)
    if (board) break
  }

  const outcome = first(OUTCOME_SELECTORS)

  return { board, cells, outcome, debug }
}

function first(selectors: string[]): HTMLElement | null {
  for (const s of selectors) {
    const el = document.querySelector<HTMLElement>(s)
    if (el) return el
  }
  return null
}

function looks3x3(container: Element): boolean {
  const rect = container.getBoundingClientRect()
  const ratio = Math.abs(rect.width - rect.height) / Math.max(1, rect.width)
  return ratio < 0.2 // roughly square
}

function pickCells(children: HTMLElement[]): HTMLElement[] {
  if (children.length === 9) return children.slice(0, 9)
  // Heuristic: pick first 9 focusable/button-like
  const focusable = children.filter(c => isClickable(c)).slice(0, 9)
  return focusable.length === 9 ? focusable : children.slice(0, 9)
}

function isClickable(el: HTMLElement): boolean {
  const role = el.getAttribute('role')
  return el.tagName === 'BUTTON' || el.onclick != null || role === 'button' || role === 'gridcell'
}

export function readBoardText(cells?: HTMLElement[]): ("X"|"O"|null)[] {
  if (!cells) return Array(9).fill(null)
  return cells.map(c => {
    const t = (c.textContent || '').trim().toUpperCase()
    if (t.includes('X')) return 'X'
    if (t.includes('O')) return 'O'
    return null
  })
}

export function computeWinner(board: ("X"|"O"|null)[]): { winner: 'X'|'O'|null, line: number[]|null, draw: boolean } {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ]
  for (const l of lines) {
    const [a,b,c] = l
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line: l, draw: false }
    }
  }
  const draw = board.every(Boolean)
  return { winner: null, line: null, draw }
}

export function nextPlayer(board: ("X"|"O"|null)[]): 'X'|'O' {
  const x = board.filter(v => v === 'X').length
  const o = board.filter(v => v === 'O').length
  return x <= o ? 'X' : 'O'
}
