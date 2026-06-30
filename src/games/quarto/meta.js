export default {
  hint: 'Choose a piece for the opponent · Place the piece you receive',
  rules: {
    objective: 'Place the fourth piece in a row whose pieces share at least one attribute.',
    bullets: [
      'Every piece is unique: tall or short, light or dark, round or square, solid or hollow.',
      'On your turn, place the piece chosen for you.',
      'After placing, choose any remaining piece for your opponent to place.',
      'Four pieces in a row win if they share any one attribute.',
      'Rows, columns, and the two diagonals count.',
    ],
  },
}
