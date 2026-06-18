import {
  P1, P2, P1_KING, P2_KING,
  applyMove,
  countPieces,
  getPieceMoves,
  getValidMoves,
  getWinner,
  opponent,
  owner,
  pos,
} from './logic.js'

function evaluate(board, player) {
  const opp = opponent(player)
  const { p1, p2, p1Kings, p2Kings } = countPieces(board)
  const material = player === P1 ? p1 - p2 : p2 - p1
  const kings = player === P1 ? p1Kings - p2Kings : p2Kings - p1Kings
  const mobility = getValidMoves(board, player).length - getValidMoves(board, opp).length

  let advancement = 0
  for (let i = 0; i < board.length; i++) {
    const piece = board[i]
    if (!piece || piece === P1_KING || piece === P2_KING) continue
    const { row } = pos(i)
    if (owner(piece) === player) advancement += player === P1 ? 7 - row : row
    else advancement -= player === P1 ? row : 7 - row
  }

  return material * 100 + kings * 45 + mobility * 4 + advancement * 2
}

function scoreMove(board, move, player) {
  const piece = board[move.from]
  const result = applyMove(board, move)
  let score = evaluate(result.board, player)
  if (move.kind === 'capture') score += 80
  if (result.promoted) score += 55
  if (piece === P1_KING || piece === P2_KING) score += 5
  return score
}

function orderedMoves(board, player, forcedFrom = -1) {
  return getValidMoves(board, player, forcedFrom)
    .map(move => ({ move, score: scoreMove(board, move, player) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.move)
}

function nextTurnAfterMove(board, player, move, result) {
  if (move.kind === 'capture' && !result.promoted) {
    const more = getPieceMoves(result.board, move.to, true)
    if (more.length) return { player, forcedFrom: move.to }
  }
  return { player: opponent(player), forcedFrom: -1 }
}

function minimax(board, player, forcedFrom, maximizingPlayer, depth, alpha, beta) {
  const winner = getWinner(board)
  if (winner) return winner === maximizingPlayer ? 100000 + depth : -100000 - depth
  if (depth === 0) return evaluate(board, maximizingPlayer)

  const moves = orderedMoves(board, player, forcedFrom)
  if (!moves.length) return player === maximizingPlayer ? -100000 - depth : 100000 + depth

  const isMax = player === maximizingPlayer
  const limited = moves.slice(0, depth >= 4 ? 10 : 14)

  if (isMax) {
    let best = -Infinity
    for (const move of limited) {
      const result = applyMove(board, move)
      const turn = nextTurnAfterMove(board, player, move, result)
      const score = minimax(result.board, turn.player, turn.forcedFrom, maximizingPlayer, depth - 1, alpha, beta)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const move of limited) {
    const result = applyMove(board, move)
    const turn = nextTurnAfterMove(board, player, move, result)
    const score = minimax(result.board, turn.player, turn.forcedFrom, maximizingPlayer, depth - 1, alpha, beta)
    best = Math.min(best, score)
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

export function computeCheckersMove(board, player, difficulty, forcedFrom = -1) {
  const moves = getValidMoves(board, player, forcedFrom)
  if (!moves.length) return null

  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  const ordered = orderedMoves(board, player, forcedFrom)
  if (difficulty === 'medium') return ordered[0]

  const depth = difficulty === 'hard' ? 4 : 6
  let bestMove = ordered[0]
  let bestScore = -Infinity

  for (const move of ordered.slice(0, difficulty === 'expert' ? 12 : 10)) {
    const result = applyMove(board, move)
    const turn = nextTurnAfterMove(board, player, move, result)
    const score = minimax(result.board, turn.player, turn.forcedFrom, player, depth - 1, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
