export default {
  hint: 'Pick colors · Submit a full row · Read exact and color clues',
  scoreLabels: ['Solved', 'Turns'],
  rules: {
    objective: 'Deduce the hidden color code before the turns run out.',
    bullets: [
      'Fill each row with one color per slot, then submit the row.',
      'Exact feedback means a color is correct and in the correct slot.',
      'Color feedback means a color is in the code but in another slot.',
      'Duplicates can appear from medium difficulty upward.',
      'The secret is revealed after solving or after the final turn.',
    ],
  },
}
