import {
  DRAW,
  PHASE_PLACE,
  PHASE_SELECT,
  detectWin,
  getAvailablePieces,
  getEmptyCells,
  getWinningPlacements,
  isValidPiece,
  opponent,
  WIN_LINES,
} from './logic.js'

const WIN_SCORE = 100000
const PIECE_MASK = 0b1111

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function centerScore(cell) {
  const row = Math.floor(cell / 4)
  const col = cell % 4
  return 4 - (Math.abs(row - 1.5) + Math.abs(col - 1.5))
}

function makePlaceNode(board, selectedPiece, current, cell) {
  const nextBoard = [...board]
  nextBoard[cell] = selectedPiece
  const win = detectWin(nextBoard)
  const winner = win ? current : getEmptyCells(nextBoard).length === 0 ? DRAW : null

  return {
    board: nextBoard,
    selectedPiece: null,
    phase: PHASE_SELECT,
    current,
    winner,
  }
}

function makeSelectNode(board, current, piece) {
  return {
    board,
    selectedPiece: piece,
    phase: PHASE_PLACE,
    current: opponent(current),
    winner: null,
  }
}

function countUnsafePieces(board, selectedPiece = null) {
  return getAvailablePieces(board, selectedPiece)
    .reduce((count, piece) => count + (getWinningPlacements(board, piece).length ? 1 : 0), 0)
}

function sharedPartialMask(pieces) {
  if (pieces.some(piece => !isValidPiece(piece))) return 0

  let allOnes = PIECE_MASK
  let allZeros = PIECE_MASK
  for (const piece of pieces) {
    allOnes &= piece
    allZeros &= (~piece) & PIECE_MASK
  }
  return (allOnes | allZeros) & PIECE_MASK
}

function linePotential(board) {
  let score = 0
  for (const line of WIN_LINES) {
    const pieces = line.map(cell => board[cell])
    const filled = pieces.filter(Number.isInteger)
    if (filled.length < 2 || filled.length === 4) continue
    const empties = 4 - filled.length
    const shared = sharedPartialMask(filled)
    if (shared) score += filled.length * filled.length - empties
  }
  return score
}

function placementHeuristic(board, cell, piece, current) {
  const next = makePlaceNode(board, piece, current, cell)
  if (next.winner) return WIN_SCORE

  const available = getAvailablePieces(next.board)
  const unsafe = countUnsafePieces(next.board)
  const safe = available.length - unsafe
  return safe * 80 - unsafe * 140 + centerScore(cell) * 3 + linePotential(next.board)
}

function selectionHeuristic(board, piece) {
  const wins = getWinningPlacements(board, piece).length
  return -wins * 1000 + (piece % 4)
}

