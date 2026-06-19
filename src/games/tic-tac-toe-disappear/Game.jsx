import createTicTacToeGame from '../tic-tac-toe/TicTacToeGame.jsx'
import { VANISHING } from '../tic-tac-toe/logic.js'

export default createTicTacToeGame({
  variant: VANISHING,
  aiExportName: 'computeVanishingTicTacToeMove',
  title: 'Vanishing Tic Tac Toe',
})
