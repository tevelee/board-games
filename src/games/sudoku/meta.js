export default {
  hint: 'Fill every row, column, and 3x3 box',
  scoreLabels: ['Filled', 'Mistakes'],
  rules: {
    objective: 'Fill the grid so every row, column, and 3x3 box contains 1-9.',
    bullets: [
      'Select an empty cell, then choose a number.',
      'Each number can appear once per row, column, and box.',
      'Use notes to track candidates when you are unsure.',
      'The puzzle is solved when every cell is filled correctly.',
    ],
  },
}
