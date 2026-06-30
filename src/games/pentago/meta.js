export default {
  hint: 'Place a marble, then rotate a quadrant',
  rules: {
    objective: 'Make five marbles in a row before your opponent does.',
    bullets: [
      'Place one marble on any empty space.',
      'If that placement makes five in a row, you win immediately.',
      'Otherwise rotate one quadrant 90 degrees clockwise or counterclockwise.',
      'Five can run horizontally, vertically, or diagonally across quadrants.',
      'If one rotation gives both players five in a row, the game is a draw.',
    ],
  },
}
