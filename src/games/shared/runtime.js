export const PLAYER_1 = 1
export const PLAYER_2 = 2
export const DRAW = 'draw'

export const DEFAULT_GAME_UI = {
  current:    PLAYER_1,
  winner:     null,
  busy:       false,
  scores:     { p1: 0, p2: 0 },
  passed:     false,
  historyLen: 0,
}

export function createGameUiState(overrides = {}) {
  return {
    ...DEFAULT_GAME_UI,
    ...overrides,
    scores: {
      ...DEFAULT_GAME_UI.scores,
      ...(overrides.scores ?? {}),
    },
  }
}

export function incrementPlayerScore(scores, winner) {
  const next = {
    ...DEFAULT_GAME_UI.scores,
    ...(scores ?? {}),
  }
  if (winner !== PLAYER_1 && winner !== PLAYER_2) return next
  const key = winner === PLAYER_1 ? 'p1' : 'p2'
  return {
    ...next,
    [key]: next[key] + 1,
  }
}

export function normalizeGameUiState(next = {}, previous = DEFAULT_GAME_UI) {
  const base = createGameUiState(previous)
  return createGameUiState({
    current:    next.current ?? base.current,
    winner:     next.winner ?? null,
    busy:       Boolean(next.busy),
    scores:     next.scores ?? base.scores,
    passed:     next.passed ?? false,
    historyLen: next.historyLen ?? 0,
  })
}

export function deriveStatus(uiState, mode, localPlayer = PLAYER_1) {
  const { current, winner, busy, passed } = createGameUiState(uiState)
  const solo      = mode === 'solo'
  const pvp       = mode === 'pvp'
  const remotePvp = mode === 'remote-pvp'
  const myTurn    = remotePvp ? current === localPlayer : true

  if (winner === PLAYER_1) {
    if (remotePvp) return [localPlayer === PLAYER_1 ? 'You win!' : 'Opponent wins!', localPlayer === PLAYER_1 ? 'win' : 'lose']
    return [solo ? 'Solved!' : pvp ? 'Player 1 wins!' : 'You win!', 'win']
  }
  if (winner === PLAYER_2) {
    if (remotePvp) return [localPlayer === PLAYER_2 ? 'You win!' : 'Opponent wins!', localPlayer === PLAYER_2 ? 'win' : 'lose']
    return [solo ? 'Game over' : pvp ? 'Player 2 wins!' : 'AI wins!', pvp ? 'win' : 'lose']
  }
  if (winner === DRAW) return ['Draw!', 'muted']
  if (busy)            return ['Thinking...', 'muted']
  if (solo)            return ['Solving', 'p1']
  if (passed) {
    const passer = current === PLAYER_1
      ? (pvp ? 'Player 2' : remotePvp ? (localPlayer === PLAYER_2 ? 'You' : 'Opponent') : 'AI')
      : (pvp ? 'Player 1' : remotePvp ? (localPlayer === PLAYER_1 ? 'You' : 'Opponent') : 'You')
    return [`${passer} passed`, 'muted']
  }
  if (remotePvp) return myTurn ? ['Your turn', 'p1'] : ["Opponent's turn", 'p2']
  if (pvp) return current === PLAYER_1 ? ["Player 1's turn", 'p1'] : ["Player 2's turn", 'p2']
  return ['Your turn', 'p1']
}
