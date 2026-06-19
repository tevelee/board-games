import { CLASSIC, VANISHING, computeMove } from './logic.js'

export function computeTicTacToeMove(state, difficulty) {
  return computeMove({ ...state, variant: CLASSIC }, difficulty)
}

export function computeVanishingTicTacToeMove(state, difficulty) {
  return computeMove({ ...state, variant: VANISHING }, difficulty)
}
