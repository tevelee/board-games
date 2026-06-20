import {
  SIZE,
  P1, P1_KING, P2_KING,
  applyMove,
  countPieces,
  getValidMoves,
  getWinner,
  opponent,
  owner,
  pos,
} from './logic.js'

function pieceValue(piece) {
  if (piece === P1_KING || piece === P2_KING) return 260
  return piece ? 100 : 0
}

function evaluate(board, player) {
  const opp = opponent(player)
  const { p1, p2, p1Kings, p2Kings } = countPieces(board)
  const p1Men = p1 - p1Kings
  const p2Men = p2 - p2Kings
  const material = player === P1
    ? (p1Men * 100 + p1Kings * 260) - (p2Men * 100 + p2Kings * 260)
    : (p2Men * 100 + p2Kings * 260) - (p1Men * 100 + p1Kings * 260)
  const mobility = getValidMoves(board, player).length - getValidMoves(board, opp).length

  let advancement = 0
  let center = 0
  for (let i = 0; i < board.length; i++) {
    const piece = board[i]
    if (!piece) continue

    const pieceOwner = owner(piece)
    const { row, col } = pos(i)
    const sign = pieceOwner === player ? 1 : -1
    const centerDistance = Math.abs(row - 4.5) + Math.abs(col - 4.5)
    center += sign * (9 - centerDistance)

    if (piece === P1_KING || piece === P2_KING) continue
    const progress = pieceOwner === P1 ? SIZE - 1 - row : row
    advancement += sign * progress
  }

  return material + mobility * 3 + advancement * 4 + center
}

function scoreMove(board, move, player) {
  const piece = board[move.from]
  const result = applyMove(board, move)
  let score = evaluate(result.board, player)
  score += (move.captured?.length ?? 0) * 140
  if (result.promoted) score += 85
  if (pieceValue(piece) > 100) score += 8
  return score
}

function orderedMoves(board, player) {
  return getValidMoves(board, player)
    .map(move => ({ move, score: scoreMove(board, move, player) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.move)
}

function minimax(board, player, maximizingPlayer, depth, alpha, beta) {
  const winner = getWinner(board)
  if (winner) return winner === maximizingPlayer ? 100000 + depth : -100000 - depth
  if (depth === 0) return evaluate(board, maximizingPlayer)

  const moves = orderedMoves(board, player)
  if (!moves.length) return player === maximizingPlayer ? -100000 - depth : 100000 + depth

  const isMax = player === maximizingPlayer
  const limited = moves.slice(0, depth >= 4 ? 8 : depth >= 3 ? 10 : 14)

  if (isMax) {
    let best = -Infinity
    for (const move of limited) {
      const result = applyMove(board, move)
      const score = minimax(result.board, opponent(player), maximizingPlayer, depth - 1, alpha, beta)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const move of limited) {
    const result = applyMove(board, move)
    const score = minimax(result.board, opponent(player), maximizingPlayer, depth - 1, alpha, beta)
    best = Math.min(best, score)
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

export function computeInternationalCheckersMove(board, player, difficulty) {
  const moves = getValidMoves(board, player)
  if (!moves.length) return null

  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  const ordered = orderedMoves(board, player)
  if (difficulty === 'medium') return ordered[0]

  const depth = difficulty === 'hard' ? 3 : 4
  let bestMove = ordered[0]
  let bestScore = -Infinity

  for (const move of ordered.slice(0, difficulty === 'expert' ? 10 : 8)) {
    const result = applyMove(board, move)
    const score = minimax(result.board, opponent(player), player, depth - 1, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
