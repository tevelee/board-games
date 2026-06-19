import {
  CELLS,
  EMPTY,
  SIZE,
  applyMove,
  getConnectionDistance,
  getNeighbors,
  getValidMoves,
  getWinningPath,
  opponent,
  pos,
} from './logic.js'

const WIN_SCORE = 1_000_000

function centerScore(cellIdx) {
  const { row, col } = pos(cellIdx)
  const center = (SIZE - 1) / 2
  const dist = Math.abs(row - center) + Math.abs(col - center)
  return 1 - dist / (SIZE - 1)
}

function countNeighbors(board, cellIdx, player) {
  let count = 0
  for (const next of getNeighbors(cellIdx)) {
    if (board[next] === player) count++
  }
  return count
}

function countBridgePotential(board, cellIdx, player) {
  const { row, col } = pos(cellIdx)
  const candidates = [
    [[row - 1, col], [row - 1, col + 1]],
    [[row, col - 1], [row + 1, col - 1]],
    [[row, col + 1], [row - 1, col + 1]],
    [[row + 1, col], [row + 1, col - 1]],
  ]

  let score = 0
  for (const pair of candidates) {
    const cells = pair
      .filter(([r, c]) => r >= 0 && r < SIZE && c >= 0 && c < SIZE)
      .map(([r, c]) => r * SIZE + c)
    if (cells.length === 2 && cells.every(i => board[i] === player)) score++
  }
  return score
}

function evaluateBoard(board, player) {
  const opp = opponent(player)
  if (getWinningPath(board, player)) return WIN_SCORE
  if (getWinningPath(board, opp)) return -WIN_SCORE

  const myDistance = getConnectionDistance(board, player)
  const oppDistance = getConnectionDistance(board, opp)
  let score = (oppDistance - myDistance) * 180

  for (let i = 0; i < CELLS; i++) {
    const cell = board[i]
    if (cell === EMPTY) continue
    const sign = cell === player ? 1 : -1
    score += sign * centerScore(i) * 6
    score += sign * countNeighbors(board, i, cell) * 3
  }

  return score
}

function scoreMove(board, move, turn, player) {
  const next = applyMove(board, move, turn)
  if (!next) return -Infinity
  if (getWinningPath(next, turn)) return turn === player ? WIN_SCORE : -WIN_SCORE

  const opp = opponent(turn)
  let score = evaluateBoard(next, player)
  const sign = turn === player ? 1 : -1
  score += sign * centerScore(move) * 26
  score += sign * countNeighbors(board, move, turn) * 18
  score += sign * countNeighbors(board, move, opp) * 9
  score += sign * countBridgePotential(board, move, turn) * 18
  return score
}

function orderedMoves(board, turn, player, limit) {
  const maximizing = turn === player
  return getValidMoves(board)
    .map(move => ({ move, score: scoreMove(board, move, turn, player) }))
    .sort((a, b) => maximizing ? b.score - a.score : a.score - b.score)
    .slice(0, limit)
    .map(item => item.move)
}

function search(board, turn, player, depth, alpha, beta, beam) {
  const opp = opponent(player)
  if (getWinningPath(board, player)) return WIN_SCORE + depth
  if (getWinningPath(board, opp)) return -WIN_SCORE - depth
  if (depth === 0) return evaluateBoard(board, player)

  const valid = getValidMoves(board)
  if (!valid.length) return evaluateBoard(board, player)

  const maximizing = turn === player
  const moves = orderedMoves(board, turn, player, beam)

  if (maximizing) {
    let best = -Infinity
    for (const move of moves) {
      const next = applyMove(board, move, turn)
      const score = search(next, opponent(turn), player, depth - 1, alpha, beta, beam)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const move of moves) {
    const next = applyMove(board, move, turn)
    const score = search(next, opponent(turn), player, depth - 1, alpha, beta, beam)
    best = Math.min(best, score)
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

function findImmediateWin(board, player) {
  for (const move of orderedMoves(board, player, player, 28)) {
    const next = applyMove(board, move, player)
    if (getWinningPath(next, player)) return move
  }
  return null
}

function chooseFromTop(board, player, count) {
  const moves = orderedMoves(board, player, player, Math.min(count, getValidMoves(board).length))
  if (!moves.length) return null
  return moves[Math.floor(Math.random() * moves.length)]
}

export function computeHexMove(board, player, difficulty) {
  const valid = getValidMoves(board)
  if (!valid.length) return null
  if (valid.length === CELLS) return Math.floor(CELLS / 2)

  const winningMove = findImmediateWin(board, player)
  if (winningMove != null) return winningMove

  const blockingMove = findImmediateWin(board, opponent(player))
  if (blockingMove != null && board[blockingMove] === EMPTY) return blockingMove

  if (difficulty === 'easy') {
    return chooseFromTop(board, player, Math.min(12, valid.length))
  }

  if (difficulty === 'medium') {
    return chooseFromTop(board, player, Math.min(5, valid.length))
  }

  const empty = valid.length
  const depth = difficulty === 'expert'
    ? empty > 82 ? 2 : empty > 46 ? 3 : 4
    : empty > 58 ? 2 : 3
  const beam = difficulty === 'expert'
    ? empty > 82 ? 18 : empty > 46 ? 15 : 12
    : empty > 58 ? 14 : 11

  let best = -Infinity
  let bestMove = orderedMoves(board, player, player, 1)[0] ?? valid[0]
  for (const move of orderedMoves(board, player, player, beam)) {
    const next = applyMove(board, move, player)
    const score = search(next, opponent(player), player, depth - 1, -Infinity, Infinity, beam)
    if (score > best) {
      best = score
      bestMove = move
    }
  }

  return bestMove
}
