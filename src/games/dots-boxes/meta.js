export default {
  hint: 'Tap an open edge · Completing a box earns another turn',
  rules: {
    objective: 'Claim more boxes than your opponent.',
    bullets: [
      'Tap one open edge between two dots each turn.',
      'Completing the fourth side of a box claims it for you.',
      'Claiming at least one box gives you another turn.',
      'The game ends when every edge is drawn.',
    ],
  },
  options: [
    {
      id: 'boardSize',
      label: 'Board size',
      defaultValue: '4',
      options: [
        { value: '3', label: '3x3' },
        { value: '4', label: '4x4' },
        { value: '5', label: '5x5' },
        { value: '6', label: '6x6' },
      ],
    },
  ],
}
