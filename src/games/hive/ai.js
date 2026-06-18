import {
  ANT,
  BEETLE,
  GRASSHOPPER,
  QUEEN,
  SPIDER,
  applyMove,
  countPlayerPieces,
  getAllLegalMoves,
  getInventory,
  getNextTurn,
  getPieceMoves,
  getQueenPressure,
  getWinner,
  isQueenPlaced,
  opponent,
} from './logic.js'

const TYPE_VALUE = {
  [QUEEN]: 10,
  [BEETLE]: 7,
  [ANT]: 8,
  [GRASSHOPPER]: 6,
  [SPIDER]: 5,
}

const DIFFICULTY = {
  easy: { depth: 0, width: 10, randomness: 0.45 },
  medium: { depth: 0, width: 16, randomness: 0.12 },
  hard: { depth: 1, width: 18, randomness: 0.04 },
  expert: { depth: 2, width: 20, randomness: 0 },
}

function placementDevelopmentScore(move, pieces, player) {
  if (move.kind !== 'place') return 0
  const ownCount = countPlayerPieces(pieces, player)
  if (move.type === QUEEN) {
    if (ownCount === 2 || ownCount === 3) return 18
    if (ownCount < 2) return -4
  }
  if (!isQueenPlaced(pieces, player) && ownCount >= 2 && move.type !== QUEEN) return -12
  return TYPE_VALUE[move.type] ?? 0
}

function moveTacticalScore(move, pieces, player) {
  if (move.kind === 'place') return placementDevelopmentScore(move, pieces, player)

  const piece = pieces.find(candidate => candidate.id === move.id)
  if (!piece) return 0

  let score = TYPE_VALUE[piece.type] ?? 0
  if (piece.type === BEETLE) score += 2
  if (piece.type === ANT) score += 1
  return score
}

function evaluate(pieces, player) {
  const winner = getWinner(pieces)
  if (winner === player) return 100000
  if (winner === opponent(player)) return -100000
  if (winner === 'draw') return 0

  const opp = opponent(player)
  const attack = getQueenPressure(pieces, opp) * 30
  const danger = getQueenPressure(pieces, player) * 34
  const mobility = getAllLegalMoves(pieces, player).length - getAllLegalMoves(pieces, opp).length
  const ownQueen = isQueenPlaced(pieces, player) ? 8 : -10
  const oppQueen = isQueenPlaced(pieces, opp) ? 0 : 4
  const development = countPlayerPieces(pieces, player) - countPlayerPieces(pieces, opp)
  const reserves = getInventory(pieces, player)
  const beetleReserve = reserves[BEETLE] * -1
  const antReserve = reserves[ANT] * -1

  return attack - danger + mobility * 1.5 + ownQueen + oppQueen + development * 2 + beetleReserve + antReserve
}

function orderedMoves(pieces, player, maximizingPlayer = player) {
  return getAllLegalMoves(pieces, player)
    .map(move => {
      const { pieces: next } = applyMove(pieces, move, player)
      const winner = getWinner(next)
      const winningBonus = winner === player ? 100000 : winner === opponent(player) ? -100000 : 0
      return {
        move,
        score: evaluate(next, maximizingPlayer) + moveTacticalScore(move, pieces, player) + winningBonus,
      }
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.move)
}

function minimax(pieces, player, maximizingPlayer, depth, width, alpha, beta) {
  const winner = getWinner(pieces)
  if (depth === 0 || winner) return evaluate(pieces, maximizingPlayer)

  const moves = orderedMoves(pieces, player, maximizingPlayer).slice(0, width)
  if (!moves.length) return evaluate(pieces, maximizingPlayer)

  if (player === maximizingPlayer) {
    let best = -Infinity
    for (const move of moves) {
      const { pieces: next } = applyMove(pieces, move, player)
      const turn = getNextTurn(next, player)
      best = Math.max(best, minimax(next, turn.current, maximizingPlayer, depth - 1, width, alpha, beta))
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const move of moves) {
    const { pieces: next } = applyMove(pieces, move, player)
    const turn = getNextTurn(next, player)
    best = Math.min(best, minimax(next, turn.current, maximizingPlayer, depth - 1, width, alpha, beta))
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

export function computeHiveMove(pieces, player, difficulty = 'medium') {
  const config = DIFFICULTY[difficulty] ?? DIFFICULTY.medium
  const moves = orderedMoves(pieces, player).slice(0, Math.max(config.width, 1))
  if (!moves.length) return null

  if (difficulty === 'easy' && Math.random() < config.randomness) {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  if (config.depth === 0) {
    const spread = difficulty === 'medium' && Math.random() < config.randomness ? 3 : 1
    return moves[Math.floor(Math.random() * Math.min(spread, moves.length))]
  }

  let bestMove = moves[0]
  let bestScore = -Infinity

  for (const move of moves) {
    const { pieces: next } = applyMove(pieces, move, player)
    const turn = getNextTurn(next, player)
    const score = minimax(next, turn.current, player, config.depth, config.width, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

export function getHiveMoveSummary(pieces, move) {
  if (!move) return ''
  if (move.kind === 'place') return move.type
  const piece = pieces.find(candidate => candidate.id === move.id)
  return piece ? `${piece.type}:${getPieceMoves(pieces, piece.id).length}` : ''
}
