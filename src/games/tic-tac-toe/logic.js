import { DRAW, PLAYER_1 as P1, PLAYER_2 as P2, incrementPlayerScore } from '../shared/runtime.js'

export { DRAW, P1, P2 }

export const SIZE = 3
export const CELL_COUNT = SIZE * SIZE
export const EMPTY = 0
export const CLASSIC = 'classic'
export const VANISHING = 'vanishing'

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const DIFFICULTIES = new Set(['easy', 'medium', 'hard', 'expert'])
const SEARCH_DEPTH = {
  easy: 1,
  medium: 2,
  hard: 5,
  expert: 8,
}

const POSITION_WEIGHTS = [3, 2, 3, 2, 5, 2, 3, 2, 3]

export function normalizeDifficulty(value) {
  return DIFFICULTIES.has(value) ? value : 'medium'
}

export function makeState(variant = CLASSIC) {
  return withScores({
    variant,
    board: new Array(CELL_COUNT).fill(EMPTY),
    current: P1,
    winner: null,
    winLine: null,
    moveCount: 0,
    markHistory: [],
    lastMove: null,
    removed: null,
    busy: false,
    scores: { p1: 0, p2: 0 },
  })
}

export function getLegalMoves(state) {
  if (state.winner) return []
  return state.board
    .map((cell, index) => cell === EMPTY ? index : -1)
    .filter(index => index >= 0)
}

export function applyMove(state, index) {
  if (state.winner || state.board[index] !== EMPTY) return state

  const board = [...state.board]
  const player = state.current
  board[index] = player

  let markHistory = [...state.markHistory, { index, player }]
  let removed = null

  if (state.variant === VANISHING) {
    const ownMarks = markHistory.filter(mark => mark.player === player)
    if (ownMarks.length > 3) {
      removed = ownMarks[0]
      board[removed.index] = EMPTY
      const removeAt = markHistory.findIndex(mark => mark.player === player && mark.index === removed.index)
      if (removeAt >= 0) markHistory.splice(removeAt, 1)
    }
  }

  const winLine = getWinLine(board, player)
  const winner = winLine
    ? player
    : state.variant === CLASSIC && board.every(Boolean)
      ? DRAW
      : null
  const nextPlayer = player === P1 ? P2 : P1
  const scores = winner === P1 || winner === P2
    ? incrementPlayerScore(state.scores, winner)
    : state.scores

  return withScores({
    ...state,
    board,
    current: winner ? player : nextPlayer,
    winner,
    winLine,
    moveCount: state.moveCount + 1,
    markHistory,
    lastMove: { index, player },
    removed,
    busy: false,
    scores,
  })
}

export function getWinLine(board, player) {
  return WIN_LINES.find(line => line.every(index => board[index] === player)) ?? null
}

export function getWinner(board) {
  for (const player of [P1, P2]) {
    const line = getWinLine(board, player)
    if (line) return { winner: player, line }
  }
  if (board.every(Boolean)) return { winner: DRAW, line: null }
  return { winner: null, line: null }
}

export function computeMove(state, difficulty = 'medium') {
  const normalizedDifficulty = normalizeDifficulty(difficulty)
  const moves = getLegalMoves(state)
  if (!moves.length) return null
  if (normalizedDifficulty === 'easy') return randomMove(moves)

  const player = state.current
  const opponent = otherPlayer(player)
  const immediateWin = findImmediateMove(state, player)
  if (immediateWin != null) return immediateWin

  const immediateBlock = findImmediateMove(state, opponent)
  if (immediateBlock != null && normalizedDifficulty !== 'medium') return immediateBlock

  if (normalizedDifficulty === 'medium') {
    return immediateBlock ?? pickWeightedMove(state, moves, player)
  }

  const depth = SEARCH_DEPTH[normalizedDifficulty]
  let bestScore = -Infinity
  let bestMoves = []

  for (const move of orderedMoves(state, moves, player)) {
    const next = applyMoveForSearch(state, move)
    const score = minimax(next, depth - 1, -Infinity, Infinity, false, player)
    if (score > bestScore) {
      bestScore = score
      bestMoves = [move]
    } else if (score === bestScore) {
      bestMoves.push(move)
    }
  }

  return randomMove(bestMoves)
}

function minimax(state, depth, alpha, beta, maximizing, player) {
  if (state.winner || depth <= 0) return evaluateState(state, player, depth)

  const moves = orderedMoves(state, getLegalMoves(state), state.current)
  if (!moves.length) return evaluateState(state, player, depth)

  if (maximizing) {
    let best = -Infinity
    for (const move of moves) {
      best = Math.max(best, minimax(applyMoveForSearch(state, move), depth - 1, alpha, beta, false, player))
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const move of moves) {
    best = Math.min(best, minimax(applyMoveForSearch(state, move), depth - 1, alpha, beta, true, player))
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

function evaluateState(state, player, depth) {
  const opponent = otherPlayer(player)
  if (state.winner === player) return 10000 + depth * 100
  if (state.winner === opponent) return -10000 - depth * 100
  if (state.winner === DRAW) return 0

  let score = 0
  for (let index = 0; index < CELL_COUNT; index++) {
    if (state.board[index] === player) score += POSITION_WEIGHTS[index]
    else if (state.board[index] === opponent) score -= POSITION_WEIGHTS[index]
  }

  for (const line of WIN_LINES) {
    const own = line.filter(index => state.board[index] === player).length
    const opp = line.filter(index => state.board[index] === opponent).length
    if (own && opp) continue
    if (own === 2) score += 24
    else if (own === 1) score += 4
    if (opp === 2) score -= 30
    else if (opp === 1) score -= 5
  }

  if (state.variant === VANISHING) {
    const ownOldest = state.markHistory.find(mark => mark.player === player)
    const oppOldest = state.markHistory.find(mark => mark.player === opponent)
    if (ownOldest) score -= POSITION_WEIGHTS[ownOldest.index] * 0.7
    if (oppOldest) score += POSITION_WEIGHTS[oppOldest.index] * 0.7
  }

  return score
}

function applyMoveForSearch(state, index) {
  return applyMove({
    ...state,
    scores: { p1: 0, p2: 0 },
    busy: false,
  }, index)
}

function findImmediateMove(state, player) {
  const moves = getLegalMoves(state)
  for (const move of moves) {
    const next = applyMoveForSearch({ ...state, current: player }, move)
    if (next.winner === player) return move
  }
  return null
}

function pickWeightedMove(state, moves, player) {
  const scored = moves.map(move => {
    const next = applyMoveForSearch(state, move)
    return {
      move,
      score: evaluateState(next, player, 0) + Math.random() * 2,
    }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored[0].move
}

function orderedMoves(state, moves, player) {
  return [...moves].sort((a, b) => {
    const scoreA = evaluateState(applyMoveForSearch(state, a), player, 0)
    const scoreB = evaluateState(applyMoveForSearch(state, b), player, 0)
    return scoreB - scoreA
  })
}

function randomMove(moves) {
  return moves[Math.floor(Math.random() * moves.length)]
}

function otherPlayer(player) {
  return player === P1 ? P2 : P1
}

function withScores(state) {
  return {
    ...state,
    scores: {
      p1: state.scores?.p1 ?? 0,
      p2: state.scores?.p2 ?? 0,
    },
  }
}
