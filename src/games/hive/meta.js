export default {
  hint: 'Tap a reserve tile · Surround the opposing queen',
  scoreLabels: ['P1', 'P2'],
  rules: {
    objective: 'Surround the opposing queen before your own queen is surrounded.',
    bullets: [
      'Place reserve pieces touching your own hive pieces, not the opponent.',
      'Your queen must be placed by your fourth turn.',
      'After your queen is placed, top pieces can move by their piece rules.',
      'Moves may not split the hive into separate groups.',
      'If both queens are surrounded at once, the game is a draw.',
    ],
  },
}
