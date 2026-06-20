import { PLAYER_1, PLAYER_2 } from '../shared/runtime.js'

export { PLAYER_1 as P1, PLAYER_2 as P2 }

export const BOARD_SIZE = 9
export const INITIAL_WALLS = 10

export function makeState() {
  return {
    p1: { row: 8, col: 4 },
    p2: { row: 0, col: 4 },
    walls1: INITIAL_WALLS,
    walls2: INITIAL_WALLS,
    hWalls: new Set(), // 'r,c': blocks (r,c)↔(r+1,c) and (r,c+1)↔(r+1,c+1)
    vWalls: new Set(), // 'r,c': blocks (r,c)↔(r,c+1) and (r+1,c)↔(r+1,c+1)
    current: PLAYER_1,
    winner: null,
    busy: false,
    scores: { p1: 0, p2: 0 },
    lastMove: null,
  }
}

export function opponent(player) {
  return player === PLAYER_1 ? PLAYER_2 : PLAYER_1
}

// Is downward movement from (r,c) to (r+1,c) blocked?
export function isHBlocked(r, c, hWalls) {
  return hWalls.has(`${r},${c}`) || hWalls.has(`${r},${c - 1}`)
}

// Is rightward movement from (r,c) to (r,c+1) blocked?
export function isVBlocked(r, c, vWalls) {
  return vWalls.has(`${r},${c}`) || vWalls.has(`${r - 1},${c}`)
}

function canStep(r, c, dr, dc, hWalls, vWalls) {
  const nr = r + dr
  const nc = c + dc
  if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) return false
  if (dr === 1  && dc === 0)  return !isHBlocked(r, c, hWalls)
  if (dr === -1 && dc === 0)  return !isHBlocked(r - 1, c, hWalls)
  if (dr === 0  && dc === 1)  return !isVBlocked(r, c, vWalls)
  if (dr === 0  && dc === -1) return !isVBlocked(r, c - 1, vWalls)
  return false
}

export function getNeighbors(r, c, hWalls, vWalls) {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  const result = []
  for (const [dr, dc] of dirs) {
    if (canStep(r, c, dr, dc, hWalls, vWalls)) {
      result.push({ row: r + dr, col: c + dc })
    }
  }
  return result
}

export function getPawnMoves(state) {
  const { p1, p2, hWalls, vWalls, current } = state
  const pos = current === PLAYER_1 ? p1 : p2
  const opp = current === PLAYER_1 ? p2 : p1
  const { row, col } = pos
  const moves = []

  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  for (const [dr, dc] of dirs) {
    if (!canStep(row, col, dr, dc, hWalls, vWalls)) continue
    const nr = row + dr
    const nc = col + dc

    if (nr !== opp.row || nc !== opp.col) {
      moves.push({ type: 'move', row: nr, col: nc })
      continue
    }

    // Adjacent cell has opponent — try to jump
    if (canStep(nr, nc, dr, dc, hWalls, vWalls)) {
      // Jump straight over
      moves.push({ type: 'move', row: nr + dr, col: nc + dc })
    } else {
      // Blocked behind — try diagonal (perpendicular) jumps
      const perps = [[dc, dr], [-dc, -dr]]
      for (const [pdr, pdc] of perps) {
        if (canStep(nr, nc, pdr, pdc, hWalls, vWalls)) {
          moves.push({ type: 'move', row: nr + pdr, col: nc + pdc })
        }
      }
    }
  }

  return moves
}

function isValidHWall(r, c, hWalls, vWalls) {
  if (r < 0 || r > 7 || c < 0 || c > 7) return false
  return (
    !hWalls.has(`${r},${c}`) &&
    !hWalls.has(`${r},${c - 1}`) &&
    !hWalls.has(`${r},${c + 1}`) &&
    !vWalls.has(`${r},${c}`)
  )
}

function isValidVWall(r, c, hWalls, vWalls) {
  if (r < 0 || r > 7 || c < 0 || c > 7) return false
  return (
    !vWalls.has(`${r},${c}`) &&
    !vWalls.has(`${r - 1},${c}`) &&
    !vWalls.has(`${r + 1},${c}`) &&
    !hWalls.has(`${r},${c}`)
  )
}

export function bfsDistance(startRow, startCol, goalRow, hWalls, vWalls, blockRow = null, blockCol = null) {
  const visited = new Set()
  const start = `${startRow},${startCol}`
  visited.add(start)
  let frontier = [{ row: startRow, col: startCol }]

  let dist = 0
  while (frontier.length > 0) {
    const next = []
    for (const { row, col } of frontier) {
      if (row === goalRow) return dist
      for (const nb of getNeighbors(row, col, hWalls, vWalls)) {
        if (blockRow !== null && nb.row === blockRow && nb.col === blockCol) continue
        const key = `${nb.row},${nb.col}`
        if (!visited.has(key)) {
          visited.add(key)
          next.push(nb)
        }
      }
    }
    frontier = next
    dist++
  }
  return Infinity
}

function wallKeepsPaths(state, row, col, orient) {
  const newH = orient === 'h' ? new Set([...state.hWalls, `${row},${col}`]) : state.hWalls
  const newV = orient === 'v' ? new Set([...state.vWalls, `${row},${col}`]) : state.vWalls
  const d1 = bfsDistance(state.p1.row, state.p1.col, 0, newH, newV)
  if (d1 === Infinity) return false
  const d2 = bfsDistance(state.p2.row, state.p2.col, 8, newH, newV)
  return d2 !== Infinity
}

export function getWallMoves(state) {
  const { hWalls, vWalls, walls1, walls2, current } = state
  if ((current === PLAYER_1 ? walls1 : walls2) <= 0) return []

  const moves = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidHWall(r, c, hWalls, vWalls) && wallKeepsPaths(state, r, c, 'h')) {
        moves.push({ type: 'wall', orient: 'h', row: r, col: c })
      }
      if (isValidVWall(r, c, hWalls, vWalls) && wallKeepsPaths(state, r, c, 'v')) {
        moves.push({ type: 'wall', orient: 'v', row: r, col: c })
      }
    }
  }
  return moves
}

export function getLegalMoves(state) {
  if (state.winner) return []
  return [...getPawnMoves(state), ...getWallMoves(state)]
}

export function getWinner(state) {
  if (state.p1.row === 0) return PLAYER_1
  if (state.p2.row === 8) return PLAYER_2
  return null
}

export function applyMove(state, move) {
  const { current, p1, p2, walls1, walls2, hWalls, vWalls, scores } = state
  let next = { ...state, lastMove: move }

  if (move.type === 'move') {
    next = current === PLAYER_1
      ? { ...next, p1: { row: move.row, col: move.col } }
      : { ...next, p2: { row: move.row, col: move.col } }
  } else {
    if (move.orient === 'h') {
      next = { ...next, hWalls: new Set([...hWalls, `${move.row},${move.col}`]) }
    } else {
      next = { ...next, vWalls: new Set([...vWalls, `${move.row},${move.col}`]) }
    }
    next = current === PLAYER_1
      ? { ...next, walls1: walls1 - 1 }
      : { ...next, walls2: walls2 - 1 }
  }

  const winner = getWinner(next)
  const newScores = winner
    ? { ...scores, [winner === PLAYER_1 ? 'p1' : 'p2']: scores[winner === PLAYER_1 ? 'p1' : 'p2'] + 1 }
    : scores

  return { ...next, winner, scores: newScores, current: opponent(current), busy: false }
}
