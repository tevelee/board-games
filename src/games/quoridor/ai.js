import {
  P1, P2,
  applyMove,
  bfsDistance,
  getLegalMoves,
  getPawnMoves,
  getWallMoves,
  getWinner,
  opponent,
} from './logic.js'

function myDist(state, player) {
  const pos = player === P1 ? state.p1 : state.p2
  const goal = player === P1 ? 0 : 8
  return bfsDistance(pos.row, pos.col, goal, state.hWalls, state.vWalls)
}

function evaluate(state, player) {
  const opp = opponent(player)
  const myD = myDist(state, player)
  const oppD = myDist(state, opp)
  if (myD === 0) return 100000
  if (oppD === 0) return -100000
  // Higher is better: opponent far from goal, self close
  return oppD * 10 - myD * 10
}

function scoreMove(state, move, player) {
  const next = applyMove(state, move)
  const base = evaluate(next, player)
  if (move.type === 'move') return base + 2
  // Prefer walls that increase opponent's distance
  return base
}

function minimax(state, player, depth, alpha, beta, maximizing) {
  const winner = getWinner(state)
  if (winner === player) return 100000 + depth
  if (winner) return -100000 - depth
  if (depth === 0) return evaluate(state, player)

  const moves = getLegalMoves(state)
  if (moves.length === 0) return evaluate(state, player)

  if (maximizing) {
    let best = -Infinity
    for (const move of moves) {
      const next = applyMove(state, move)
      const score = minimax(next, player, depth - 1, alpha, beta, false)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const move of moves) {
      const next = applyMove(state, move)
      const score = minimax(next, player, depth - 1, alpha, beta, true)
      best = Math.min(best, score)
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

function pickRandom(moves) {
  return moves[Math.floor(Math.random() * moves.length)]
}

export function computeQuoridorMove(state, difficulty) {
  const player = state.current

  if (difficulty === 'easy') {
    const pawnMoves = getPawnMoves(state)
    const all = [...pawnMoves]
    // Occasionally place a wall
    if (Math.random() < 0.15) {
      const wallMoves = getWallMoves(state)
      if (wallMoves.length) return pickRandom(wallMoves)
    }
    return all.length ? pickRandom(all) : pickRandom(getWallMoves(state))
  }

  if (difficulty === 'medium') {
    const moves = getLegalMoves(state)
    if (!moves.length) return null
    const scored = moves.map(m => ({ m, s: scoreMove(state, m, player) }))
    scored.sort((a, b) => b.s - a.s)
    // Pick from top 3 with some randomness
    const top = scored.slice(0, Math.min(3, scored.length))
    return top[Math.floor(Math.random() * top.length)].m
  }

  const depth = difficulty === 'expert' ? 3 : 2
  const moves = getLegalMoves(state)
  if (!moves.length) return null

  // Prune wall moves to most promising to keep depth search fast
  const pawnMoves = getPawnMoves(state)
  const wallMoves = getWallMoves(state)
  const candidateWalls = wallMoves
    .map(m => ({ m, s: scoreMove(state, m, player) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 8)
    .map(x => x.m)

  const candidates = [...pawnMoves, ...candidateWalls]

  let bestScore = -Infinity
  let bestMove = candidates[0]

  for (const move of candidates) {
    const next = applyMove(state, move)
    const score = minimax(next, player, depth - 1, -Infinity, Infinity, false)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
