export default {
  hint: 'Drag a piece onto the board · Complete rows or columns',
  scoreLabels: ['Score', 'Best'],
  rules: {
    objective: 'Score as much as possible before no tray piece fits.',
    bullets: [
      'Drag one of the three tray pieces onto empty board cells.',
      'Full rows or columns clear and award bonus points.',
      'After all three tray pieces are placed, a new tray appears.',
      'The run ends when none of the available pieces can fit.',
    ],
  },
}
