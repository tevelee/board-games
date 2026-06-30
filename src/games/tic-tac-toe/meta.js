export default {
  hint: 'Tap an empty square · Make three in a row',
  rules: {
    objective: 'Make three marks in a row before your opponent does.',
    bullets: [
      'Players alternate placing one mark in an empty square.',
      'Three marks in a row wins horizontally, vertically, or diagonally.',
      'If all squares fill with no three-in-a-row, the game is a draw.',
    ],
  },
}
