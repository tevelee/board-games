import {
  DRAW,
  EMPTY,
  P1,
  P2,
  WIN_LINES,
  applyMove,
  getLegalMoves,
  otherPlayer,
} from './logic.js'

const DEPTH_BY_DIFFICULTY = {
  easy: 1,
  medium: 1,
  hard: 2,
  expert: 3,
}

const CANDIDATE_LIMIT = {
  easy: 81,
  medium: 81,
  hard: 18,
  expert: 14,
}

const CELL_WEIGHTS = [3, 2, 3, 2, 5, 2, 3, 2, 3]

export function computeUltimateTicTacToeMove(state, difficulty = 'medium') {
  const moves = getLegalMoves(state)
  if (!moves.length) return null
  if (difficulty === 'easy') return randomMove(moves)

  const player = state.current
  const winningMove = findImmediateWinner(state, moves, player)
  if (winningMove) return winningMove

  const blockingMove = findImmediateBlock(state, moves, player)
  if (blockingMove && difficulty !== 'medium') return blockingMove

  if (difficulty === 'medium') {
    return blockingMove ?? orderedMoves(state, moves, player)[0]
  }

  const depth = DEPTH_BY_DIFFICULTY[difficulty] ?? DEPTH_BY_DIFFICULTY.medium
  const candidates = orderedMoves(state, moves, player).slice(0, CANDIDATE_LIMIT[difficulty] ?? 18)
  let bestScore = -Infinity
  let bestMoves = []

  for (const move of candidates) {
    const next = applyMove(state, move.boardIndex, move.cellIndex)
    const score = minimax(next, depth - 1, -Infinity, Infinity, player)
    if (score > bestScore) {
      bestScore = score
      bestMoves = [move]
    } else if (score === bestScore) {
      bestMoves.push(move)
    }
  }

  return randomMove(bestMoves)
}

function minimax(state, depth, alpha, beta, player) {
  if (state.winner || depth <= 0) return evaluateState(state, player)

  const maximizing = state.current === player
  const moves = orderedMoves(state, getLegalMoves(state), player).slice(0, 12)
  if (!moves.length) return evaluateState(state, player)

  if (maximizing) {
    let best = -Infinity
    for (const move of moves) {
      best = Math.max(best, minimax(applyMove(state, move.boardIndex, move.cellIndex), depth - 1, alpha, beta, player))
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const move of moves) {
    best = Math.min(best, minimax(applyMove(state, move.boardIndex, move.cellIndex), depth - 1, alpha, beta, player))
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

function orderedMoves(state, moves, player) {
  return [...moves].sort((a, b) => scoreMove(state, b, player) - scoreMove(state, a, player))
}

function scoreMove(state, move, player) {
  const next = applyMove(state, move.boardIndex, move.cellIndex)
  let score = evaluateState(next, player)

  if (next.boardWinners[move.boardIndex] === player && state.boardWinners[move.boardIndex] === EMPTY) {
    score += 420
  }
  if (!next.winner && next.activeBoard == null) score -= 34
  if (!next.winner && next.activeBoard != null) {
    const target = next.boards[next.activeBoard]
    score -= localThreatScore(target, otherPlayer(player)) * 0.45
    score += localThreatScore(target, player) * 0.15
  }

  return score + Math.random() * 0.05
}

function evaluateState(state, player) {
  const opponent = otherPlayer(player)
  if (state.winner === player) return 100000
  if (state.winner === opponent) return -100000
  if (state.winner === DRAW) return 0

  let score = 0

  for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
    const winner = state.boardWinners[boardIndex]
    if (winner === player) score += 420 + CELL_WEIGHTS[boardIndex] * 18
    else if (winner === opponent) score -= 460 + CELL_WEIGHTS[boardIndex] * 20
    else if (winner === EMPTY) {
      score += localBoardScore(state.boards[boardIndex], player) * (1 + CELL_WEIGHTS[boardIndex] / 12)
    }
  }

  for (const line of WIN_LINES) {
    const own = line.filter(index => state.boardWinners[index] === player).length
    const opp = line.filter(index => state.boardWinners[index] === opponent).length
    const blocked = line.some(index => state.boardWinners[index] === DRAW)
    if (blocked || (own && opp)) continue
    if (own === 2) score += 2600
    else if (own === 1) score += 240
    if (opp === 2) score -= 3200
    else if (opp === 1) score -= 270
  }

  if (state.activeBoard != null) {
    score += state.current === player ? 12 : -12
  }

  return score
}

function localBoardScore(board, player) {
  const opponent = otherPlayer(player)
  let score = 0

  for (let index = 0; index < 9; index++) {
    if (board[index] === player) score += CELL_WEIGHTS[index]
    else if (board[index] === opponent) score -= CELL_WEIGHTS[index]
  }

  score += localThreatScore(board, player)
  score -= localThreatScore(board, opponent) * 1.12
  return score
}

function localThreatScore(board, player) {
  let score = 0
  for (const line of WIN_LINES) {
    const own = line.filter(index => board[index] === player).length
    const empty = line.filter(index => board[index] === EMPTY).length
    if (own === 2 && empty === 1) score += 80
    else if (own === 1 && empty === 2) score += 10
  }
  return score
}

function findImmediateWinner(state, moves, player) {
  return moves.find(move => applyMove(state, move.boardIndex, move.cellIndex).winner === player) ?? null
}

function findImmediateBlock(state, moves, player) {
  const opponent = otherPlayer(player)
  const replies = getLegalMoves({ ...state, current: opponent })
  const opponentWin = replies.find(move => applyMove({ ...state, current: opponent }, move.boardIndex, move.cellIndex).winner === opponent)
  if (!opponentWin) return null

  return moves.find(move =>
    move.boardIndex === opponentWin.boardIndex &&
    move.cellIndex === opponentWin.cellIndex
  ) ?? null
}

function randomMove(moves) {
  return moves[Math.floor(Math.random() * moves.length)]
}
