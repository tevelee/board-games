import {
  CLOCKWISE,
  COUNTERCLOCKWISE,
  DRAW,
  SIZE,
  applyTurn,
  getLegalTurnMoves,
  index,
  otherPlayer,
} from './logic.js'

const WIN_SCORE = 1_000_000
const MINE_WEIGHTS = [0, 2, 14, 80, 650, WIN_SCORE]
const OPP_WEIGHTS = [0, 3, 20, 110, 900, WIN_SCORE]
const CENTER_CELLS = [index(1, 1), index(1, 4), index(4, 1), index(4, 4)]
const INNER_CELLS = [index(2, 2), index(2, 3), index(3, 2), index(3, 3)]
const WINDOWS = buildWindows()

const SEARCH = {
  medium: { depth: 1, limit: 24, rootLimit: 36, topChoices: 4 },
  hard: { depth: 2, limit: 18, rootLimit: 36, topChoices: 1 },
  expert: { depth: 3, limit: 12, rootLimit: 28, topChoices: 1 },
}

export function computePentagoMove(board, player, difficulty = 'medium') {
  const legalMoves = getLegalTurnMoves(board, player)
  if (!legalMoves.length) return null

  if (difficulty === 'easy') {
    return legalMoves[Math.floor(Math.random() * legalMoves.length)]
  }

  const config = SEARCH[difficulty] ?? SEARCH.medium
  const ranked = rankMoves(board, player, player, legalMoves.length, true)
  if (!ranked.length) return null

  if (config.depth <= 1) {
    const top = ranked.slice(0, Math.min(config.topChoices, ranked.length))
    return top[Math.floor(Math.random() * top.length)].move
  }

  let alpha = -Infinity
  let bestScore = -Infinity
  let bestMove = ranked[0].move
  const searchCandidates = ranked.slice(0, Math.min(config.rootLimit, ranked.length))

  for (const candidate of searchCandidates) {
    const { result } = candidate
    const score = result.winner
      ? scoreTerminal(result.winner, player, config.depth)
      : minimax(result.board, otherPlayer(player), player, config.depth - 1, alpha, Infinity, config.limit)

    if (score > bestScore || (score === bestScore && compareMoves(candidate.move, bestMove) < 0)) {
      bestScore = score
      bestMove = candidate.move
    }

    alpha = Math.max(alpha, bestScore)
  }

  return bestMove
}

function minimax(board, playerToMove, aiPlayer, depth, alpha, beta, limit) {
  if (depth <= 0) return evaluateBoard(board, aiPlayer)

  const maximizing = playerToMove === aiPlayer
  const ranked = rankMoves(board, playerToMove, playerToMove, limit)
  if (!ranked.length) return evaluateBoard(board, aiPlayer)

  if (maximizing) {
    let best = -Infinity
    for (const candidate of ranked) {
      const score = candidate.result.winner
        ? scoreTerminal(candidate.result.winner, aiPlayer, depth)
        : minimax(candidate.result.board, otherPlayer(playerToMove), aiPlayer, depth - 1, alpha, beta, limit)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const candidate of ranked) {
    const score = candidate.result.winner
      ? scoreTerminal(candidate.result.winner, aiPlayer, depth)
      : minimax(candidate.result.board, otherPlayer(playerToMove), aiPlayer, depth - 1, alpha, beta, limit)
    best = Math.min(best, score)
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

function rankMoves(board, player, scoringPlayer, limit, includeRisk = false) {
  return getLegalTurnMoves(board, player)
    .map(move => {
      const result = applyTurn(board, move, player)
      if (!result) return null
      return {
        move,
        result,
        rank: rankResult(result, scoringPlayer, includeRisk),
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.rank - a.rank || compareMoves(a.move, b.move))
    .slice(0, limit)
}

function rankResult(result, player, includeRisk) {
  if (result.winner) return scoreTerminal(result.winner, player, 1)

  const opponent = otherPlayer(player)
  let score = evaluateBoard(result.board, player)

  if (includeRisk) {
    // Avoid pretty-looking moves that hand over an immediate forced win.
    const opponentWins = getLegalTurnMoves(result.board, opponent)
      .some(move => applyTurn(result.board, move, opponent)?.winner === opponent)
    if (opponentWins) score -= WIN_SCORE / 2
  }

  return score
}

function scoreTerminal(winner, player, depth) {
  if (winner === DRAW) return 0
  return winner === player ? WIN_SCORE + depth * 1000 : -WIN_SCORE - depth * 1000
}

function evaluateBoard(board, player) {
  const opponent = otherPlayer(player)
  let score = 0

  for (const window of WINDOWS) {
    let mine = 0
    let theirs = 0
    for (const cellIndex of window) {
      if (board[cellIndex] === player) mine += 1
      if (board[cellIndex] === opponent) theirs += 1
    }
    if (mine && theirs) continue
    if (mine) score += MINE_WEIGHTS[mine]
    if (theirs) score -= OPP_WEIGHTS[theirs]
  }

  for (const cellIndex of CENTER_CELLS) {
    if (board[cellIndex] === player) score += 10
    if (board[cellIndex] === opponent) score -= 10
  }

  for (const cellIndex of INNER_CELLS) {
    if (board[cellIndex] === player) score += 5
    if (board[cellIndex] === opponent) score -= 5
  }

  return score
}

function buildWindows() {
  const windows = []
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      for (const [dr, dc] of directions) {
        const endRow = row + dr * 4
        const endCol = col + dc * 4
        if (endRow < 0 || endRow >= SIZE || endCol < 0 || endCol >= SIZE) continue

        windows.push(Array.from({ length: 5 }, (_, offset) =>
          index(row + dr * offset, col + dc * offset)
        ))
      }
    }
  }

  return windows
}

function compareMoves(a, b) {
  const rotationRank = {
    [COUNTERCLOCKWISE]: 0,
    [CLOCKWISE]: 1,
    null: -1,
  }
  return (
    a.index - b.index ||
    (a.quadrant ?? -1) - (b.quadrant ?? -1) ||
    rotationRank[a.direction] - rotationRank[b.direction]
  )
}
