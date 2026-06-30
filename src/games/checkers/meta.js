export default {
  hint: 'Captures are forced · Chain jumps continue',
  rules: {
    objective: 'Capture all opposing pieces or block every opposing move.',
    bullets: [
      'Men move diagonally forward on dark squares.',
      'Jump over an adjacent enemy piece to capture it.',
      'Captures are mandatory, and extra jumps with the same piece continue.',
      'Reach the far row to become a king, which moves diagonally both ways.',
    ],
  },
}
