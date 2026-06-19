import { DRAW, PLAYER_1 as P1, PLAYER_2 as P2, incrementPlayerScore } from '../shared/runtime.js'

export { DRAW, P1, P2 }

export const SIZE = 3
export const BOARD_COUNT = 9
export const CELL_COUNT = 9
export const EMPTY = 0

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

export function makeState() {
  return withScores({
    boards: Array.from({ length: BOARD_COUNT }, () => new Array(CELL_COUNT).fill(EMPTY)),
    boardWinners: new Array(BOARD_COUNT).fill(EMPTY),
    boardWinLines: new Array(BOARD_COUNT).fill(null),
    activeBoard: null,
    current: P1,
    winner: null,
    winLine: null,
    moveCount: 0,
    lastMove: null,
    busy: false,
    scores: { p1: 0, p2: 0 },
  })
}

export function getPlayableBoards(state) {
  if (state.winner) return []

  if (
    state.activeBoard != null &&
    state.boardWinners[state.activeBoard] === EMPTY &&
    !isSmallBoardFull(state.boards[state.activeBoard])
  ) {
    return [state.activeBoard]
  }

  return state.boards
    .map((board, index) => (
      state.boardWinners[index] === EMPTY && !isSmallBoardFull(board) ? index : -1
    ))
    .filter(index => index >= 0)
}

export function getLegalMoves(state) {
  const playableBoards = getPlayableBoards(state)
  return playableBoards.flatMap(boardIndex =>
    state.boards[boardIndex]
      .map((cell, cellIndex) => cell === EMPTY ? { boardIndex, cellIndex } : null)
      .filter(Boolean)
  )
}

export function isLegalMove(state, boardIndex, cellIndex) {
  if (state.winner) return false
  if (state.boards[boardIndex]?.[cellIndex] !== EMPTY) return false
  return getPlayableBoards(state).includes(boardIndex)
}

export function applyMove(state, boardIndex, cellIndex) {
  if (!isLegalMove(state, boardIndex, cellIndex)) return state

  const player = state.current
  const boards = state.boards.map(board => [...board])
  const boardWinners = [...state.boardWinners]
  const boardWinLines = [...state.boardWinLines]

  boards[boardIndex][cellIndex] = player

  if (boardWinners[boardIndex] === EMPTY) {
    const smallResult = getSmallBoardResult(boards[boardIndex])
    if (smallResult.winner) {
      boardWinners[boardIndex] = smallResult.winner
      boardWinLines[boardIndex] = smallResult.line
    }
  }

  const macro = getMacroResult(boardWinners)
  const allDone = boardWinners.every(Boolean)
  const winner = macro.winner ?? (allDone ? DRAW : null)
  const activeBoard = winner
    ? null
    : boardWinners[cellIndex] === EMPTY && !isSmallBoardFull(boards[cellIndex])
      ? cellIndex
      : null
  const scores = winner === P1 || winner === P2
    ? incrementPlayerScore(state.scores, winner)
    : state.scores

  return withScores({
    ...state,
    boards,
    boardWinners,
    boardWinLines,
    activeBoard,
    current: winner ? player : otherPlayer(player),
    winner,
    winLine: macro.line,
    moveCount: state.moveCount + 1,
    lastMove: { boardIndex, cellIndex, player },
    busy: false,
    scores,
  })
}

export function getSmallBoardResult(board) {
  for (const player of [P1, P2]) {
    const line = WIN_LINES.find(candidate => candidate.every(index => board[index] === player))
    if (line) return { winner: player, line }
  }

  if (isSmallBoardFull(board)) return { winner: DRAW, line: null }
  return { winner: null, line: null }
}

export function getMacroResult(boardWinners) {
  for (const player of [P1, P2]) {
    const line = WIN_LINES.find(candidate => candidate.every(index => boardWinners[index] === player))
    if (line) return { winner: player, line }
  }
  return { winner: null, line: null }
}

export function isSmallBoardFull(board) {
  return board.every(Boolean)
}

export function otherPlayer(player) {
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
