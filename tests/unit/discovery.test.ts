import { describe, it, expect, beforeEach } from 'vitest'
import { discover, readBoardText, computeWinner, nextPlayer } from '../../src/dom/discovery'

describe('DOM discovery', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('finds a 3x3 grid by role', () => {
    const grid = document.createElement('div')
    grid.setAttribute('role','grid')
    for (let i=0;i<9;i++) { const c = document.createElement('button'); c.setAttribute('role','gridcell'); grid.appendChild(c) }
    document.body.appendChild(grid)
    const d = discover()
    expect(d.board).toBe(grid)
    expect(d.cells?.length).toBe(9)
  })

  it('reads board text and computes winner', () => {
    const grid = document.createElement('div')
    grid.setAttribute('role','grid')
    const cells: HTMLElement[] = []
    for (let i=0;i<9;i++) { const c = document.createElement('button'); c.setAttribute('role','gridcell'); cells.push(c); grid.appendChild(c) }
    cells[0].textContent = 'X'
    cells[1].textContent = 'X'
    cells[2].textContent = 'X'
    document.body.appendChild(grid)
    const board = readBoardText(cells)
    const { winner, line } = computeWinner(board)
    expect(winner).toBe('X')
    expect(line).toEqual([0,1,2])
    expect(nextPlayer(board)).toBe('O')
  })
})
