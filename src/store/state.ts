import { readBoardText, computeWinner, nextPlayer } from '../dom/discovery'
import type { Store } from './prefs'

export type GameStatus = {
  board: ("X"|"O"|null)[]
  next: 'X'|'O'
  winner: 'X'|'O'|null
  draw: boolean
  winLine: number[]|null
}

export function getGameStatus(store: Store): GameStatus {
  const cells = store.getState().discovery.cells
  const board = readBoardText(cells)
  const { winner, line, draw } = computeWinner(board)
  return { board, next: nextPlayer(board), winner, draw, winLine: line }
}
