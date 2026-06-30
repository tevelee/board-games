export default {
  hint: 'Swipe or press arrows · Equal tiles merge',
  scoreLabels: ['Score', 'Best'],
  rules: {
    objective: 'Build the largest power-of-two tile you can before the board locks.',
    bullets: [
      'Each move slides every tile as far as it can go.',
      'Equal tiles that collide merge once into their sum.',
      'A valid move adds a new 2 or 4 tile to an empty cell.',
      'The run ends when no slide or merge is possible.',
    ],
  },
}
