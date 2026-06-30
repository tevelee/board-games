export default {
  hint: 'Fill clue runs · Mark blanks · Right-click marks',
  scoreLabels: ['Filled', 'Mistakes'],
  rules: {
    objective: 'Reveal the hidden picture by satisfying every row and column clue.',
    bullets: [
      'Numbers show filled runs in order for that row or column.',
      'There must be at least one blank between separate runs.',
      'Fill cells you know are part of a run.',
      'Mark cells you know are blank to avoid mistakes.',
    ],
  },
  options: [
    {
      id: 'boardSize',
      label: 'Board size',
      defaultValue: '10',
      options: [
        { value: '8', label: '8x8' },
        { value: '10', label: '10x10' },
        { value: '12', label: '12x12' },
        { value: '15', label: '15x15' },
        { value: '20', label: '20x20' },
        { value: '25', label: '25x25' },
      ],
    },
  ],
}
