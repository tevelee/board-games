export default {
  hint: 'Tap a cell to move · Use Place Wall button to add walls',
  rules: {
    objective: 'Be the first to move your pawn to the opposite side of the board.',
    bullets: [
      'Player 1 (blue) starts at the bottom and must reach the top row.',
      'Player 2 (red) starts at the top and must reach the bottom row.',
      'Each turn, either move your pawn one step or place a wall.',
      'Walls block movement for both players and are 2 cells long.',
      'A wall cannot fully cut off either player from their goal.',
      'If adjacent to your opponent, you may jump over them or diagonally around them.',
      'Each player has 10 walls — use them wisely.',
    ],
  },
}
