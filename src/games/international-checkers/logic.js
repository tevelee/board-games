import { PLAYER_1 as P1, PLAYER_2 as P2 } from '../shared/runtime.js'

export { P1, P2 }

export const SIZE = 10
export const CELLS = SIZE * SIZE
export const EMPTY = 0
export const P1_KING = 3
export const P2_KING = 4

const DIAGONALS = [[-1, -1], [-1, 1], [1, -1], [1, 1]]

export function idx(row, col) { return row * SIZE + col }
export function pos(cellIdx)  { return { row: Math.floor(cellIdx / SIZE), col: cellIdx % SIZE } }
export function isDark(row, col) { return (row + col) % 2 === 1 }
export function inBounds(row, col) { return row >= 0 && row < SIZE && col >= 0 && col < SIZE }

export function makeBoard() {
  const board = new Array(CELLS).fill(EMPTY)
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (!isDark(row, col)) continue
      if (row < 4) board[idx(row, col)] = P2
      else if (row > 5) board[idx(row, col)] = P1
    }
  }
  return board
}

export function owner(piece) {
  if (piece === P1 || piece === P1_KING) return P1
  if (piece === P2 || piece === P2_KING) return P2
  return EMPTY
}

export function opponent(player) {
  return player === P1 ? P2 : P1
}

export function isKing(piece) {
  return piece === P1_KING || piece === P2_KING
}

export function crown(piece, cellIdx) {
  const { row } = pos(cellIdx)
  if (piece === P1 && row === 0) return P1_KING
  if (piece === P2 && row === SIZE - 1) return P2_KING
  return piece
}

function forwardDirections(piece) {
  return owner(piece) === P1 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]
}

function capturedCells(move) {
  if (Array.isArray(move?.captured)) return move.captured
  return move?.captured >= 0 ? [move.captured] : []
}

export function countPieces(board) {
  let p1 = 0, p2 = 0, p1Kings = 0, p2Kings = 0
  for (const piece of board) {
    if (piece === P1) p1++
    else if (piece === P2) p2++
    else if (piece === P1_KING) { p1++; p1Kings++ }
    else if (piece === P2_KING) { p2++; p2Kings++ }
  }
  return { p1, p2, p1Kings, p2Kings }
}

function makeMove(from, path, captured) {
  return {
    from,
    to: path[path.length - 1],
    path,
    captured,
    kind: captured.length ? 'capture' : 'move',
  }
}

function manCaptureSteps(board, current, piece, capturedSet) {
  const player = owner(piece)
  const opp = opponent(player)
  const { row, col } = pos(current)
  const steps = []

  for (const [dr, dc] of DIAGONALS) {
    const mr = row + dr, mc = col + dc
    const lr = row + dr * 2, lc = col + dc * 2
    if (!inBounds(mr, mc) || !inBounds(lr, lc)) continue

    const middle = idx(mr, mc)
    const landing = idx(lr, lc)
    if (owner(board[middle]) === opp && !capturedSet.has(middle) && board[landing] === EMPTY) {
      steps.push({ captured: middle, to: landing })
    }
  }

  return steps
}

function kingCaptureSteps(board, current, piece, capturedSet) {
  const player = owner(piece)
  const opp = opponent(player)
  const { row, col } = pos(current)
  const steps = []

  for (const [dr, dc] of DIAGONALS) {
    let seenOpponent = -1
    let r = row + dr
    let c = col + dc

    while (inBounds(r, c)) {
      const cell = idx(r, c)
      const cellOwner = owner(board[cell])

      if (cellOwner === EMPTY) {
        if (seenOpponent >= 0) steps.push({ captured: seenOpponent, to: cell })
      } else if (cellOwner === player) {
        break
      } else if (cellOwner === opp) {
        if (seenOpponent >= 0 || capturedSet.has(cell)) break
        seenOpponent = cell
      }

      r += dr
      c += dc
    }
  }

  return steps
}

function captureSteps(board, current, piece, capturedSet) {
  return isKing(piece)
    ? kingCaptureSteps(board, current, piece, capturedSet)
    : manCaptureSteps(board, current, piece, capturedSet)
}

function continueCaptures(board, from, current, piece, captured, path, capturedSet) {
  const steps = captureSteps(board, current, piece, capturedSet)
  if (!steps.length) return captured.length ? [makeMove(from, path, captured)] : []

  const moves = []
  for (const step of steps) {
    const nextBoard = [...board]
    nextBoard[current] = EMPTY
    nextBoard[step.to] = piece

    const nextCaptured = [...captured, step.captured]
    const nextCapturedSet = new Set(capturedSet)
    nextCapturedSet.add(step.captured)

    moves.push(...continueCaptures(
      nextBoard,
      from,
      step.to,
      piece,
      nextCaptured,
      [...path, step.to],
      nextCapturedSet
    ))
  }

  return moves
}

export function getPieceCaptures(board, from) {
  const piece = board[from]
  if (!piece) return []
  return continueCaptures(board, from, from, piece, [], [from], new Set())
}

function getQuietMoves(board, from) {
  const piece = board[from]
  if (!piece) return []

  const { row, col } = pos(from)
  const moves = []

  if (isKing(piece)) {
    for (const [dr, dc] of DIAGONALS) {
      let r = row + dr
      let c = col + dc
      while (inBounds(r, c)) {
        const to = idx(r, c)
        if (board[to] !== EMPTY) break
        moves.push(makeMove(from, [from, to], []))
        r += dr
        c += dc
      }
    }
  } else {
    for (const [dr, dc] of forwardDirections(piece)) {
      const r = row + dr
      const c = col + dc
      if (!inBounds(r, c)) continue
      const to = idx(r, c)
      if (board[to] === EMPTY) moves.push(makeMove(from, [from, to], []))
    }
  }

  return moves
}

export function getPieceMoves(board, from, captureOnly = false) {
  const captures = getPieceCaptures(board, from)
  if (captureOnly || captures.length) return captures
  return getQuietMoves(board, from)
}

export function getCaptureMoves(board, player) {
  const captures = []
  for (let i = 0; i < CELLS; i++) {
    if (owner(board[i]) === player) captures.push(...getPieceCaptures(board, i))
  }
  return captures
}

export function getValidMoves(board, player) {
  const captures = getCaptureMoves(board, player)
  if (captures.length) {
    const maxCaptured = Math.max(...captures.map(move => move.captured.length))
    return captures.filter(move => move.captured.length === maxCaptured)
  }

  const moves = []
  for (let i = 0; i < CELLS; i++) {
    if (owner(board[i]) === player) moves.push(...getQuietMoves(board, i))
  }
  return moves
}

export function applyMove(board, move) {
  const next = [...board]
  const piece = next[move.from]
  const captured = capturedCells(move)
  const capturedPieces = captured.map(cell => next[cell])

  next[move.from] = EMPTY
  for (const cell of captured) next[cell] = EMPTY

  const crowned = crown(piece, move.to)
  next[move.to] = crowned

  return {
    board: next,
    captured,
    capturedPieces,
    promoted: crowned !== piece,
  }
}

export function getWinner(board) {
  const { p1, p2 } = countPieces(board)
  if (p1 === 0) return P2
  if (p2 === 0) return P1
  if (getValidMoves(board, P1).length === 0) return P2
  if (getValidMoves(board, P2).length === 0) return P1
  return null
}
