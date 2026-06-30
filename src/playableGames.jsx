import GomokuGame from './games/gomoku/Game.jsx'
import gomokuMeta from './games/gomoku/meta.js'
import MorrisGame from './games/morris/Game.jsx'
import morrisMeta from './games/morris/meta.js'
import OthelloGame from './games/othello/Game.jsx'
import othelloMeta from './games/othello/meta.js'
import Connect4Game from './games/connect4/Game.jsx'
import connect4Meta from './games/connect4/meta.js'
import AtaxxGame from './games/ataxx/Game.jsx'
import ataxxMeta from './games/ataxx/meta.js'
import HexGame from './games/hex/Game.jsx'
import hexMeta from './games/hex/meta.js'
import PentagoGame from './games/pentago/Game.jsx'
import pentagoMeta from './games/pentago/meta.js'
import QuartoGame from './games/quarto/Game.jsx'
import quartoMeta from './games/quarto/meta.js'
import CheckersGame from './games/checkers/Game.jsx'
import checkersMeta from './games/checkers/meta.js'
import InternationalCheckersGame from './games/international-checkers/Game.jsx'
import internationalCheckersMeta from './games/international-checkers/meta.js'
import DotsBoxesGame from './games/dots-boxes/Game.jsx'
import dotsBoxesMeta from './games/dots-boxes/meta.js'
import TicTacToeGame from './games/tic-tac-toe/Game.jsx'
import ticTacToeMeta from './games/tic-tac-toe/meta.js'
import UltimateTicTacToeGame from './games/ultimate-tic-tac-toe/Game.jsx'
import ultimateTicTacToeMeta from './games/ultimate-tic-tac-toe/meta.js'
import VanishingTicTacToeGame from './games/tic-tac-toe-disappear/Game.jsx'
import vanishingTicTacToeMeta from './games/tic-tac-toe-disappear/meta.js'
import SudokuGame from './games/sudoku/Game.jsx'
import sudokuMeta from './games/sudoku/meta.js'
import BackgammonGame from './games/backgammon/Game.jsx'
import backgammonMeta from './games/backgammon/meta.js'
import NonogramGame from './games/nonogram/Game.jsx'
import nonogramMeta from './games/nonogram/meta.js'
import BlockPuzzleGame from './games/block-puzzle/Game.jsx'
import blockPuzzleMeta from './games/block-puzzle/meta.js'
import TwentyFortyEightGame from './games/2048/Game.jsx'
import twentyFortyEightMeta from './games/2048/meta.js'
import ThreesGame from './games/threes/Game.jsx'
import threesMeta from './games/threes/meta.js'
import HiveGame from './games/hive/Game.jsx'
import hiveMeta from './games/hive/meta.js'
import QuoridorGame from './games/quoridor/Game.jsx'
import quoridorMeta from './games/quoridor/meta.js'
import MastermindGame from './games/mastermind/Game.jsx'
import mastermindMeta from './games/mastermind/meta.js'
import { gamesById } from './gameRegistry.js'

// Each entry pairs a catalog id (defined in gameRegistry.js) with that game's
// board component and its colocated meta.js (hint/rules/options/scoreLabels).
const registrations = [
  ['gomoku', GomokuGame, gomokuMeta],
  ['morris', MorrisGame, morrisMeta],
  ['othello', OthelloGame, othelloMeta],
  ['connect4', Connect4Game, connect4Meta],
  ['ataxx', AtaxxGame, ataxxMeta],
  ['hex', HexGame, hexMeta],
  ['pentago', PentagoGame, pentagoMeta],
  ['quarto', QuartoGame, quartoMeta],
  ['checkers', CheckersGame, checkersMeta],
  ['international-checkers', InternationalCheckersGame, internationalCheckersMeta],
  ['dots-boxes', DotsBoxesGame, dotsBoxesMeta],
  ['tic-tac-toe', TicTacToeGame, ticTacToeMeta],
  ['ultimate-tic-tac-toe', UltimateTicTacToeGame, ultimateTicTacToeMeta],
  ['tic-tac-toe-disappear', VanishingTicTacToeGame, vanishingTicTacToeMeta],
  ['backgammon', BackgammonGame, backgammonMeta],
  ['nonogram', NonogramGame, nonogramMeta],
  ['block-puzzle', BlockPuzzleGame, blockPuzzleMeta],
  ['2048', TwentyFortyEightGame, twentyFortyEightMeta],
  ['threes', ThreesGame, threesMeta],
  ['sudoku', SudokuGame, sudokuMeta],
  ['mastermind', MastermindGame, mastermindMeta],
  ['quoridor', QuoridorGame, quoridorMeta],
  ['hive', HiveGame, hiveMeta],
]

export const playableGames = registrations.map(([id, Component, meta]) => ({
  ...gamesById[id],
  Component,
  ...meta,
}))

export const playableGameIds = playableGames.map(game => game.id)
export const playableGamesById = Object.fromEntries(playableGames.map(game => [game.id, game]))
