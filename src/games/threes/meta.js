export default {
  hint: 'Slide one cell · 1+2 makes 3 · Matching 3+ tiles merge',
  scoreLabels: ['Score', 'Best'],
  rules: {
    objective: 'Build high-value tiles by pairing 1s with 2s and merging equal multiples of 3.',
    bullets: [
      'Each move shifts movable tiles one cell in the chosen direction.',
      'A 1 and a 2 merge into a 3.',
      'Tiles from 3 upward merge only with an equal tile.',
      'The next tile enters from the far edge in a row or column that moved.',
      'The run ends when no tile can move or merge.',
    ],
  },
}
