export default {
  hint: 'Your move sends the opponent to the matching small board',
  rules: {
    objective: 'Win three small boards in a row on the large board.',
    bullets: [
      'Each small board is a normal tic-tac-toe board.',
      'The cell you choose sends the opponent to the matching small board.',
      'If that target board is already won or full, the opponent may play in any unfinished board.',
      'Win a small board to claim its square on the large board.',
      'Three claimed boards in a row wins the game.',
    ],
  },
}
