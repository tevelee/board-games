import GameCanvas from './components/GameCanvas'
import MorrisBoard from './components/MorrisBoard'
import OthelloBoard from './components/OthelloBoard'
import Connect4Board from './components/Connect4Board'
import AtaxxGame from './games/ataxx/Game.jsx'
import CheckersGame from './games/checkers/Game.jsx'
import DotsBoxesGame from './games/dots-boxes/Game.jsx'
import { gamesById } from './gameRegistry.js'

export const playableGames = [
  {
    ...gamesById.gomoku,
    Component: GameCanvas,
    hint: 'Drag · Pinch/scroll to zoom · Tap to place',
  },
  {
    ...gamesById.morris,
    Component: MorrisBoard,
    hint: 'Tap a node to place · Tap piece then target to move',
  },
  {
    ...gamesById.othello,
    Component: OthelloBoard,
  },
  {
    ...gamesById.connect4,
    Component: Connect4Board,
  },
  {
    ...gamesById.ataxx,
    Component: AtaxxGame,
    hint: 'Tap a piece · Clone nearby or jump two cells',
  },
  {
    ...gamesById.checkers,
    Component: CheckersGame,
    hint: 'Captures are forced · Chain jumps continue',
  },
  {
    ...gamesById['dots-boxes'],
    Component: DotsBoxesGame,
    hint: 'Tap an open edge · Completing a box earns another turn',
    options: [
      {
        id: 'boardSize',
        label: 'Board size',
        defaultValue: '4',
        options: [
          { value: '3', label: '3x3' },
          { value: '4', label: '4x4' },
          { value: '5', label: '5x5' },
          { value: '6', label: '6x6' },
        ],
      },
    ],
  },
]

export const playableGameIds = playableGames.map(game => game.id)
export const playableGamesById = Object.fromEntries(playableGames.map(game => [game.id, game]))
