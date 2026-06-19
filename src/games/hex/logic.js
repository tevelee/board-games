import { DRAW, PLAYER_1 as P1, PLAYER_2 as P2 } from '../shared/runtime.js'

export { DRAW, P1, P2 }

export const SIZE = 11
export const CELLS = SIZE * SIZE
export const EMPTY = 0

export const NEIGHBORS = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [1, -1],
]

export function idx(row, col) {
  return row * SIZE + col
}

export function pos(cellIdx) {
  return { row: Math.floor(cellIdx / SIZE), col: cellIdx % SIZE }
}

export function inBounds(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE
}

export function makeBoard() {
  return new Array(CELLS).fill(EMPTY)
}

export function opponent(player) {
  return player === P1 ? P2 : P1
}

export function getNeighbors(cellIdx) {
  const { row, col } = pos(cellIdx)
  const cells = []
  for (const [dr, dc] of NEIGHBORS) {
    const nr = row + dr
    const nc = col + dc
    if (inBounds(nr, nc)) cells.push(idx(nr, nc))
  }
  return cells
}

export function isValidMove(board, cellIdx) {
  return Number.isInteger(cellIdx) && cellIdx >= 0 && cellIdx < CELLS && board[cellIdx] === EMPTY
}

export function getValidMoves(board) {
  const moves = []
  for (let i = 0; i < CELLS; i++) {
    if (board[i] === EMPTY) moves.push(i)
  }
  return moves
}

export function countPieces(board) {
  let p1 = 0
  let p2 = 0
  let empty = 0
  for (const cell of board) {
    if (cell === P1) p1++
    else if (cell === P2) p2++
    else empty++
  }
  return { p1, p2, empty }
}

function touchesStartEdge(cellIdx, player) {
  const { row, col } = pos(cellIdx)
  return player === P1 ? col === 0 : row === 0
}

function touchesTargetEdge(cellIdx, player) {
  const { row, col } = pos(cellIdx)
  return player === P1 ? col === SIZE - 1 : row === SIZE - 1
}

export function getWinningPath(board, player) {
  const queue = []
  const seen = new Set()
  const parent = new Map()

  for (let i = 0; i < CELLS; i++) {
    if (board[i] !== player || !touchesStartEdge(i, player)) continue
    queue.push(i)
    seen.add(i)
    parent.set(i, -1)
  }

  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head]
    if (touchesTargetEdge(cell, player)) {
      const path = []
      let cur = cell
      while (cur !== -1) {
        path.push(cur)
        cur = parent.get(cur)
      }
      return path.reverse()
    }

    for (const next of getNeighbors(cell)) {
      if (seen.has(next) || board[next] !== player) continue
      seen.add(next)
      parent.set(next, cell)
      queue.push(next)
    }
  }

  return null
}

export function getWinner(board) {
  if (getWinningPath(board, P1)) return P1
  if (getWinningPath(board, P2)) return P2
  return getValidMoves(board).length === 0 ? DRAW : null
}

export function applyMove(board, cellIdx, player) {
  if (!isValidMove(board, cellIdx)) return null
  const next = [...board]
  next[cellIdx] = player
  return next
}

function cellCost(cell, player) {
  if (cell === player) return 0
  if (cell === EMPTY) return 1
  return Infinity
}

export function getConnectionDistance(board, player) {
  const distance = new Array(CELLS).fill(Infinity)
  const visited = new Array(CELLS).fill(false)

  for (let i = 0; i < CELLS; i++) {
    if (!touchesStartEdge(i, player)) continue
    distance[i] = cellCost(board[i], player)
  }

  for (let step = 0; step < CELLS; step++) {
    let cell = -1
    let best = Infinity
    for (let i = 0; i < CELLS; i++) {
      if (!visited[i] && distance[i] < best) {
        cell = i
        best = distance[i]
      }
    }

    if (cell === -1) break
    if (touchesTargetEdge(cell, player)) return best
    visited[cell] = true

    for (const next of getNeighbors(cell)) {
      if (visited[next]) continue
      const nextCost = cellCost(board[next], player)
      if (!Number.isFinite(nextCost)) continue
      const candidate = best + nextCost
      if (candidate < distance[next]) distance[next] = candidate
    }
  }

  return Infinity
}

export function getEdgeProgress(cellIdx, player) {
  const { row, col } = pos(cellIdx)
  const axis = player === P1 ? col : row
  return axis / (SIZE - 1)
}
