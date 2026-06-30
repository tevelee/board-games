export default {
  hint: 'Longest captures are forced · Kings fly',
  rules: {
    objective: 'Capture all opposing pieces or leave the opponent without a legal move.',
    bullets: [
      'The game uses a 10x10 board with 20 men per player.',
      'Men move one square diagonally forward, but capture forward or backward.',
      'Captures are mandatory, and you must choose a sequence that captures the most pieces.',
      'Kings move and capture across any distance on open diagonals.',
      'A man becomes a king only if its completed move ends on the far row.',
    ],
  },
}