function orderedPlacements(board, piece, current, maximizingPlayer) {
  const sign = current === maximizingPlayer ? 1 : -1
  return getEmptyCells(board)
    .map(cell => ({ cell, score: placementHeuristic(board, cell, piece, current) * sign }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.cell)
}

function orderedSelections(board, selectedPiece, current, maximizingPlayer) {
  const sign = current === maximizingPlayer ? 1 : -1
  return getAvailablePieces(board, selectedPiece)
    .map(piece => ({ piece, score: selectionHeuristic(board, piece) * sign }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.piece)
}

function evaluate(node, maximizingPlayer) {
  if (node.winner === DRAW) return 0
  if (node.winner) return node.winner === maximizingPlayer ? WIN_SCORE : -WIN_SCORE

  const sign = node.current === maximizingPlayer ? 1 : -1

  if (node.phase === PHASE_PLACE && isValidPiece(node.selectedPiece)) {
    const wins = getWinningPlacements(node.board, node.selectedPiece).length
    if (wins) return sign * (6500 + wins * 300)
    return sign * (linePotential(node.board) - countUnsafePieces(node.board, node.selectedPiece) * 80)
  }

  const risks = getAvailablePieces(node.board, node.selectedPiece)
    .map(piece => getWinningPlacements(node.board, piece).length)
  if (!risks.length) return 0

  const safe = risks.filter(risk => risk === 0).length
  const minRisk = Math.min(...risks)
  const selectScore = safe ? 500 + safe * 30 : -6000 - minRisk * 500
  return sign * selectScore
}

function terminalScore(winner, maximizingPlayer, depth) {
  if (winner === DRAW) return 0
  return winner === maximizingPlayer ? WIN_SCORE + depth : -WIN_SCORE - depth
}

function minimax(node, maximizingPlayer, depth, alpha, beta) {
  if (node.winner) return terminalScore(node.winner, maximizingPlayer, depth)
  if (depth <= 0) return evaluate(node, maximizingPlayer)

  const maximizing = node.current === maximizingPlayer

  if (node.phase === PHASE_PLACE) {
    const placements = orderedPlacements(node.board, node.selectedPiece, node.current, maximizingPlayer)
    if (!placements.length) return 0

    if (maximizing) {
      let best = -Infinity
      for (const cell of placements) {
        const score = minimax(makePlaceNode(node.board, node.selectedPiece, node.current, cell), maximizingPlayer, depth - 1, alpha, beta)
        best = Math.max(best, score)
        alpha = Math.max(alpha, best)
        if (beta <= alpha) break
      }
      return best
    }

    let best = Infinity
    for (const cell of placements) {
      const score = minimax(makePlaceNode(node.board, node.selectedPiece, node.current, cell), maximizingPlayer, depth - 1, alpha, beta)
      best = Math.min(best, score)
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }

  const selections = orderedSelections(node.board, node.selectedPiece, node.current, maximizingPlayer)
  if (!selections.length) return 0

  if (maximizing) {
    let best = -Infinity
    for (const piece of selections) {
      const score = minimax(makeSelectNode(node.board, node.current, piece), maximizingPlayer, depth - 1, alpha, beta)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  }

  let best = Infinity
  for (const piece of selections) {
    const score = minimax(makeSelectNode(node.board, node.current, piece), maximizingPlayer, depth - 1, alpha, beta)
    best = Math.min(best, score)
    beta = Math.min(beta, best)
    if (beta <= alpha) break
  }
  return best
}

function chooseBySearch(node, difficulty) {
  const depth = difficulty === 'expert' ? 4 : 3
  const maximizingPlayer = node.current
  let bestScore = -Infinity
  let bestAction = null

  if (node.phase === PHASE_PLACE) {
    for (const cell of orderedPlacements(node.board, node.selectedPiece, node.current, maximizingPlayer)) {
      const score = minimax(makePlaceNode(node.board, node.selectedPiece, node.current, cell), maximizingPlayer, depth - 1, -Infinity, Infinity)
      if (score > bestScore) {
        bestScore = score
        bestAction = { cell }
      }
    }
    return bestAction
  }

  for (const piece of orderedSelections(node.board, node.selectedPiece, node.current, maximizingPlayer)) {
    const score = minimax(makeSelectNode(node.board, node.current, piece), maximizingPlayer, depth - 1, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestAction = { piece }
    }
  }
  return bestAction
}

function chooseMedium(node) {
  if (node.phase === PHASE_PLACE) {
    const winningCells = getWinningPlacements(node.board, node.selectedPiece)
    if (winningCells.length) {
      return { cell: winningCells.sort((a, b) => centerScore(b) - centerScore(a))[0] }
    }
    const cell = orderedPlacements(node.board, node.selectedPiece, node.current, node.current)[0]
    return Number.isInteger(cell) ? { cell } : null
  }

  const piece = orderedSelections(node.board, node.selectedPiece, node.current, node.current)[0]
  return isValidPiece(piece) ? { piece } : null
}

export function computeQuartoAction(board, selectedPiece, phase, player, difficulty) {
  const node = {
    board,
    selectedPiece,
    phase,
    current: player,
    winner: null,
  }

  if (phase === PHASE_PLACE) {
    const cells = getEmptyCells(board)
    if (!cells.length || !isValidPiece(selectedPiece)) return null
    if (difficulty === 'easy') return { cell: randomItem(cells) }
    return difficulty === 'medium'
      ? chooseMedium(node)
      : chooseBySearch(node, difficulty)
  }

  const pieces = getAvailablePieces(board, selectedPiece)
  if (!pieces.length) return null
  if (difficulty === 'easy') return { piece: randomItem(pieces) }
  return difficulty === 'medium'
    ? chooseMedium(node)
    : chooseBySearch(node, difficulty)
}
