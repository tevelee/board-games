import createTicTacToeGame from './TicTacToeGame.jsx'
import { CLASSIC } from './logic.js'

export default createTicTacToeGame({
  variant: CLASSIC,
  aiExportName: 'computeTicTacToeMove',
  title: 'Tic Tac Toe',
})
