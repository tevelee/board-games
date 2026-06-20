import { DRAW, PLAYER_1 as P1, PLAYER_2 as P2 } from '../shared/runtime.js'

export { DRAW, P1, P2 }

export const EMPTY = 0
export const SIZE = 6
export const CELL_COUNT = SIZE * SIZE
export const QUADRANT_SIZE = 3
export const CLOCKWISE = 'cw'
export const COUNTERCLOCKWISE = 'ccw'

export const ROTATION_DIRECTIONS = [COUNTERCLOCKWISE, CLOCKWISE]

export const QUADRANTS = [
  { id: 0, label: 'top left', row: 0, col: 0 },
  { id: 1, label: 'top right', row: 0, col: 3 },
  { id: 2, label: 'bottom left', row: 3, col: 0 },
  { id: 3, label: 'bottom right', row: 3, col: 3 },
]

const WIN_DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

export function makeBoard() {
  return new Array(CELL_COUNT).fill(EMPTY)
}

export function index(row, col) {
  return row * SIZE + col
}

export function pos(cellIndex) {
  return {
    row: Math.floor(cellIndex / SIZE),
    col: cellIndex % SIZE,
  }
}

export function otherPlayer(player) {
  return player === P1 ? P2 : P1
}

export function isBoardFull(board) {
  return board.every(Boolean)
}

export function countPieces(board) {
  return board.reduce((counts, cell) => {
    if (cell === P1) counts.p1 += 1
    if (cell === P2) counts.p2 += 1
    return counts
  }, { p1: 0, p2: 0 })
}

export function getEmptyCells(board) {
  return board
    .map((cell, cellIndex) => cell === EMPTY ? cellIndex : -1)
    .filter(cellIndex => cellIndex >= 0)
}

export function placeMarble(board, cellIndex, player) {
  if (board[cellIndex] !== EMPTY) return null
  const next = [...board]
  next[cellIndex] = player
  return next
}

export function getQuadrantCells(quadrantId) {
  const quadrant = QUADRANTS[quadrantId]
  if (!quadrant) return []

  return Array.from({ length: QUADRANT_SIZE * QUADRANT_SIZE }, (_, localIndex) => {
    const row = quadrant.row + Math.floor(localIndex / QUADRANT_SIZE)
    const col = quadrant.col + (localIndex % QUADRANT_SIZE)
    return index(row, col)
  })
}

export function rotateQuadrant(board, quadrantId, direction) {
  const quadrant = QUADRANTS[quadrantId]
  if (!quadrant || !ROTATION_DIRECTIONS.includes(direction)) return board

  const next = [...board]
  for (let localRow = 0; localRow < QUADRANT_SIZE; localRow += 1) {
    for (let localCol = 0; localCol < QUADRANT_SIZE; localCol += 1) {
      const sourceRow = quadrant.row + localRow
      const sourceCol = quadrant.col + localCol
      const targetLocal = direction === CLOCKWISE
        ? { row: localCol, col: QUADRANT_SIZE - 1 - localRow }
        : { row: QUADRANT_SIZE - 1 - localCol, col: localRow }
      const targetRow = quadrant.row + targetLocal.row
      const targetCol = quadrant.col + targetLocal.col
      next[index(targetRow, targetCol)] = board[index(sourceRow, sourceCol)]
    }
  }

  return next
}

export function rotateCellIndex(cellIndex, quadrantId, direction) {
  const quadrant = QUADRANTS[quadrantId]
  if (!quadrant || !ROTATION_DIRECTIONS.includes(direction)) return cellIndex

  const { row, col } = pos(cellIndex)
  const localRow = row - quadrant.row
  const localCol = col - quadrant.col
  const insideQuadrant =
    localRow >= 0 &&
    localRow < QUADRANT_SIZE &&
    localCol >= 0 &&
    localCol < QUADRANT_SIZE

  if (!insideQuadrant) return cellIndex

  const targetLocal = direction === CLOCKWISE
    ? { row: localCol, col: QUADRANT_SIZE - 1 - localRow }
    : { row: QUADRANT_SIZE - 1 - localCol, col: localRow }

  return index(quadrant.row + targetLocal.row, quadrant.col + targetLocal.col)
}

export function getWinningLines(board, player) {
  const lines = []

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[index(row, col)] !== player) continue

      for (const [dr, dc] of WIN_DIRECTIONS) {
        const previousRow = row - dr
        const previousCol = col - dc
        if (isInside(previousRow, previousCol) && board[index(previousRow, previousCol)] === player) {
          continue
        }

        const line = []
        let cursorRow = row
        let cursorCol = col
        while (isInside(cursorRow, cursorCol) && board[index(cursorRow, cursorCol)] === player) {
          line.push(index(cursorRow, cursorCol))
          cursorRow += dr
          cursorCol += dc
        }

        if (line.length >= 5) lines.push(line)
      }
    }
  }

  return lines
}

export function evaluateAfterPlacement(board, player) {
  const winLines = getWinningLines(board, player)
  if (winLines.length) return { winner: player, winLines }
  if (isBoardFull(board)) return { winner: DRAW, winLines: [] }
  return { winner: null, winLines: [] }
}

export function evaluateAfterRotation(board) {
  const p1Lines = getWinningLines(board, P1)
  const p2Lines = getWinningLines(board, P2)

  if (p1Lines.length && p2Lines.length) {
    return { winner: DRAW, winLines: [...p1Lines, ...p2Lines] }
  }
  if (p1Lines.length) return { winner: P1, winLines: p1Lines }
  if (p2Lines.length) return { winner: P2, winLines: p2Lines }
  if (isBoardFull(board)) return { winner: DRAW, winLines: [] }
  return { winner: null, winLines: [] }
}

export function getLegalRotations() {
  return QUADRANTS.flatMap(quadrant =>
    ROTATION_DIRECTIONS.map(direction => ({ quadrant: quadrant.id, direction }))
  )
}

export function getLegalTurnMoves(board, player) {
  const rotations = getLegalRotations()
  const moves = []

  for (const cellIndex of getEmptyCells(board)) {
    const placed = placeMarble(board, cellIndex, player)
    const placementResult = evaluateAfterPlacement(placed, player)
    if (placementResult.winner) {
      moves.push({ index: cellIndex, quadrant: null, direction: null })
      continue
    }

    for (const rotation of rotations) {
      moves.push({ index: cellIndex, ...rotation })
    }
  }

  return moves
}

export function applyTurn(board, move, player) {
  if (!move) return null

  const placed = placeMarble(board, move.index, player)
  if (!placed) return null

  const placementResult = evaluateAfterPlacement(placed, player)
  if (placementResult.winner) {
    return {
      board: placed,
      winner: placementResult.winner,
      winLines: placementResult.winLines,
      placedIndex: move.index,
      rotation: null,
    }
  }

  if (move.quadrant == null || move.direction == null) return null

  const rotated = rotateQuadrant(placed, move.quadrant, move.direction)
  const rotationResult = evaluateAfterRotation(rotated)
  return {
    board: rotated,
    winner: rotationResult.winner,
    winLines: rotationResult.winLines,
    placedIndex: rotateCellIndex(move.index, move.quadrant, move.direction),
    rotation: {
      quadrant: move.quadrant,
      direction: move.direction,
    },
  }
}

function isInside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE
}
