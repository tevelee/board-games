import { getValidMoves, parseEdge, thirdSideRisk, wouldCompleteBoxes } from './logic.js'

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)] ?? null
}

function movesWithScore(state, player) {
  return getValidMoves(state).map(key => ({
    key,
    score: wouldCompleteBoxes(state, key, player),
    risk: thirdSideRisk(state, key),
  }))
}

export function computeDotsMove(state, player, difficulty = 'medium') {
  const moves = movesWithScore(state, player)
  if (!moves.length) return null

  if (difficulty === 'easy' && Math.random() < 0.35) {
    return chooseRandom(moves).key
  }

  const scoring = moves.filter(move => move.score > 0)
  if (scoring.length) {
    const bestScore = Math.max(...scoring.map(move => move.score))
    const best = scoring.filter(move => move.score === bestScore)
    return chooseRandom(best).key
  }

  if (difficulty === 'easy') return chooseRandom(moves).key

  const safe = moves.filter(move => move.risk === 0)
  if (safe.length) return chooseRandom(safe).key

  const lowestRisk = Math.min(...moves.map(move => move.risk))
  const leastBad = moves.filter(move => move.risk === lowestRisk)

  if (difficulty === 'expert' || difficulty === 'hard') {
    const edgeMoves = leastBad.filter(move => {
      const edge = parseEdge(move.key)
      return edge.type === 'h'
        ? edge.row === 0 || edge.row === state.size
        : edge.col === 0 || edge.col === state.size
    })
    if (edgeMoves.length) return chooseRandom(edgeMoves).key
  }

  return chooseRandom(leastBad).key
}
