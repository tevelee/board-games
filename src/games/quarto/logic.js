import {
  DRAW,
  PLAYER_1 as P1,
  PLAYER_2 as P2,
  incrementPlayerScore,
} from '../shared/runtime.js'

export { DRAW, P1, P2 }

export const SIZE = 4
export const CELL_COUNT = SIZE * SIZE
export const PIECE_MASK = 0b1111
export const PHASE_PLACE = 'place'
export const PHASE_SELECT = 'select'

export const ATTRIBUTES = [
  { bit: 0b0001, zero: 'short', one: 'tall' },
  { bit: 0b0010, zero: 'light', one: 'dark' },
  { bit: 0b0100, zero: 'round', one: 'square' },
  { bit: 0b1000, zero: 'solid', one: 'hollow' },
]

export const PIECES = Array.from({ length: CELL_COUNT }, (_, id) => ({
  id,
  tall: Boolean(id & 0b0001),
  dark: Boolean(id & 0b0010),
  square: Boolean(id & 0b0100),
  hollow: Boolean(id & 0b1000),
}))

export const WIN_LINES = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12],
]

export function makeBoard() {
  return Array(CELL_COUNT).fill(null)
}

export function makeInitialState() {
  return {
    board: makeBoard(),
    current: P1,
    phase: PHASE_SELECT,
    selectedPiece: null,
    winner: null,
    winLine: null,
    winAttributes: [],
    busy: false,
    scores: { p1: 0, p2: 0 },
    lastAction: null,
  }
}

export function opponent(player) {
  return player === P1 ? P2 : P1
}

export function isValidPiece(piece) {
  return Number.isInteger(piece) && piece >= 0 && piece < CELL_COUNT
}

export function getPieceAttributes(piece) {
  const id = isValidPiece(piece) ? piece : 0
  return {
    tall: Boolean(id & 0b0001),
    dark: Boolean(id & 0b0010),
    square: Boolean(id & 0b0100),
    hollow: Boolean(id & 0b1000),
  }
}

export function describePiece(piece) {
  const attrs = getPieceAttributes(piece)
  return [
    attrs.tall ? 'tall' : 'short',
    attrs.dark ? 'dark' : 'light',
    attrs.square ? 'square' : 'round',
    attrs.hollow ? 'hollow' : 'solid',
  ].join(' ')
}

export function isBoardFull(board) {
  return board.every(Number.isInteger)
}

export function getPlacedCount(board) {
  return board.filter(Number.isInteger).length
}

export function getEmptyCells(board) {
  return board
    .map((piece, cell) => Number.isInteger(piece) ? null : cell)
    .filter(Number.isInteger)
}

export function getAvailablePieces(board, selectedPiece = null) {
  const used = new Set(board.filter(Number.isInteger))
  if (isValidPiece(selectedPiece)) used.add(selectedPiece)
  return PIECES.map(piece => piece.id).filter(piece => !used.has(piece))
}

export function isPieceAvailable(board, selectedPiece, piece) {
  return getAvailablePieces(board, selectedPiece).includes(piece)
}

export function getSharedAttributeMask(pieces) {
  if (pieces.length !== SIZE || pieces.some(piece => !isValidPiece(piece))) return 0

  let allOnes = PIECE_MASK
  let allZeros = PIECE_MASK
  for (const piece of pieces) {
    allOnes &= piece
    allZeros &= (~piece) & PIECE_MASK
  }
  return (allOnes | allZeros) & PIECE_MASK
}

export function getSharedAttributeLabels(pieces) {
  if (pieces.length !== SIZE || pieces.some(piece => !isValidPiece(piece))) return []

  return ATTRIBUTES.flatMap(attribute => {
    const allOne = pieces.every(piece => Boolean(piece & attribute.bit))
    const allZero = pieces.every(piece => !Boolean(piece & attribute.bit))
    if (allOne) return [attribute.one]
    if (allZero) return [attribute.zero]
    return []
  })
}

export function detectWin(board) {
  for (const line of WIN_LINES) {
    const pieces = line.map(cell => board[cell])
    const mask = getSharedAttributeMask(pieces)
    if (!mask) continue

    return {
      line,
      mask,
      labels: getSharedAttributeLabels(pieces),
    }
  }
  return null
}

export function wouldWin(board, cell, piece) {
  if (!Number.isInteger(cell) || cell < 0 || cell >= CELL_COUNT) return false
  if (Number.isInteger(board[cell]) || !isValidPiece(piece)) return false

  const nextBoard = [...board]
  nextBoard[cell] = piece
  return Boolean(detectWin(nextBoard))
}

export function getWinningPlacements(board, piece) {
  if (!isValidPiece(piece)) return []
  return getEmptyCells(board).filter(cell => wouldWin(board, cell, piece))
}

export function selectPiece(state, piece) {
  if (state.winner || state.phase !== PHASE_SELECT) return state
  if (!isPieceAvailable(state.board, state.selectedPiece, piece)) return state

  const player = state.current
  const recipient = opponent(player)
  return {
    ...state,
    current: recipient,
    phase: PHASE_PLACE,
    selectedPiece: piece,
    lastAction: { kind: PHASE_SELECT, player, recipient, piece },
  }
}

export function placePiece(state, cell) {
  if (state.winner || state.phase !== PHASE_PLACE) return state
  if (!isValidPiece(state.selectedPiece)) return state
  if (!Number.isInteger(cell) || cell < 0 || cell >= CELL_COUNT) return state
  if (Number.isInteger(state.board[cell])) return state

  const piece = state.selectedPiece
  const board = [...state.board]
  board[cell] = piece
  const win = detectWin(board)
  const winner = win ? state.current : isBoardFull(board) ? DRAW : null

  return {
    ...state,
    board,
    phase: winner ? state.phase : PHASE_SELECT,
    selectedPiece: null,
    winner,
    winLine: win?.line ?? null,
    winAttributes: win?.labels ?? [],
    scores: winner ? incrementPlayerScore(state.scores, winner) : state.scores,
    lastAction: { kind: PHASE_PLACE, player: state.current, piece, cell },
  }
}
